// socket.js
const pool = require('./config/dbConfig.js');

async function saveMessage(senderId, receiverId, content) {

    try {
      await pool.query('INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES (?, ?, ?, NOW(6))', [senderId, receiverId, content]);
      
    } catch (error) {
      console.error('Error al guardar el mensaje:', error);
    }
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
          
            const receiverSocketId = userSockets[receiver_id];
            if (receiverSocketId) {
              receiverSocketId.emit('receiveMessage', data);
            }

            const senderSocket = userSockets[sender_id];
            if (senderSocket) {
              senderSocket.emit('receiveMessage', data)
            }
          } catch (error) {
            socket.emit('sendMessageError', error)
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
          const userId = userIds[socket.id];
          try{
            const queryGetContactsLastMessage=`
            SELECT DISTINCT
        u.username,
        CASE
            WHEN c.user_id = ? THEN c.contact_id
            ELSE c.user_id
        END as contact_id,
        m.content as lastMessage,
        m.timestamp,
        m.showSender,
        m.showReceiver
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
          WHERE (sender_id = ? OR receiver_id = ?)
          GROUP BY user1, user2
      ) lastMsg ON (LEAST(c.user_id, c.contact_id) = lastMsg.user1 AND
                    GREATEST(c.user_id, c.contact_id) = lastMsg.user2)
      LEFT JOIN messages m ON m.id = lastMsg.max_id
      WHERE (c.contact_id = ? OR c.user_id = ?)
      AND NOT (c.contact_id = ? AND c.user_id = ?) ORDER BY m.timestamp DESC;
          ;
            `;
            const [results] = await pool.query(queryGetContactsLastMessage, [userId, userId, userId, userId, userId, userId, userId, userId, userId]);

            socket.emit('newContactsSuccess', results);
          } catch (error) {
            socket.emit('newContactsError', error);
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
    });
};
