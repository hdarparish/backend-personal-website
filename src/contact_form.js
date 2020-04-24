import express from 'express'
const router = express.Router()


router.get('/entries', (req, res) => {
    res.send(items)
})

export default router
