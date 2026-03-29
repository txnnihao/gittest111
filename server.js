const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Read data
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Write data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Get all users
app.get('/api/users', (req, res) => {
    res.json(readData());
});

// Add user
app.post('/api/users', (req, res) => {
    const data = readData();
    const newUser = {
        id: data.length > 0 ? Math.max(...data.map(u => u.id)) + 1 : 1,
        name: req.body.name,
        level: req.body.level
    };
    data.push(newUser);
    writeData(data);
    res.status(201).json(newUser);
});

// Update user
app.put('/api/users/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const index = data.findIndex(u => u.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], name: req.body.name, level: req.body.level };
        writeData(data);
        res.json(data[index]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
    let data = readData();
    const id = parseInt(req.params.id);
    data = data.filter(u => u.id !== id);
    writeData(data);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
