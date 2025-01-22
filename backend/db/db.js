const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });

        console.log('Connected to MongoDB');

        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

        // Drop the problematic index if it exists
        const collections = await mongoose.connection.db.collections();
        const usersCollection = collections.find(collection => collection.collectionName === 'users');
        
        if (usersCollection) {
            try {
                await usersCollection.dropIndex('fullname.email_1');
                console.log('Dropped old problematic index');
            } catch (error) {
                // Index might not exist, which is fine
                if (!error.message.includes('index not found')) {
                    console.error('Error dropping index:', error);
                }
            }
        }

        // Ensure proper index on email field
        await mongoose.connection.collection('users').createIndex(
            { "email": 1 }, 
            { unique: true }
        );

    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Try to reconnect if connection fails
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;