// socket.js
const pool = require('./config/dbConfig.js');

async function saveMessage(senderId, receiverId, content) {

    try {
      await pool.query('INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES (?, ?, ?, NOW())', [senderId, receiverId, content]);
      
    } catch (error) {
      console.error('Error al guardar el mensaje:', error);
    }
}

const parseDate = (date) => { 
  date = date.substring(0, 19);
}


const userSockets = {};
const userIds = {};

module.exports = function(socketio) {
    socketio.on('connection', (socket) => {
        socket.on('informationUser', (data) => {
          userSockets[data.userId] = socket;
          userIds[socket.id] = data.userId;
        });
        

          socket.on('openChat', async (contactId) => {
            const userId = userIds[socket.id]; 
            const [messages] = await pool.query('SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp', [userId, contactId, contactId, userId]);
      
            // Enviar los mensajes al cliente
            socket.emit('chatHistory', messages);
          });

        socket.on('sendFriendRequest', async (receiverUsername) => {
          const senderId = parseInt(userIds[socket.id]);

          try {
            const [results] = await pool.query('SELECT id FROM users WHERE username = ?', [receiverUsername]);
            const receiverId = results[0].id;
            const [existingRequests] = await pool.query('SELECT * FROM friend_requests WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)', [senderId,receiverId, receiverId, senderId]);
            const [existingContacts] = await pool.query('SELECT * FROM contacts WHERE (user_id = ? AND contact_id = ?) OR (user_id = ? AND contact_id = ?)', [senderId, receiverId,receiverId, senderId]);

            
            if (results.length === 0) {
              socket.emit('friendRequestError', 'Usuario no encontrado');
              return;
            }
            else if (senderId === receiverId) {
              socket.emit('friendRequestError', 'No puedes enviarte una solicitud a ti mismo');
              return;
            }
            else if (existingRequests.length > 0) {
             if (existingRequests[0].status === 'pendiente') {
               if (existingRequests[0].sender_id === senderId) {
                 socket.emit('friendRequestError', 'You alredy sent a friend request to this person');
                 return;
               }
               else if (existingRequests[0].sender_id !== senderId) {
                 socket.emit('friendRequestError', 'This person alredy sent you a friend request');
                 return;
               }
             }
             else if (existingRequests[0].status === 'aceptado' && existingContacts.length > 0) {
              socket.emit('friendRequestError', 'Ya eres amigo de esta persona');
              return;
             } 
            } else {
              await pool.query('INSERT INTO friend_requests (sender_id, receiver_id, status) VALUES (?, ?, "pendiente")', [senderId, receiverId]);
              socket.emit('friendRequestSuccess', 'Solicitud enviada exitosamente');
            }
          } catch (error) {
            console.error('Error al enviar la solicitud de amistad:', error);
            socket.emit('friendRequestError', 'Error al enviar la solicitud');
          }
        });

        socket.on('acceptFriendRequest', async (senderId) => {
            const receiverId = userIds[socket.id];
            
            try {
              const [existingContacts] = await pool.query('SELECT * FROM contacts WHERE (user_id = ? AND contact_id = ?) OR (user_id = ? AND contact_id = ?)', [senderId, receiverId, receiverId, senderId]);

              if (existingContacts.length > 0) {  
                socket.emit('acceptFriendRequestError', 'This person is alredy your friend');
              } else {
                await pool.query('UPDATE friend_requests SET status = "aceptado" WHERE sender_id = ? AND receiver_id = ?', [senderId, receiverId]);
                await pool.query('INSERT INTO contacts (user_id, contact_id) VALUES (?, ?), (?, ?)', [senderId, receiverId, receiverId, senderId]);
                const [newContact] = await pool.query('SELECT u.username, c.contact_id, m.content as lastMessage, m.timestamp FROM contacts c JOIN users u ON u.id=c.contact_id LEFT JOIN messages m ON m.sender_id=c.user_id WHERE user_id=? and contact_id=?', [receiverId, senderId]);
                socket.emit('acceptFriendRequestSuccess', 'Solicitud aceptada exitosamente');
                socket.emit('getNewContacts', newContact);
              }
            } catch (error) {
              console.error('Error al aceptar la solicitud de amistad:', error);
              socket.emit('acceptFriendRequestError', 'Error al aceptar la solicitud');
            }
        });

        socket.on('ignoreFriendRequest', async (senderId) => {
            const receiverId = userIds[socket.id];
            
            try {
              const [existingContacts] = await pool.query('SELECT * FROM contacts WHERE (user_id = ? AND contact_id = ?) OR (user_id = ? AND contact_id = ?)', [senderId, receiverId, receiverId, senderId]);

              if (existingContacts.length > 0) {  
                socket.emit('ignoreFriendRequestError', 'This person is alredy your friend');
              } else {
                await pool.query('UPDATE friend_requests SET status = "ignorado" WHERE sender_id = ? AND receiver_id = ?', [senderId, receiverId]);
                socket.emit('ignoreFriendRequestSuccess', 'Solicitud denegada exitosamente');
              }
            } catch (error) {
              console.error('Error al denegar la solicitud de amistad:', error);
              socket.emit('ignoreFriendRequestError', 'Error al denegar la solicitud');
            }
        });
        
        socket.on('sendMessage', async (data) => {
          const { sender_id, receiver_id, content } = data;

          try {
            await saveMessage(sender_id, receiver_id, content);
          } catch (error) {
            socket.emit('sendMessageError', error)
          }

          try {
            const [results] = await pool.query('select * from messages where id = (select max(id) from messages)');
            
            const newData = {
              id: results[0].id,
              sender_id: results[0].sender_id,
              receiver_id: results[0].receiver_id,
              content: results[0].content,
              timestamp: results[0].timestamp,
              showSender: results[0].showSender,
              showReceiver: results[0].showReceiver
            }

            const receiverSocketId = userSockets[receiver_id];
            if (receiverSocketId) {
              receiverSocketId.emit('receiveMessage', newData);
            }

            const senderSocket = userSockets[sender_id];
            if (senderSocket) {
              senderSocket.emit('receiveMessage', newData)
            }

          } catch (error) {

            console.log(error, 'error al recuperar el ultimo mensaje')
          }

        });

        socket.on('clearChat', async(receiverId)=> {
          const userId = userIds[socket.id];
          try{
            await pool.query('UPDATE messages SET showSender = CASE WHEN sender_id=? AND receiver_id=? THEN 0 ELSE 1 END, showReceiver = CASE WHEN sender_id=? AND receiver_id=? THEN 0 ELSE 1 END', [userId, receiverId, receiverId, userId]);
            socket.emit('clearChatSuccess', 'Chat cleared successfully');
          } catch (error) {
            socket.emit('clearChatError', error);
          }
        });

        socket.on('newContacts', async() => {
          console.log('ejecucion socket newcontacts')
          const userId = userIds[socket.id];
          try{
            const queryGetContactsLastMessage=`
            SELECT DISTINCT
            u.username,
            CASE
                WHEN c.user_id = ? THEN c.contact_id
                ELSE c.user_id
            END as contact_id,
            m.id as messageId,
            m.content as lastMessage,
            m.timestamp,
            m.showSender,
            m.showReceiver,
            m.sender_id,
            m.receiver_id
          FROM contacts c
          JOIN users u ON u.id = CASE
            WHEN c.user_id = ? THEN c.contact_id
            ELSE c.user_id
          END
          LEFT JOIN (
              SELECT 
                  LEAST(sender_id, receiver_id) AS user1,
                  GREATEST(sender_id, receiver_id) AS user2,
                  MAX(id) AS max_id
              FROM messages
              WHERE (sender_id = ? OR receiver_id = ?) AND showSender = CASE WHEN sender_id=? THEN 1 ELSE showSender END AND showReceiver = CASE WHEN receiver_id=? THEN 1 ELSE showReceiver END 
              GROUP BY user1, user2
          ) lastMsg ON (LEAST(c.user_id, c.contact_id) = lastMsg.user1 AND
                        GREATEST(c.user_id, c.contact_id) = lastMsg.user2)
          LEFT JOIN messages m ON m.id = lastMsg.max_id
          WHERE (c.contact_id = ? OR c.user_id = ?)
          AND NOT (c.contact_id = ? AND c.user_id = ?) ORDER BY m.timestamp DESC;
          ;
            `;
            const [results] = await pool.query(queryGetContactsLastMessage, [userId, userId, userId, userId, userId, userId, userId, userId, userId, userId, userId]);
            socket.emit('newContactsSuccess', results);
          } catch (error) {
            socket.emit('newContactsError', error);
            console.log('error en newContacts', error)
          }
        });

        socket.on('deleteContact', async (contactId)=> {
          let connection;
          try {
            const userId = userIds[socket.id];
            connection = await pool.getConnection();
            await connection.beginTransaction();

            await connection.query('DELETE FROM contacts WHERE (user_id = ? AND contact_id = ?) OR (user_id = ? AND contact_id = ?)', [userId, contactId, contactId, userId]);
            await connection.query('DELETE FROM friend_requests WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)', [userId, contactId, contactId, userId]);
            await connection.query('DELETE FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)', [userId, contactId, contactId, userId]);

            await connection.commit();
            socket.emit('deleteContactSuccess', 'Contacto eliminado correctamente');

          } catch (error) {
            socket.emit('deleteContactError', error)
          } finally {
            if (connection) connection.release();
          };
        });

        socket.on('deleteMessageForAll', async (messageInfo) => {
          const {id, sender_id, receiver_id, content, timestamp, showSender, showReceiver } = messageInfo;
          const timestampParsed = parseDate(timestamp);
         
          const userId = userIds[socket.id];
          const contactId = userId === sender_id ? receiver_id : sender_id;

          const queryGetLastMessage = `
            SELECT * FROM messages WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND showReceiver = CASE WHEN receiver_id=? THEN 1 ELSE showReceiver END AND showSender = CASE WHEN sender_id=? THEN 1 ELSE showSender END ORDER BY timestamp DESC LIMIT 1 
          `;

          const queryDeleteMessageForAll = `
            DELETE FROM messages WHERE id = ?
          `;

          const queryInsertMessage = `
            INSERT INTO deleted_messages (sender_id, receiver_id, content, timestamp, showSender, showReceiver) VALUES (?, ?, ?, ?, ?, ?)
          `;

          try {
            
            const lastMessage = await pool.query(queryGetLastMessage,[userId, contactId, contactId, userId, userId, userId]);
            
            await pool.query(queryDeleteMessageForAll,[id]);
  
            const newLastMessage = lastMessage[0][0].id === id ? await pool.query(queryGetLastMessage,[userId, contactId, contactId, userId, userId, userId]) : null;

            const resultNewLastMessage = newLastMessage ? newLastMessage[0][0] : null;

            socket.emit('deleteMessageForAllSuccess', resultNewLastMessage);

          } catch (error) {
            socket.emit('deleteMessageForAllError', error);
            console.log('error en deleteMessageForAll', error);
          }

          try {
            pool.query(queryInsertMessage, [sender_id, receiver_id, content, timestampParsed, showSender, showReceiver]);
          } catch (error) {
            console.log('error insertando el mensaje en deleted_messages', error)
          }
        });

        socket.on('deleteMessageForMe', async (messageInfo) => {

          const userId = userIds[socket.id];
          const {id, sender_id, receiver_id, content, timestamp, showSender, showReceiver } = messageInfo;

          const contactId = userId === sender_id ? receiver_id : sender_id;

          const queryDeleteMessageForMe = `
            UPDATE messages SET showSender = CASE WHEN sender_id=? THEN 0 ELSE 1 END, showReceiver = CASE WHEN receiver_id=? THEN 0 ELSE 1 END WHERE id = ?
          `;

          const queryGetLastMessage = `
            SELECT * FROM messages WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND showReceiver = CASE WHEN receiver_id=? THEN 1 ELSE showReceiver END AND showSender = CASE WHEN sender_id=? THEN 1 ELSE showSender END ORDER BY timestamp DESC LIMIT 1 
          `;

          try {
            const lastMessage = await pool.query(queryGetLastMessage,[userId, contactId, contactId, userId, userId, userId]);
            await pool.query(queryDeleteMessageForMe,[userId, userId, id]);
            
  
            const newLastMessage = lastMessage[0][0].id === id ? await pool.query(queryGetLastMessage,[userId, contactId, contactId, userId, userId, userId]) : null;

            const resultNewLastMessage = newLastMessage ? newLastMessage[0][0] : null;
            
            socket.emit('deleteMessageForMeSuccess', resultNewLastMessage);

          } catch (error) {
            console.log('error en deleteMessageForMe', error);
            socket.emit('deleteMessageForMeError', error);
          }
        
        });
    });
};
