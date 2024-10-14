const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
dotenv.config();


const PORT = process.env.PORT || 8000;
const { connection } = require('./config/db_config')
connection();

const errorMiddleware = require('./middleware/errorMiddleware');

const cors = require('cors');
// CORS options to allow requests from frontend running on port 5500
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT',
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Use CORS middleware with specified options
app.use(cors(corsOptions));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Testing Server',
      version: '1.0.0',
      description: 'Testing server using node.js',
    },
    servers: [
      { url: 'http://localhost:5000/api' }, //you can change you server url
    ],
  },

  apis: ['./routes/*.js'], //you can change you swagger path
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});
require('./services/notificationService').initialize(io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  //console.log(`User connected with socket ID: ${socket.id}`);

  // Extract user ID from the handshake query
  const userId = socket.handshake.query.userId;
  //console.log(`User ID from handshake: ${userId}`);

  // Join the user to their specific room
  socket.join(userId);
  //console.log(`User with ID ${userId} joined room ${userId}`);

  // Handle disconnection
  socket.on('disconnect', () => {
    //console.log(`User with ID ${userId} disconnected`);
  });
});



app.use(express.json());
app.use(errorMiddleware);
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/task', require('./routes/taskRoutes'))
app.use('/api/user', require('./routes/userRoutes'))
app.get('/', (req, res) => {
  res.send("Hello")
})
server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});