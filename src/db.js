import { promises as fs, write } from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import * as jwtoken from 'jsonwebtoken'

import argon2 from 'argon2'

import mysql from "mysql";
import { response } from 'express'

dotenv.config();

const entriesPath = path.resolve(process.env.DB_ENTRIES_LOCATION);
const usersPath = path.resolve(process.env.DB_USERS_LOCATION);
let filePath;


const db = mysql.createConnection({
    host: "localhost",
    user: "nodeclient",
    password: "123456",
    database: "portfolio",
});

// open the MySQL connection
db.connect((error) => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

const addEntries = async (reqBody) => {
    let id = reqBody.id;
    let name = reqBody.name;
    let email = reqBody.email;
    let phoneNumber = reqBody.phoneNumber;
    let comment = reqBody.content;
    try {
        let query = `INSERT INTO contact_entries values (?, ?, ?, ?, ?) `
        db.query(query, [id, name, email, phoneNumber, comment], (err, result) => {
            if (err) {
                throw err;
            }
            console.log("request added to database")
        });
    }
    catch (err) {
        console.error(err);
    }

}

const userLogin = async (reqBody, callback) => {
    let email = reqBody.email;
    let password = reqBody.password;

    try {
        let query = "Select * from users where email = ?";

        db.query(query, [email], async (err, result) => {
            if (err) {
                throw err;
            }

            if (typeof result !== 'undefined' && result) {
                //do stuff if query is defined and not null
                //return response.status(401).send({ message: "incorrect credentials provided" })
                if (result.length > 0) {
                    let passwordValid = await argon2.verify(result[0].password, password);
                    if (passwordValid) {

                        const token = jwtoken.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' })
                        return callback(token);

                    }
                }
            }
            return callback(null);
        });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}

const addUser = async (reqBody) => {
    let id = reqBody.id;
    let name = reqBody.name;
    let email = reqBody.email;
    let password = reqBody.password;

    try {
        let query = "INSERT INTO users VALUES (?, ?, ?, ?)";
        db.query(query, [id, name, password, email], (err, result) => {
            if (err) throw err;

            return result;
        });
    }
    catch (err) {
        console.error(err);
        // next(err);
    }
}

const getEntries = async (callback) => {
    let query = `SELECT * FROM contact_entries`
    try {
        db.query(query, (err, result) => {
            return callback(result);
        });
    }
    catch (err) {
        console.error(err);
        // next(err);
    }


}

const getData = async (reqFile) => {
    let content;
    try {
        //check if the reqFile contains 'users' and assign the JSON path. if no variables are passed then it will be assigned entries.json 
        filePath = reqFile == 'users' ? usersPath : entriesPath;
        content = JSON.parse(await fs.readFile(filePath))
    }
    catch (err) {
        //check if the error code is caused by the missing file(s), then call the function to write/create the JSON file
        if (err.code === "ENOENT") {
            console.log("File Doesn't exist")
            content = [];
            await writeData(content)
            console.log("File Created")
        }
        else {
            console.error(err);
            throw err
        }
    }
    return content;
}

const writeData = async (data) => {
    try {
        //write the data to file
        fs.writeFile(filePath, JSON.stringify(data))
    }
    catch (err) {
        console.error(err);
        throw err
    }
}

const addData = async (data, reqFile) => {
    try {
        //if reqFile variable data is for the users JSON file then assign the path
        filePath = reqFile == 'users' ? usersPath : entriesPath;
        //get the data first then add the new entries and write to file
        let fileData = await getData(reqFile)
        fileData.push(data);
        await writeData(fileData);
    }
    catch (err) {
        console.error(err);
        throw err
    }
}

export {
    getData,
    addData,
    addEntries,
    userLogin,
    addUser,
    getEntries
}

