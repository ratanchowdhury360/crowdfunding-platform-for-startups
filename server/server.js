import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import updateRoutes from './routes/updates.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with better error handling
const MONGODB_URI = 'mongodb+srv://user1:user1@cluster0.p4fug27.mongodb.net/crowdfunding?retryWrites=true&w=majority';

mongoose.set('strictQuery', false); // Add this line to handle deprecation warning

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Full error:', error);
    process.exit(1); // Exit with failure
  }
};

// Connect to MongoDB
connectDB();

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Crowdfunding Platform API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/updates', updateRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't exit the process in development
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
}); 