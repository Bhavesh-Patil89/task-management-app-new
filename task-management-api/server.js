
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9999;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Validation function
function validateTask(task) {
    const errors = [];
    if (!task.title || task.title.trim() === '') {
        errors.push('Title is required');
    }
    if (task.title && task.title.length > 100) {
        errors.push('Title must be less than 100 characters');
    }
    if (!['Low', 'Medium', 'High'].includes(task.priority)) {
        errors.push('Invalid priority. Must be Low, Medium, or High');
    }
    return errors;
}

// In-memory tasks array
let tasks = [];

// Create a new task
app.post('/api/tasks', (req, res) => {
    const validationErrors = validateTask(req.body);
    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }

    const newTask = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date(),
        completed: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
    // Optional: Add sorting and filtering
    const sortedTasks = tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedTasks);
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const updatedTaskData = req.body;

    // Find task index
    const index = tasks.findIndex(task => task.id === taskId);
    
    if (index === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    // Validate updated task
    const validationErrors = validateTask(updatedTaskData);
    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }

    // Merge existing task with updated data
    tasks[index] = {
        ...tasks[index],
        ...updatedTaskData,
        updatedAt: new Date()
    };

    res.json(tasks[index]);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const index = tasks.findIndex(task => task.id === req.params.id);
    if (index !== -1) {
        const deletedTask = tasks.splice(index, 1)[0];
        res.json(deletedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!', 
        error: process.env.NODE_ENV === 'production' ? {} : err.message 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});