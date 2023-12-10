//index.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const cors = require('cors');
const server = require('http').Server(app);
const socketio = require('socket.io')(server, {
  cors: {
    origin: ["http://192.168.1.54:3001", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true
  }
});
const passport = require('passport');
const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./routes/loginRoute');
const pool = require('./config/dbConfig.js');

require('./config/passportConfig')(passport);
require('./socket.js')(socketio);

async function getfriendRequestsData (userId) {
  try {
    // Realizar la consulta SQL para obtener todas las solicitudes de amistad para un usuario específico
    const [results] = await pool.query('SELECT friend_requests.*, users.username AS senderUsername FROM friend_requests JOIN users ON friend_requests.sender_id = users.id WHERE friend_requests.receiver_id = ? and status = ?', [userId, 'pendiente']);

    return results; // Esto devolverá un array de objetos, donde cada objeto representa una fila de la tabla
  } catch (error) {
    console.error('Error al obtener las solicitudes de amistad:', error);
    return [];
  }
}

async function getContactsForUser(userId) {
  try {

    const queryconIDs= `SELECT DISTINCT
    u.username,
    CASE 
        WHEN c.user_id = ? THEN c.contact_id 
        ELSE c.user_id 
    END as contact_id,
    m.content as lastMessage,
    m.timestamp,
    m.isLast
FROM
    contacts c
JOIN
    users u ON (c.contact_id = u.id AND c.user_id = ? ) OR (c.user_id = u.id AND c.contact_id = ?)
LEFT JOIN
    (SELECT sender_id, receiver_id, isLast
     FROM messages
     WHERE isLast = 1
     GROUP BY sender_id, receiver_id) AS lastMsg ON (lastMsg.sender_id = c.contact_id AND lastMsg.receiver_id = c.user_id) OR (lastMsg.sender_id = c.user_id AND lastMsg.receiver_id = c.contact_id)
     LEFT JOIN
     messages m ON m.sender_id = lastMsg.sender_id AND m.receiver_id = lastMsg.receiver_id AND m.isLast = lastMsg.isLast
     WHERE 
     (c.contact_id = ? OR c.user_id = ?)
     AND 
     NOT (c.contact_id = ? AND c.user_id = ?);
     `;
     
     const queryGetContacts = `
       SELECT DISTINCT 
       u.username, 
       m.content as lastMessage, 
       m.timestamp, 
       m.isLast 
       FROM 
           contacts c 
       JOIN 
           users u ON (c.contact_id = u.id AND c.user_id = ? ) OR (c.user_id = u.id AND c.contact_id = ?)
       LEFT JOIN 
           (SELECT sender_id, receiver_id, isLast
            FROM messages 
            WHERE isLast = 1
            GROUP BY sender_id, receiver_id) AS lastMsg ON (lastMsg.sender_id = c.contact_id AND lastMsg.receiver_id = c.user_id) OR (lastMsg.sender_id = c.user_id AND lastMsg.receiver_id = c.contact_id)
       LEFT JOIN 
           messages m ON m.sender_id = lastMsg.sender_id AND m.receiver_id = lastMsg.receiver_id AND m.isLast = lastMsg.isLast
       WHERE 
           (c.contact_id = ? OR c.user_id = ?) ORDER BY m.timestamp DESC;
     `;

     const queryMaxTime=`
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

    const [results] = await pool.query(queryMaxTime, [userId, userId, userId, userId, userId, userId, userId, userId, userId, userId, userId]);

    return results;
} catch (error) {
    console.error('Error al obtener contactos:', error);
    return [];
  }
}

async function getChatHistory(userId, contactId) {
  try {
    // Ajusta esta consulta según tus necesidades
    // const [results] = await pool.query(
    //   'SELECT m.* FROM messages m WHERE ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)) AND (sender_id = ? AND showSender = 1 AND receiver_id = ? AND showReceiver = 1) ORDER BY m.timestamp',
    //   [userId, contactId, contactId, userId, userId, userId ]);

      const [results] = await pool.query('SELECT m.* FROM messages m WHERE ((m.sender_id = ? AND m.receiver_id = ? AND m.showSender = 1) OR (m.sender_id = ? AND m.receiver_id = ? AND m.showReceiver = 1)) ORDER BY m.timestamp',[userId, contactId, contactId, userId]);
  
    return results;
  } catch (error) {
    console.error('Error al obtener el historial del chat:', error);
    return [];
  }
}

async function getUnreadMessages(userId, contactId) {
  try {
    // Ajusta esta consulta según tus necesidades
    const [results] = await pool.query(
      'SELECT urm.*, m.timestamp FROM unread_messages urm JOIN messages ON urm.message_id = m.id WHERE (m.sender_id = ? AND m.receiver_id = ?) ORDER BY m.timestamp',
      [contactId, userId]
    );
    return results;
  } catch (error) {
    console.error('Error al obtener los mensajes no leidos del chat:', error);
    return [];
  }
}

async function getResumeUnreadMessage(userId, contactId) {
  try {
    // Ajusta esta consulta según tus necesidades
    const [results] = await pool.query(
      'SELECT urm.*, m.timestamp FROM unread_messages urm JOIN messages ON urm.message_id = m.id WHERE (m.receiver_id = ?) ORDER BY m.timestamp',
      [contactId, userId]
    );
    return results;
  } catch (error) {
    console.error('Error al obtener el resumen de los mensajes no leidos:', error);
    return [];
  }
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar las sesiones ANTES de las rutas y Passport
app.use(session({
  secret: '020901',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambiar a true si se usa HTTPS
}));

app.use(cors({
  origin: ["http://192.168.1.54:3001", "http://localhost:3001"],
  credentials: true
}));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session()); // <-- esta línea después de la configuración de session

app.get('/', (req, res) => {
    res.sendFile(__dirname + '../frontend/index.js' );
});

app.use('/register', registerRoute);
app.use('/login', loginRoute);

// Endpoint para verificar el estado de autenticación
app.get('/check-authentication', async (req, res, next) => {
  if (req.session && req.session.userId) {
    next(); // El usuario está autenticado, continúa con la siguiente función en la cadena
  } else {
    res.status(401).send('No autorizado'); // El usuario no está autenticado
  }
});

// Endpoint para enviar la informacion de username y id al frontend
app.get('/chat', ensureAuthenticated, async (req, res) => {
  const user = {
    username: req.user.username,
    id: req.user.id // Aquí es donde se obtiene el ID del usuario desde la base de datos o sesión
  };
  
  const contacts = await getContactsForUser(user.id);
  res.json({success:true, user: user, contacts: contacts });
});

app.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
        if (err) {
          res.status(500).json({ status: 'failed', message: 'Logout failed' });
        } else {
          res.status(200).json({ status:'success', message: 'Logged out successfully' });
        }
    });
});

app.get('/chat-history/:contactId', ensureAuthenticated, async (req, res) => {
  const contactId = req.params.contactId;
  const userId = req.user.id;

  // obtener el historial del chat desde la base de datos
  const chatHistory = await getChatHistory(userId, contactId);

  res.json({ success: true, messages: chatHistory });
});

app.get('/friend-requests', ensureAuthenticated, async (req, res) => {
  const userId = req.user.id;
  const friendRequestsData = await getfriendRequestsData(userId);
  res.json({ success: true, friendRequests: friendRequestsData });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname));
});

  



const port = process.env.PORT || 4567;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
