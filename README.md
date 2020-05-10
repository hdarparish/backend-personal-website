# Backend personal website
**About**

The backend application wll take the data from the "Contact US" form and check if the values, format are correct before storing into a JSON file. 

The entries file will contain all the contact form submissions. The users file will contain all the login info

**Instruction:**

Open the terminal and enter `npm install` to install all the dependencies

Create a .env file and add the following:

PORT=*PORTNUMBER*

DB_ENTRIES_LOCATION=*./data/filename.json*

DB_USERS_LOCATION=*./data/filename.json*

JWT_SECRET=*RANDOM_GENERATED_CHARACTERS*

To start the project, open the terminal and enter either `npm start` or `npm run dev` for development mode


Note: the placeholder file in data folder can be deleted, it exists so that the data folder can be uploaded to GIT

