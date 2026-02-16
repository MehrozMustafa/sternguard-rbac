const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Permission = require('../src/models/permission');
const Role = require('../src/models/role');
const User = require('../src/models/user');

const seed = async () => {
    await connectDB();

    // Clear existing data
    await Permission.deleteMany();
    await Role.deleteMany();
    await User.deleteMany();

    // Create permissions
    // const readUsers = await Permission.create({ name: 'read:any_user', description: 'Read any user' });
    // const editUsers = await Permission.create({ name: 'edit:any_user', description: 'Edit any user' });
    const deleteUsers = await Permission.create({ name: 'delete:any_user', description: 'Delete any user' });

    // permissions
    const readUsers = await Permission.create({ name: 'read:any_user', description: 'Can read any user' });
    const editUsers = await Permission.create({ name: 'edit:any_user', description: 'Can edit any user' });

    // Create roles
    // const adminRole = await Role.create({ name: 'admin', permissions: [readUsers._id, editUsers._id, deleteUsers._id] });
    // roles
    const adminRole = await Role.create({ name: 'admin', permissions: [readUsers._id, editUsers._id] });
    const editorRole = await Role.create({ name: 'editor', permissions: [readUsers._id, editUsers._id] });

    // Create a user
    await User.create({
        name: 'Mehroz',
        email: 'mehroz@example.com',
        password: 'password123', // later hash this for production
        roles: [adminRole._id]
    });

    console.log('Database seeded!');
    process.exit();
};

seed();
