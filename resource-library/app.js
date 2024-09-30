const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Simple in-memory data storage
let users = [];
let resources = [];

// Load users from JSON file
const loadUsers = () => {
    if (fs.existsSync(path.join(__dirname, 'users.json'))) {
        users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json')));
    }
};

// Save users to JSON file
const saveUsers = () => {
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
};

// Load resources from JSON file
const loadResources = () => {
    const resourcesFilePath = path.join(__dirname, 'resources.json');
    if (fs.existsSync(resourcesFilePath)) {
        resources = JSON.parse(fs.readFileSync(resourcesFilePath));
        console.log("Resources loaded:", resources); // Debugging line
    } else {
        console.log("resources.json file not found!"); // Debugging line
    }
};

// Save resources to JSON file
const saveResources = () => {
    fs.writeFileSync(path.join(__dirname, 'resources.json'), JSON.stringify(resources, null, 2));
};

// Load existing users and resources at startup
loadUsers();
loadResources();

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.send("Username already exists! <a href='/register'>Try again</a>");
    }
    users.push({ username, password });
    saveUsers();
    res.send("Registration successful! <a href='/login'>Login here</a>");
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.send("Invalid username or password! <a href='/login'>Try again</a>");
    }
    req.session.user = user;
    res.redirect('/resources');
});

app.get('/resources', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    if (resources.length === 0) {
        return res.send("No resources available.");
    }
    res.render('resources', { resources }); // Pass resources to the template
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send("Error logging out!");
        }
        res.redirect('/');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
