const productSchema = require('../models/productSchema')
//add products
const addProduct = async (req, res) => {
    try {
      const product = new productSchema(req.body);
      console.log(req.body);
      console.log(product);
      
      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } 
    catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message, success: false });
    }
  };
  
//view all products
const allProducts = async (req, res) => {
    try {
      const products = await productSchema.find();
      if (!products) {
        return res.status(500).json({ success: false });
      }
      res.status(200).json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message, success: false });
    }
  };
 
  // view specific product
  const viewProduct = async (req, res) => {
    try {
      const productID = req.body.id;
      console.log(productID)
      const product = await productSchema.findById({ _id: productID }).populate('category')
  
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
// Get product count
  const productCount = async (req,res)=>{
    const productCount = await productSchema.countDocuments()
    if(!productCount){
      res.status(500).json({success: false})
    }
    res.send({
      success: true,
      productCount: productCount
    })
  }
  module.exports = {
    allProducts,
    addProduct,
    viewProduct,
    productCount
}
  