import { promises as fs, write } from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config();

const entriesPath = path.resolve(process.env.DB_ENTRIES_LOCATION);
const usersPath = path.resolve(process.env.DB_USERS_LOCATION);
let filePath;

const getData = async (reqFile) => {
    let content;
    try {
        //check if the reqFile contains 'users' and assign the JSON path. if no variables are passed then it will be assigned entries.json 
        filePath = reqFile == 'users' ? usersPath : entriesPath;
        content = JSON.parse(await fs.readFile(filePath))
    }
    catch (err) {
        //check if the error code is caused by the missing file(s), then call the function to write/create the JSON file
        if(err.code === "ENOENT"){
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
    addData
}

