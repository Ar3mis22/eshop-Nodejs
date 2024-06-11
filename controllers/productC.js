const productSchema = require('../models/productSchema')
const cloudinary =  require('cloudinary').v2
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/public/uploads')
  },
  filename: function (req, file, cb) {
    const filename = file.originalname.split(' ').join('-');
    cb(null, filename + '-' + Date.now())
  }
})

const uploadOptions = multer({ storage: storage })

cloudinary.config({ 
  cloud_name: 'drthman0v', 
  api_key: '636538512381738', 
  api_secret: '-TtMHspHe_kTI0EcMJ8-cMmXvuY' 
});

//add products
// const addProduct = async (req, res) => {
 

//     try {
//       console.log(req.body);
//       const file = req.files.photo;
//       cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
//         console.log(result);
//       })
//       // const product = new productSchema(req.body);
//       // console.log(req.body);
//       // console.log(product);
      
//       // const createdProduct = await product.save();
//       // res.status(201).json(createdProduct);
//     } 
//     catch (err) {
//       console.error(err);
//       res.status(500).json({ error: err.message, success: false });
//     }
//   };



const addProduct = async (req, res) => {
  try {
    console.log(req.body);

    // Configure Multer for file upload
    const upload = multer({
      dest: '/public/uploads', // Temporary storage directory for uploaded files
      limits: { fileSize: 1000000 }, // Set a file size limit (1MB in this example)
      fileFilter: (req, file, cb) => {
        const allowedExtensions = ['jpg', 'jpeg', 'png']; // Allowed image extensions
        const ext = file.originalname.split('.').pop();
        if (allowedExtensions.includes(ext)) {
          cb(null, true);
        } else {
          cb(new Error('Unsupported file type'), false);
        }
      },
    });

    // Use upload.single('photo') to handle a single file named 'photo'
    upload.single('photo')(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message, success: false });
      }

      // Access the uploaded file details from req.file
      const file = req.file;

      // If file exists, upload to Cloudinary using cloudinary.uploader.upload
      if (file) {
        cloudinary.uploader.upload(file.path, async (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message, success: false });
          }

          console.log(result);
          return res.status(201).json({message: "Image uploaded successfully", success: true }); // Cloudinary upload result

          // Replace product creation logic with `result.url` from Cloudinary
          // const product = new productSchema({
          //   ...req.body,
          //   image: result.url, // Use the uploaded image URL
          // });

          // const createdProduct = await product.save();
          // res.status(201).json(createdProduct);
        });
      } else {
        // Handle the case where no file was uploaded (e.g., send a message)
        console.log('No file uploaded');
        res.status(400).json({ error: 'No image file uploaded', success: false });
      }
    });
  } catch (err) {
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
  