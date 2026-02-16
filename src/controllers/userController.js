// Import models
const User = require('../models/user');
const Role = require('../models/role');       // <-- add this
const Permission = require('../models/permission'); // optional, if needed
const jwt = require('jsonwebtoken');


const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('roles');
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
    res.json({ token });
};

const getMehroz = (req, res) => {
    res.send('mehroz');
};

module.exports = { login, getMehroz };
