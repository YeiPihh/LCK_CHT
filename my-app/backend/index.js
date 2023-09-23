//index.js
const express = require('express');
const session = require('express-session'); // <-- Añade esta línea
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const server = require('http').Server(app);
const socketio = require('socket.io')(server);
const passport = require('passport');
const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./routes/loginRoute');
const mysql = require('mysql2/promise');

app.use(cors({
  origin: 'http://localhost:3000',  // Cambia esto al origen de tu frontend
  credentials: true
}));
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

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configura las sesiones ANTES de las rutas y Passport
app.use(session({
  secret: '020901',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambia a true si estás usando HTTPS
}));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session()); // <-- Asegúrate de que esta línea esté después de la configuración de session

app.get('/', (req, res) => {
    res.sendFile(__dirname + '../frontend/index.js' );
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
}



app.use('/register', registerRoute);
app.use('/login', loginRoute);

app.get('/chat', ensureAuthenticated, async (req, res) => {
  const user = {
    username: req.user.username,
    id: req.user.id // Aquí es donde obtienes el ID del usuario desde tu base de datos o sesión
  };
    
  const contacts = await getContactsForUser(user.id);
  res.json({succes:true, user: user, contacts: contacts });
});

app.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
        res.redirect('/login');  // Redirecciona al usuario a la página de inicio de sesión
    });
});

app.get('/chat-history/:contactId', ensureAuthenticated, async (req, res) => {
  const contactId = req.params.contactId;
  const userId = req.user.id;

  // Aquí debes obtener el historial del chat desde la base de datos
  const chatHistory = await getChatHistory(userId, contactId);

  res.json({ success: true, messages: chatHistory });
});

app.get('/friend-requests', ensureAuthenticated, async (req, res) => {
  const userId = req.user.id;
  const friendRequestsData = await getfriendRequestsData(userId);
  res.json({ success: true, friendRequests: friendRequestsData });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

  



const port = process.env.PORT || 4567;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
