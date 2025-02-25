const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'miniproject', // Replace with your MySQL password
    database: 'educationPlatform'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

// Register API
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO Users (username, email, password) VALUES (?, ?, ?)`;
    db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error registering user', error: err });
        } else {
            res.status(201).json({ message: 'User registered successfully' });
        }
    });
});

// Login API
// Login API
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM Users WHERE email = ?`;
    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) {
            res.status(401).json({ message: 'Invalid email or password' });
        } else {
            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                res.status(200).json({ message: 'Login successful', user });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
