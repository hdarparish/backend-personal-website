
import express, { request, response } from 'express'

import * as jwtoken from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
   
    //To remove the Bearer from the JWT
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(403).send({ message: "token not provided" })
    }
    try {
        const data = jwtoken.verify(token, process.env.JWT_SECRET)
        req.user = data
        next()
    } catch (err) {
        console.error(err)
        return res.status(403).send({ message: err.message })
    }
}

export{
    verifyToken
}