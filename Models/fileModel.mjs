import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// ExpressJs and MongoDb Initializing Code
const mongoose = require('mongoose');


const fileSchema = new mongoose.Schema({                                            // file Schema
    file_name: String,
    file_content: String,
    file_created_on: String,
    file_created_by: String,
    project_name: String
});

const fileModel = new mongoose.model("files", fileSchema);                          // file Model

export default fileModel;