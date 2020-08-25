# Backend personal website
**About**

The backend application wll take the data from the "Contact US" form and check if the values, format are correct before storing into mysql database. 

The entries file will contain all the contact form submissions. The users file will contain all the login info

**Instruction:**

Open the terminal and enter `npm install` to install all the dependencies

Create a .env file and add the following:
    
```
PORT= Add Port Number
JWT_SECRET= RANDOM_GENERATED_CHARACTERS
DATABASE_HOST= Add Hostname
DATABASE_USER= Add Username
DATABASE_PASSWORD= Add Password
DATABASE_NAME="portfolio"
```

To start the project, open the terminal and enter either `npm start` or `npm run dev` for development mode


Run the following code in mysql server (Dbeaver)
```
Create database portfolio;
Use portfolio;

CREATE TABLE IF NOT EXISTS contact_entries (
  id varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  email varchar(255) not null,
  phone_number varchar(20) NOT NULL,
  comment varchar(255) not null,
  PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS users (
  id varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  password varchar(255) not null,
  email varchar(255) not null,
  PRIMARY KEY (id)
  )
```
