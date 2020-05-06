import { promises as fs, write } from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config();

const entriesPath = path.resolve(process.env.DB_ENTRIES_LOCATION);
const usersPath = path.resolve(process.env.DB_USERS_LOCATION);
let filePath;

const getData = async (reqFile) => {
    try {
        //check if the reqFile contains 'users' and assign the JSON path. if no variables are passed then it will be assigned entries.json 
        filePath = reqFile == 'users' ? usersPath : entriesPath;
        //get the data and return it
        let content = JSON.parse(await fs.readFile(filePath));
        return content;
    }
    catch (err) {
        console.error(err);
        throw err
    }
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
        let fileData = await getData(reqFile);
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
    addData
}

