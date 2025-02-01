const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({ message: 'Test server is working!' });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Test server is running on port ${PORT}`);
});
