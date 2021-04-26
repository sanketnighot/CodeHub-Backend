import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// ExpressJs and MongoDb Initializing Code
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ 
    name: String,                                           // User Schema
    email: String,
    password: String,
    projects: Object
});

const userModel = new mongoose.model('Users', userSchema);                          // User Model

export default  userModel; 