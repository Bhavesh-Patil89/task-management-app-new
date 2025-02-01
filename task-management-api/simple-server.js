const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Start server
const PORT = 9999;
try {
    app.listen(PORT, () => {
        console.log('Server started successfully');
        console.log(`Listening on port ${PORT}`);
    });
} catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
}
