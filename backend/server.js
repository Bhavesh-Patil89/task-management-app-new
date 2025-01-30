const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express(); 
const port = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory tasks array
let tasks = [];
let nextId = 1;

// GET all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// GET task by id
app.get('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
});

// POST new task
app.post('/api/tasks', (req, res) => {
    const task = {
        id: nextId++,
        title: req.body.title,
        description: req.body.description,
        completed: false,
        createdAt: new Date()
    };
    tasks.push(task);
    res.status(201).json(task);
});

// PUT update task
app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = {
        ...tasks[taskIndex],
        title: req.body.title || tasks[taskIndex].title,
        description: req.body.description || tasks[taskIndex].description,
        completed: req.body.completed !== undefined ? req.body.completed : tasks[taskIndex].completed
    };
    tasks[taskIndex] = updatedTask;
    res.json(updatedTask);
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
