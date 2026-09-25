import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Ensure up-to-date counts
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat.name });
        return {
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          image: cat.image,
          description: cat.description,
          productCount: count,
        };
      })
    );

    res.json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const count = await Product.countDocuments({ category: category.name });

    res.json({
      success: true,
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        image: category.image,
        description: category.description,
        productCount: count,
      },
    });
  } catch (error) {
    next(error);
  }
};
