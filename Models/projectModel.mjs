import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// ExpressJs and MongoDb Initializing Code
const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({                                         // Project Schema
    project_name: String,
    project_files: Array,
    project_created_on: String,
    project_created_by: String,
    project_contributors: Array
});

const projectModel = new mongoose.model("projects", projectSchema);                 // Project Model


export default  projectModel; 