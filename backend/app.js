const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const mapsRoutes = require('./routes/maps.routes');


// Update CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

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

connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapsRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('join', (data) => {
    console.log('User joined:', data)
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const PORT = process.env.PORT || 4000

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
    console.error('Server error:', error)
    process.exit(1)
  }
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})