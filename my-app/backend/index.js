//index.js
const express = require('express');
const session = require('express-session'); // <-- Añade esta línea
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const server = require('http').Server(app);
const socketio = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true
  }
});
const passport = require('passport');
const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./routes/loginRoute');
const mysql = require('mysql2/promise');
require('./config/passportConfig')(passport);
require('./socket.js')(socketio);

const hostdb = 'containers-us-west-145.railway.app';
const userdb = 'root';
const passdb = 'SRGLy6fQXQmmq2isbnOA';
const databasedb = 'railway';
const portdb = 7680;

// conexion a la base de datos
let connection;
mysql.createConnection({
  host: hostdb,
  user: userdb,
  password: passdb,
  database: databasedb,
  port: portdb
}).then(conn => {
    connection = conn;
}).catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
});

async function getfriendRequestsData (userId) {
  try {
    // Realizar la consulta SQL para obtener todas las solicitudes de amistad para un usuario específico
    const [results] = await connection.query('SELECT friend_requests.*, users.username AS senderUsername FROM friend_requests JOIN users ON friend_requests.sender_id = users.id WHERE friend_requests.receiver_id = ?', [userId]);

    return results; // Esto devolverá un array de objetos, donde cada objeto representa una fila de la tabla
  } catch (error) {
    console.error('Error al obtener las solicitudes de amistad:', error);
    return [];
  }
}

async function getContactsForUser(userId) {
  try {
    const [results] = await connection.query('SELECT c.contact_id, u.username FROM contacts c JOIN users u ON c.contact_id = u.id WHERE c.user_id = ?', [userId]);

    for(let i = 0; i < results.length; i++) {
      const contact = results[i];
      const lastMessage = await getLastMessage(userId, contact.contact_id);
      contact.lastMessage = lastMessage[0] ? lastMessage[0].content : null;
    }

    return results;
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    return [];
  }
}

async function getChatHistory(userId, contactId) {
  try {
    // Ajusta esta consulta según tus necesidades
    const [results] = await connection.query(
      'SELECT m.* FROM messages m WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?) ORDER BY m.timestamp',
      [userId, contactId, contactId, userId]
    );
    return results;
  } catch (error) {
    console.error('Error al obtener el historial del chat:', error);
    return [];
  }
}

async function getLastMessage(userId, contactId) {
  try {
    const [results] = await connection.query(
      'select content from messages where ((receiver_id=? and sender_id=?) or (receiver_id=? and sender_id=?)) and timestamp = (select max(timestamp) from messages where ((receiver_id = ? AND sender_id = ?) OR (receiver_id = ? AND sender_id = ?)))',
      [userId, contactId, contactId, userId, userId, contactId, contactId, userId]
    );
    return results;
  } catch (error) {
    console.error('Error al obtener el ultimo mensaje del chat:', error);
    return [];
  }
}

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar las sesiones ANTES de las rutas y Passport
app.use(session({
  secret: '020901',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambiar a true si estás usando HTTPS
}));

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session()); // <-- esta línea después de la configuración de session

app.get('/', (req, res) => {
    res.sendFile(__dirname + '../frontend/index.js' );
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
}

app.use('/register', registerRoute);
app.use('/login', loginRoute);

// Endpoint para verificar el estado de autenticación
app.get('/check-authentication', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
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
  // console.log(user, contacts)
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
