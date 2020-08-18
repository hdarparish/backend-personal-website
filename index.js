import express from 'express'
import * as dotenv from 'dotenv'
import routes from "./src/routes.js"
import cors from 'cors'
dotenv.config();

const app = express()
const port = process.env.port || 4000;
// parse json 
app.use(express.json())
app.use(cors());
app.use('/', routes);

//global error handler
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    console.error(err.stack)
    return res.status(404).send({ message: "not found" })
})


export default app.listen(port, () => console.log(`API server ready on http://localhost:${port}`))
