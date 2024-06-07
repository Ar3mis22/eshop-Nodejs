const categorySchema = require('../models/categorySchema')


// Get Category
const getCategory = async (req, res) =>{
    try{
        const categories = await categorySchema.find();
        if(!categories){
            return res.status(500).json({ success: false });
        }
        res.status(200).json(categories);
    }
    catch(err)
    {
        console.error(err);
        return res.status(500).json({ success: false });
    }
} 
// Add Category
const addCategory = async (req, res) => {
    try {
      const newCategory = new categorySchema({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
      });
      
      const createdCategory = await newCategory.save();
      res.status(201).json(createdCategory);
    } 
    catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message, success: false });
    }
  };

// Update Category
const updateCategory = async (req, res) => {
  try {
    const categoryID = req.body.id;
    console.log("Hit")

    await categorySchema.findByIdAndUpdate(
      { _id: categoryID },
      { $set: req.body }
    );

    const Category = await categorySchema.findById({ _id: categoryID });

    res.json(200).status({
      success: true,
      message: "Category updated successfully",
      product: Category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// Delete Category
  const deleteCategory = async (req, res) => {
    try {
      const { categoryID } = req.body;
  
      // Find the category by ID
      const category = await categorySchema.findByIdAndDelete({ _id: categoryID });
  
      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
  
      res.status(200).json({ success: true, message: "Category deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Error deleting category" });
    }
  };
  

module.exports= {
    getCategory,
    addCategory,
    updateCategory,
    deleteCategory,
}