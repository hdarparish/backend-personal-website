import express from 'express'
import * as dotenv from 'dotenv'
import routes from "./src/routes.js"
dotenv.config();

const app = express()
const port = process.env.port || 4000;
// allows us to parse json 
app.use(express.json())

//app.get('/', (req, res) => res.send('Hello world'))
app.use('/',routes);
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    console.error(err.stack)
    return res.status(404).send({message:"not found"})
})


app.listen(port, () => console.log(`API server ready on http://localhost:${port}`))
