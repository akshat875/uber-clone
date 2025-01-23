const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const UserModel = require('./models/user.model');
const CaptainModel = require('./models/captain.model');
const RideModel = require('./models/ride.model');


// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Hello World');
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/captains', captainRoutes);
app.use('/api/maps', mapsRoutes);  
app.use('/api/rides', rideRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Socket.IO setup with proper CORS
const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  allowEIO3: true,
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected with ID:', socket.id);

  // Handle user/captain joining
  socket.on('join', async (data) => {
    try {
      const { userId, userType } = data;
      console.log(`Attempting to join ${userType} with ID: ${userId}`);

      if (!userId || !userType) {
        socket.emit('error', { message: 'Missing userId or userType' });
        return;
      }

      let updateResult;
      if (userType === 'user') {
        updateResult = await UserModel.findByIdAndUpdate(
          userId,
          {
            socketId: socket.id,
            isOnline: true
          },
          { new: true }
        );
      } else if (userType === 'captain') {
        updateResult = await CaptainModel.findByIdAndUpdate(
          userId,
          {
            socketId: socket.id,
            isOnline: true
          },
          { new: true }
        );
      } else {
        socket.emit('error', { message: 'Invalid user type' });
        return;
      }

      if (!updateResult) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      socket.join(userId);
      socket.emit('joined', { message: 'Successfully joined', userId, userType });
      console.log(`${userType} with ID ${userId} joined successfully`);
    } catch (error) {
      console.error('Error in join event:', error);
      socket.emit('error', { message: 'Server error during join' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    try {
      // Update user status in both models
      await UserModel.findOneAndUpdate(
        { socketId: socket.id },
        { socketId: null, isOnline: false }
      );
      await CaptainModel.findOneAndUpdate(
        { socketId: socket.id },
        { socketId: null, isOnline: false }
      );
    } catch (error) {
      console.error('Error updating disconnect status:', error);
    }
  });
});

// Helper function to send message to specific socket
const sendMessageToSocketId = (socketId, messageObject) => {
  try {
    if (!io) {
      throw new Error('Socket.io not initialized');
    }

    if (!socketId || !messageObject || !messageObject.event) {
      throw new Error('Invalid message parameters');
    }

    console.log('Sending message:', messageObject);
    io.to(socketId).emit(messageObject.event, messageObject.data);
    return true;
  } catch (error) {
    console.error('Send message error:', error);
    return false;
  }
};

const PORT = process.env.PORT || 4000

// Connect to MongoDB first, then start the server
connectToDb().then(() => {
  // Add error handling for the server
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is already in use. Trying to close existing connection...`)
      require('child_process').exec(`npx kill-port ${PORT}`, (err) => {
        if (err) {
          console.error('Failed to kill process:', err)
          process.exit(1)
        }
        server.listen(PORT, () => {
          console.log(`Server restarted and running on port ${PORT}`)
        })
      })
    } else {
      
      process.exit(1)
    }
  })

  server.listen(PORT, () => {
    
  })
}).catch(error => {
  console.error('Failed to connect to MongoDB:', error)
  process.exit(1)
})