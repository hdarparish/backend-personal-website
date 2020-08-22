import express, { request, response } from 'express'
import { v4 as uuidv4 } from 'uuid';
import * as db from './db.js'
import * as jwtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
import argon2 from 'argon2'
import * as verifyJwt from './verifyJwt.js'
import * as verifyInput from './verifyInput.js'
dotenv.config();

const router = express.Router()

router.post('/auth', async (request, response, next) => {
    let email = request.body.email;
    let password = request.body.password;
    //check if the propetry is empty
    if (email == null || password == null) {
        return response.status(401).send({ message: "missing credentials" });
    }
    try {

        await db.userLogin(request.body, (result) => {
            if (result == null) {

                return response.status(401).send({ message: "incorrect credentials provided" })
            }

            return response.status(200).send({ result });
        });
    }
    catch (err) {
        console.error(err);
        next(err)
    }
})

router.get('/contact_form/entries', verifyJwt.verifyToken, async (request, response, next) => {
    //get the list of entries
    try {
        //let entries = await db.getData();
        await db.getEntries(data => {
            return response.status(200).send(data);
        })

    }
    catch (err) {
        console.error(err);
        next(err);
    }
})


router.get('/contact_form/entries/:id', verifyJwt.verifyToken, async (request, response, next) => {

    try {
        let id = request.params.id;
        //get the data from JSON file and check if id exists and send the approperiate response
        let entriesId = await db.getData();
        let index = entriesId.findIndex(item => item.id == id)
        if (index == -1) {
            return response.status(404).send({ message: `entry ${id} not found` })
        }

        return response.status(200).send(entriesId[index]);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
})

router.post('/contact_form/entries', verifyInput.inputValidation(["name", "email", "phoneNumber", "content"])
    , (request, response, next) => {
        try {
            //assign UUID4 and add the data to the JSON file. 
            let reqBody = request.body;
            reqBody.id = uuidv4();
            // The conditional statement in the db.js will assign the JSON file name by default if no values are passed
            db.addEntries(reqBody);
            //db.addData(reqBody);
            return response.status(201).send(reqBody);
        }
        catch (err) {
            console.error(err);
            next(err);
        }
    })

router.post('/users', verifyInput.inputValidation(["name", "email", "password"]), async (request, response, next) => {
    try {
        //assign UUID4 and add the data to the JSON file
        console.log("success")
        let reqBody = request.body;
        reqBody.id = uuidv4();
        //hash the password and add it to the JSON file
        reqBody.password = await argon2.hash(reqBody.password);
        await db.addUser(reqBody);
        //await db.addData(reqBody, 'users');
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
