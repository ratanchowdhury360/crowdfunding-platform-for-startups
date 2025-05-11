import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  entrepreneur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fundingGoal: {
    type: Number,
    required: true,
    min: 0
  },
  currentFunding: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'funded', 'completed', 'cancelled'],
    default: 'draft'
  },
  investors: [{
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model('Project', projectSchema);
export default Project; 