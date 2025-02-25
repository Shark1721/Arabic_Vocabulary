const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to get categories
app.get('/api/categories', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'words.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).json({ message: 'Failed to load categories.' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to add new category
app.post('/api/categories', (req, res) => {
    const newCategory = req.body;
    const filePath = path.join(__dirname, 'public', 'words.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).json({ message: 'Failed to read categories.' });
            return;
        }

        const categories = JSON.parse(data);
        categories[newCategory.name] = newCategory.words;

        fs.writeFile(filePath, JSON.stringify(categories, null, 4), (err) => {
            if (err) {
                console.error('Error saving new category:', err);
                res.status(500).json({ message: 'Failed to save category.' });
                return;
            }
            res.status(201).json({ message: 'New category added successfully!' });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
