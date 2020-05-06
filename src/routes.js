import express, { request, response } from 'express'
import { v4 as uuidv4 } from 'uuid';
import * as db from './db.js'
import * as jwtoken from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

const router = express.Router()

const Validation = (req, res, next) => {
    let invalid = [];
    let template = ["name", "email", "phoneNumber", "content"]
    //check if the post method has users in URL and change the template for comparison
    if (req.path == '/users') {
        template = ["name", "email", "password"]
    }
    //check if the password was entered and the length is correct.  NOTE: if the password is null it will be added when the loop checks for every property
    if (req.body.password != null && req.body.password.length < 8) {
        invalid.push("Password must be minimum 8 characters")
    }

    let reqKeys = Object.keys(req.body);
    //check for missing properties, error will occur even if the property is entered but misspelled
    template.forEach(element => {
        if (!(reqKeys.includes(element))) {
            invalid.push(element);
        }
    });

    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //check if email is not empty and if it has been added to the error and if the email format is correct
    if (req.body.email != null && !(req.body.email.match(mailformat)) && !(invalid.includes('email'))) {
        invalid.push('email');
    }

    if (invalid.length > 0) {
        return res.status(400).send({ message: 'validation error', invalid })
    }
    next();
};

router.post('/auth', async (request, response, next) => {
    let email = request.body.email;
    let password = request.body.password;
    //check if the propetry is empty
    if (email == null || password == null) {
        return response.status(401).send({ message: "missing credentials" });
    }
    try {
        //get the data from the JSON file and check if the email exists
        let userData = await db.getData("users");
        let index = userData.findIndex(item => item.email == email)
        if (index == -1) {
            return response.status(401).send({ message: "incorrect credentials provided" })
        }
        //sign and send the token
        const token = jwtoken.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1m' })
        return response.status(200).send({ token });
    }
    catch (err) {
        console.error(err);
        next(err)
    }
})

router.get('/contact_form/entries', async (request, response, next) => {
    //check token 
    //get the list of entries
    try {
        let entries = await db.getData();
        return response.status(200).send(entries);
    }
    catch(err){
        console.error(err);
        next(err);
    }
})


router.get('/contact_form/entries/:id', async (request, response,next) => {

    try {
        let id = request.params.id;
        //get the data from JSON file and check if id exists and send the approperiate response
        let entriesId = await db.getData();
        let index = entriesId.findIndex(item => item.id == id)
        if (index == -1) {
            return response.status(404).send({message: `entry ${id} not found`})
        }

        return response.status(200).send(entriesId[index]);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
})

//validate the endpoints below
router.use(Validation);
router.post('/contact_form/entries', (request, response, next) => {
    try {
        //assign UUID4 and add the data to the JSON file. 
        let reqBody = request.body;
        reqBody.id = uuidv4();
       // The conditional statement in the db.js will assign the JSON file name by default if no values are passed
        db.addData(reqBody);
        return response.status(201).send(reqBody);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
})

router.post('/users', (request, response, next) => {
    try {
        //assign UUID4 and add the data to the JSON file
        let reqBody = request.body;
        reqBody.id = uuidv4();
        //pass the string 'users' to change the file location to users.JSON
        db.addData(reqBody, 'users');
        //delete the password and send back the object
        delete reqBody.password;
        return response.status(201).send(reqBody);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
})





export default router
