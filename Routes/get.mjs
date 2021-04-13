// ---------------------------------* Import Modules and start Server *-------------------------------------
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// ExpressJs and MongoDb Initializing Code
const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => { res.send("Welcome to CodeHub Server ... ('This is a root Path')") })
// ---------------------------------------------------------------------------------------------------------
// --------------------------------------------* User Schema *----------------------------------------------
import userModel from "../Models/userModel.mjs";
import projectModel from "../Models/projectModel.mjs";
import contactFormModel from "../Models/contactFormModel.mjs";
import fileModel from "../Models/fileModel.mjs";

// ---------------------------------------------* GET Routes *----------------------------------------------

