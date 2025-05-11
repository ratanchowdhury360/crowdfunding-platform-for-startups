import express from 'express';
import Project from '../models/Project.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'active' })
      .populate('entrepreneur', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('entrepreneur', 'name email')
      .populate('investors.investor', 'name email');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create project (entrepreneur only)
router.post('/', auth, checkRole(['entrepreneur']), async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      entrepreneur: req.user._id
    });
    
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update project (entrepreneur only)
router.patch('/:id', auth, checkRole(['entrepreneur']), async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      entrepreneur: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    Object.assign(project, req.body);
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Invest in project (investor only)
router.post('/:id/invest', auth, checkRole(['investor']), async (req, res) => {
  try {
    const { amount } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.status !== 'active') {
      return res.status(400).json({ message: 'Project is not accepting investments' });
    }

    project.investors.push({
      investor: req.user._id,
      amount
    });

    project.currentFunding += amount;

    if (project.currentFunding >= project.fundingGoal) {
      project.status = 'funded';
    }

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router; 