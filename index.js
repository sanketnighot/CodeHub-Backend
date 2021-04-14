// ---------------------------------* Import Modules and start Server *-------------------------------------
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// ExpressJs and MongoDb Initializing Code
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 8000;
app.listen(port, () => console.log(`CodeHub Server listening at http://localhost:${port} ...`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose.connect("mongodb://127.0.0.1:27017/codehub", {                             // Connecting to MongoDb Server
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Database Conncted ...");
});
app.get("/", (req, res) => { res.send("Welcome to CodeHub Server ... ('This is a root Path')") })
// ---------------------------------------------------------------------------------------------------------

// --------------------------------------------* User Schema *----------------------------------------------
import userModel from "./Models/userModel.mjs";
import projectModel from "./Models/projectModel.mjs";
import contactFormModel from "./Models/contactFormModel.mjs";
import fileModel from "./Models/fileModel.mjs";
// ------------------------------------------* SignUp / Login *---------------------------------------------

// Creating User
app.post('/signup', async (req, res) => {                                             // Rounte for Creating User
    let userObj = new userModel(req.body);
    let users = await userModel.findOne({ email: userObj.email, password: userObj.password }, (err, user) => { console.log({ error: err }); });
    if (users != null) {
        res.send({
            message: "User already Exists",
            userData: users
        });
    }
    else {
        userObj.save().then(async () => {
            let users = await userModel.findOne({ email: userObj.email, password: userObj.password }, (err, user) => { console.log({ error: err }); });
            if (users != null) {
                res.send({
                    message: "User Created",
                    userData: users
                });
            }
        }).catch((error) => {
            res.send(error.message)
        })
    }

});

// Getting User Info
app.get('/user-email=:email&password=:password', async (req, res) => {                // Route for Getting User Info
    const userParams = req.params
    let users = await userModel.findOne(userParams, (err, user) => { console.log({ error: err }); });
    if (users != null) {
        res.send(users);
    }
    else {
        res.status(404).send("User Not Found")
    }
});

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------* Create Project Schema *-----------------------------------------

app.post('/createproject', async (req, res) => {                                    // Route for Creating Project
    const data = req.body;
    let creator = await userModel.findOne({ email: data.project_created_by }, (err, user) => { console.log({ error: err }); });
    console.log(data);
    if (creator != null) {
        let projData = new projectModel(data);
        projData.save().then(() => {
            res.send({ message: "Project Created successfully !!!" });
        }).catch(err => { res.send(err) });
    }
    else {
        res.status(404).send({ message: "Creator Not Found !!!" });
    }
});

app.get('/project-project_name=:project_name&user=:user', async (req, res) => {     // Route to fetch Particular Project
    let getProjectName = req.params.project_name;
    let getUser = req.params.user;
    let fetchProject = await projectModel.find({ project_name: getProjectName }, (err, user) => { console.log({ error: err }); });
    for (let proj of fetchProject) {
        if ((proj.project_contributors).includes(getUser)) {
            res.send({ project: proj });
        }
        else {
            res.status(404).send({ message: `Project Named ${getProjectName} having user ${getUser} Not Found` });
        }
    }
});

app.get('/allproject-user=:user', async (req, res) => {                             // Route to fetch All Projects of Perticular User
    let getUser = req.params.user;
    let fetchProject = await projectModel.find();
    let getAllProjects = []
    for (let proj of fetchProject) {
        if ((proj.project_contributors).includes(getUser) || (proj.project_created_by.email == getUser)) {
            getAllProjects.push(proj);
        }
    }
    if (getAllProjects != []) {
        res.send({ allProjects: getAllProjects, totalProjects: getAllProjects.length });
    }
    else {
        res.status(404).send({ message: `Project Not Found for user ${getUser}` });
    }
});

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------* Add Files to Project *------------------------------------------

app.post('/addfile', async (req, res) => {                                          // Route to add file
    let fileRecived = new fileModel(req.body);
    let nowProject = await projectModel.findOne({ project_name: req.body.project_name }, (err, project) => { console.log(err) });
    if (nowProject != null){
        let filesArray = nowProject.project_files;
            if (filesArray.length == 0) {
            filesArray = [fileRecived];
            }
            else {
                filesArray.push(fileRecived);
            }

            let fileProject = await projectModel.findOneAndUpdate({ project_name: fileRecived.project_name },
            { project_files: filesArray }, { new: true }).then(() => {
                res.send("File Added to Project");
            }).catch((err) => {
                res.status(400).send(`Error: ${err}`)
                console.log("Error =>", err);
            });
            console.log(fileProject);

    }
    else{
        res.send("Project Doesn't Exist");
    }
});
    

// ---------------------------------------------------------------------------------------------------------
// ------------------------------------* Add Contributors to Project *--------------------------------------

app.post('/addcontributor', async (req, res) => {                                    // Route to add contributor
    let contributorEmail = req.body.project_contributor;
    let project_name_to_add = req.body.project_name;
    let checkContributor = await userModel.findOne({ email: contributorEmail }, (error, user) => { console.log("Error: ", error) })
    if (checkContributor != null) {
        let getProjectToAdd = await projectModel.findOne({ project_name: project_name_to_add }, (err, user) => { console.log({ error: err }); });
        let contributors = getProjectToAdd.project_contributors
        contributors.push(contributorEmail);
        getProjectToAdd = await projectModel.findOneAndUpdate({ project_name: project_name_to_add },
            { project_contributors: contributors }).then(() => {
                res.send("Contributer Added");
            }).catch((error) => { res.status(400).send(`Error Occured :=> ${error}`) });
    }
    else {
        res.status(404).send(`No User with email id  "${contributorEmail}"found`)
    }
});

// ---------------------------------------------------------------------------------------------------------
// -------------------------------------* Create Contact Form Schema *--------------------------------------


app.post('/contactform', (req, res) => {                                            // Route to submit Contact Form
    const ddata = req.body
    let formData = new contactFormModel(ddata);
    formData.save().then(() => {
        res.send("Data Saved Successfully !!!");
    }).catch((error) => {
        res.send(`Error Occured !!! => ${error}`);
        console.log(error)
    });
});

// ---------------------------------------------------------------------------------------------------------