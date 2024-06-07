const express = require('express')
const router = express.Router()

const categoryC = require('../controllers/categoryC')

router.get('/getCategory', categoryC.getCategory)
router.post('/addCategory', categoryC.addCategory)
router.delete('/deleteCategory',categoryC.deleteCategory)
router.patch('/updateCategory',categoryC.updateCategory)
module.exports = router;