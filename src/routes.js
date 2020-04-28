import express, { request, response } from 'express'
import { v4 as uuidv4 } from 'uuid';


const router = express.Router()


router.get('/', (req, res) => {
    res.send()
})
const Validation = (req, res, next) => {
    let invalid = [];
    let template = ["name", "email", "phoneNumber", "content"]
    let reqKeys = Object.keys(req.body);

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
    // return error;
    if (invalid.length > 0) {
        return res.status(400).send({ message: 'validation error', invalid })
    }
    next();
};
router.post('/entries', Validation, (request, response) => {
    let reqBody = request.body;
    reqBody.id = uuidv4();
    return response.status(201).send(reqBody);
})



export default router
