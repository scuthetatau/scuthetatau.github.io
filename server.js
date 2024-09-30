const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');
const session = require('express-session');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: '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', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if using https
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = '.jpg'; // Save all files as .jpg
        const safeEmail = req.params.email.replace(/[@.]/g, '_'); // Replace @ and . in email for safe filenames
        cb(null, `${safeEmail}-${Date.now()}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB size limit
});

const spreadsheetFile = 'users.xlsx';

const readSpreadsheet = () => {
    if (!fs.existsSync(spreadsheetFile)) {
        const workbook = xlsx.utils.book_new();
        const worksheetData = [['email', 'firstName', 'lastName', 'graduationYear', 'family', 'class', 'role', 'points', 'profilePic', 'major']];
        const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');
        xlsx.writeFile(workbook, spreadsheetFile);
    }

    const workbook = xlsx.readFile(spreadsheetFile);
    const sheet = workbook.Sheets['Users'];
    return xlsx.utils.sheet_to_json(sheet, { defval: '' });
};

const writeSpreadsheet = (data) => {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');
    xlsx.writeFile(workbook, spreadsheetFile);
};

passport.use(new GoogleStrategy({
        clientID: '466990383918-5ptr16djoqrfeepld1ko4k5sro30i032.apps.googleusercontent.com', // Replace 'YOUR_CLIENT_ID' and 'YOUR_CLIENT_SECRET' with actual values from Google Cloud Console
        clientSecret: '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',
        callbackURL: 'http://localhost:5001/api/auth/google/callback'
    },
    async (token, tokenSecret, profile, done) => {
        try {
            let users = readSpreadsheet();
            let user = users.find(u => u.email === profile.emails[0].value);
            if (!user) {
                console.log(`User logging in doesn't have a registered email address in #users.xlsx.`);
                console.log(`User attempted to login with, email: "${profile.emails[0].value}"`);
                return done(null, false, { message: 'No account found for this email' });
            }
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    try {
        const users = readSpreadsheet();
        const user = users.find(u => u.email === email);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// OAuth routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            const message = info && info.message ? info.message : 'Login failed';
            return res.redirect(`http://localhost:3000/login?error=${encodeURIComponent(message)}`);
        }

        const token = jwt.sign({ id: user.email, role: user.role }, 'secret', { expiresIn: '1h' });
        res.redirect(`http://localhost:3000/dashboard?token=${token}&role=${user.role}`);
    })(req, res, next);
});

// Add a route to handle the root path '/'
app.get('/', (req, res) => {
    res.redirect('http://localhost:3000'); // Redirect to your React application's home page
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin' && req.user.role !== 'Webmaster' && req.user.role !== 'Scribe') {
        return res.sendStatus(403);
    }
    next();
};

