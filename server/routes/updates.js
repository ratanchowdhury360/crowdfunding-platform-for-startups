import express from 'express';
import Update from '../models/Update.js';
import Project from '../models/Project.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Get updates for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const updates = await Update.find({ project: req.params.projectId })
      .sort({ createdAt: -1 });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create update (entrepreneur only)
router.post('/project/:projectId', auth, checkRole(['entrepreneur']), async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      entrepreneur: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    const update = new Update({
      ...req.body,
      project: req.params.projectId
    });

    await update.save();
    res.status(201).json(update);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an update (entrepreneur only)
router.patch('/:id', auth, checkRole(['entrepreneur']), async (req, res) => {
  try {
    const update = await Update.findById(req.params.id);
    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }

    const project = await Project.findOne({
      _id: update.project,
      entrepreneur: req.user._id
    });

    if (!project) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    Object.assign(update, req.body);
    await update.save();
    
    res.json(update);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an update (entrepreneur only)
router.delete('/:id', auth, checkRole(['entrepreneur']), async (req, res) => {
  try {
    const update = await Update.findById(req.params.id);
    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }

    const project = await Project.findOne({
      _id: update.project,
      entrepreneur: req.user._id
    });

    if (!project) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await update.deleteOne();
    res.json({ message: 'Update deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 