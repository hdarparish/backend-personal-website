import express from 'express'
//import * as dotenv from 'dotenv'
//dotenv.config();

const app = express()
const port = process.env.port || 4000;
// allows us to parse json 
app.use(express.json())

app.get('/', (req, res) => res.send('Hello world'))

app.listen(port, () => console.log(`API server ready on http://localhost:${port}`))
