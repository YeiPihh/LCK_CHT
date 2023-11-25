// socket.js
const pool = require('./config/dbConfig.js');

async function saveMessage(senderId, contactId, content) {
    try {
      await pool.query('INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES (?, ?, ?, NOW())', [senderId, contactId, content]);
    } catch (error) {
      console.error('Error al guardar el mensaje:', error);
    }
}


const userSockets = {};
const userIds = {};

module.exports = function(socketio) {
    socketio.on('connection', (socket) => {
        console.log('Un usuario se ha conectado');
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
          console.log(userIds[socket.id])

          try {
            const [results] = await pool.query('SELECT id FROM users WHERE username = ?', [receiverUsername]);
            const receiverId = results[0].id;
            const [existingRequests] = await pool.query('SELECT * FROM friend_requests WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)', [senderId,receiverId, receiverId, senderId]);
            const [existingContacts] = await pool.query('SELECT * FROM contacts WHERE (user_id = ? AND contact_id = ?) OR (user_id = ? AND contact_id = ?)', [senderId, receiverId,receiverId, senderId]);
            console.log('line 43 socket.js: ',existingRequests)
            // console.log('line 44 socket.js: ',existingRequests[0].status)
            
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
                socket.emit('acceptFriendRequestSuccess', 'Solicitud aceptada exitosamente');
              }
            } catch (error) {
              console.error('Error al aceptar la solicitud de amistad:', error);
              socket.emit('acceptFriendRequestError', 'Error al aceptar la solicitud');
            }
        });
        
        socket.on('sendMessage', async (data) => {
            
            const { senderId, receiverId, content } = data;
            console.log('socket',receiverId);
            await saveMessage(senderId, receiverId, content);

            const receiverSocket = userSockets[receiverId];
            if (receiverSocket) {
              receiverSocket.emit('receiveMessage', data);
            }

          });
    });
};
