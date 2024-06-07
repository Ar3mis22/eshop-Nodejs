const express = require('express')
const router = express.Router()

//controllers
const userC = require("../controllers/userC")

router.post('/signUp', userC.signUp)
router.get('/allUsers', userC.allUsers)
router.post('/Login', userC.Login)
router.post('/Logout', userC.Logout)
module.exports = router