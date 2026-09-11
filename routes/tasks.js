const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// all task routes require authentication
router.use(auth);

// GET /api/tasks - get all tasks for current user
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.session.userId })
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error('Get tasks error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/tasks - create a new task
router.post('/', async (req, res) => {
    try {
        const { title, description, status } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Task title is required' });
        }

        const task = new Task({
            title: title.trim(),
            description: description ? description.trim() : '',
            status: status || 'pending',
            userId: req.session.userId
        });

        await task.save();
        res.status(201).json(task);
    } catch (err) {
        console.error('Create task error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/tasks/:id - update a task
router.put('/:id', async (req, res) => {
    try {
        const { title, description, status } = req.body;

        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.session.userId
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (title !== undefined) {
            if (title.trim() === '') {
                return res.status(400).json({ message: 'Task title cannot be empty' });
            }
            task.title = title.trim();
        }
        if (description !== undefined) task.description = description.trim();
        if (status !== undefined) task.status = status;

        await task.save();
        res.json(task);
    } catch (err) {
        console.error('Update task error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/tasks/:id - delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.session.userId
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Delete task error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
