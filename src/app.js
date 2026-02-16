const express = require('express');
const app = express();

// Parse JSON
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

module.exports = app;
