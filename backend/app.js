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
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  transports: ['websocket', 'polling']
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('join', (data) => {
    
    socket.join(data.userId)
    
    // Test emit - remove this in production
    setTimeout(() => {
      socket.emit('new_ride_request', {
        pickup: "Test Pickup Location",
        destination: "Test Destination",
        fare: "₹150",
        distance: "5km"
      })
    }, 5000)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

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