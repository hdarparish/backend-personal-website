# Backend personal website
**About**

The backend application wll take the data from the "Contact US" form and check if the values, format are correct before storing into mysql database. 

The entries file will contain all the contact form submissions. The users file will contain all the login info

**Instruction:**

Open the terminal and enter `npm install` to install all the dependencies

Create a .env file and add the following:
    
```
PORT=*PORTNUMBER*

JWT_SECRET=*RANDOM_GENERATED_CHARACTERS*
```

To start the project, open the terminal and enter either `npm start` or `npm run dev`for development mode

To start the project, open the terminal and enter either `npm start` or `npm run dev` for development mode


Note: the placeholder file in data folder can be deleted, it exists so that the data folder can be uploaded to GIT

Run the following code in mysql server (Dbeaver)
```
Create database portfolio;
use portfolio;

CREATE TABLE IF NOT EXISTS contact_entries (
  id varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  email varchar(255) not null,
  phone_number varchar(20) NOT NULL,
	comment varchar(255) not null,
  PRIMARY KEY (id)
)

insert into contact_entries values ("06974ecc-fa2d-49ef-8ea5-4c4c7e5bf0e6", 'Jack Daniel','jd@email.com', '4160001231','need help at 212 Streat Boulivard');

select * from contact_entries;

CREATE TABLE IF NOT EXISTS users (
  id varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  password varchar(255) not null,
  email varchar(255) not null,
  PRIMARY KEY (id)
  )
```