// Route to get user info
app.get('/api/user-info', authenticateToken, (req, res) => {
    try {
        const users = readSpreadsheet();
        const user = users.find(u => u.email === req.user.id);
        if (!user) {
            return res.sendStatus(404); // User not found
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user info:', err);
        res.sendStatus(500);
    }
});

// Get All Users Route
app.get('/api/users', authenticateToken, (req, res) => {
    const users = readSpreadsheet();
    res.json(users);
});

app.get('/api/meet_the_brothers', (req, res) => {
    const users = readSpreadsheet();
    res.json(users);
});

// Route for uploading profile pictures
app.post('/api/upload-profile-pic/:email', upload.single('profilePic'), (req, res) => {
    const userEmail = req.params.email;

    let users = readSpreadsheet();
    let user = users.find(u => u.email === userEmail);

    if (!user) {
        return res.status(404).send('User not found');
    }

    user.profilePic = `uploads/${req.file.filename}`;
    writeSpreadsheet(users);

    res.send({ profilePic: user.profilePic });
});

// BRO-DATE FUNCTIONS AND ROUTES

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const groupUsers = (users) => {
    const shuffledUsers = shuffleArray(users);
    const groupSize = 4;
    const groups = [];
    for (let i = 0; i < shuffledUsers.length; i += groupSize) {
        groups.push(shuffledUsers.slice(i, i + groupSize));
    }
    return groups;
};

let currentBroDateGroups = groupUsers(readSpreadsheet());

// API to get BroDateWidget group
app.get('/api/brodate-groups-all', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        jwt.verify(token, 'secret');
        res.json({ groups: currentBroDateGroups });
    } catch (err) {
        console.error('Error verifying token or fetching BroDateWidget groups:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/brodate-group', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, 'secret');
        const email = decoded.id;

        // Find the group of the current user and filter out the current user's details
        let userGroup = [];
        for (let group of currentBroDateGroups) {
            if (group.some(user => user.email === email)) {
                userGroup = group.filter(user => user.email !== email);
                break;
            }
        }

        res.json({ group: userGroup });
    } catch (err) {
        console.error('Error verifying token or fetching BroDateWidget group:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Console command/endpoint to shuffle and make new groups for testing
app.get('/api/shuffle-groups', (req, res) => {
    currentBroDateGroups = groupUsers(readSpreadsheet());
    res.json({ message: 'Groups reshuffled successfully' });
});


// Endpoint for updating user details
app.put('/api/update-user', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(403);

    jwt.verify(token, 'secret', (err, user) => {
        if (err) return res.sendStatus(403);

        const users = readSpreadsheet();
        const index = users.findIndex(u => u.email === user.id);

        if (index === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        users[index] = {
            ...users[index],
            ...req.body
        };

        writeSpreadsheet(users);

        res.status(200).json(users[index]);
    });
});

app.put('/api/admin-update-user', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const users = readSpreadsheet();
        const {
            email,
            firstName,
            lastName,
            graduationYear,
            family,
            class: userClass,
            role,
            points,
            profilePic,
            major // New field added
        } = req.body;
        const userIndex = users.findIndex(u => u.email === email);

        if (userIndex === -1) {
            return res.status(404).json({message: 'User not found'});
        }

        const oldUser = users[userIndex];
        const newUser = {
            ...oldUser,
            firstName,
            lastName,
            graduationYear,
            family,
            class: userClass,
            role,
            points,
            profilePic,
            major // Update the field
        };

        // Log the changes
        if (oldUser.points !== newUser.points) {
            console.log(`Points changed for user ${email}: ${oldUser.points} -> ${newUser.points}`);
        }

        if (oldUser.firstName !== newUser.firstName) {
            console.log(`First name changed for user ${email}: ${oldUser.firstName} -> ${newUser.firstName}`);
        }

        if (oldUser.lastName !== newUser.lastName) {
            console.log(`Last name changed for user ${email}: ${oldUser.lastName} -> ${newUser.lastName}`);
        }

        if (oldUser.graduationYear !== newUser.graduationYear) {
            console.log(`Graduation year changed for user ${email}: ${oldUser.graduationYear} -> ${newUser.graduationYear}`);
        }

        if (oldUser.family !== newUser.family) {
            console.log(`Family changed for user ${email}: ${oldUser.family} -> ${newUser.family}`);
        }

        if (oldUser.class !== newUser.class) {
            console.log(`Class changed for user ${email}: ${oldUser.class} -> ${newUser.class}`);
        }

        if (oldUser.role !== newUser.role) {
            console.log(`Role changed for user ${email}: ${oldUser.role} -> ${newUser.role}`);
        }

        if (oldUser.profilePic !== newUser.profilePic) {
            console.log(`Profile picture changed for user ${email}: ${oldUser.profilePic} -> ${newUser.profilePic}`);
        }

        if (oldUser.major !== newUser.major) {
            console.log(`Major changed for user ${email}: ${oldUser.major} -> ${newUser.major}`);
        }

        users[userIndex] = newUser;

        writeSpreadsheet(users);
        res.json({message: 'User updated successfully'});
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});