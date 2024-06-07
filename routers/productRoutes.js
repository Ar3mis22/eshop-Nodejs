const express = require('express');
const router = express.Router();


//controllers 
const productC = require("../controllers/productC")


router.get('/allProducts', productC.allProducts)
router.post('/addProduct', productC.addProduct)
router.get('/viewProduct', productC.viewProduct)
router.get('/productCount', productC.productCount)
module.exports = router;
