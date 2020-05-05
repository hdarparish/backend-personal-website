import express, { request, response } from 'express'

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

export {
    Validation
}