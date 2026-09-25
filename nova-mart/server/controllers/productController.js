import Product from '../models/Product.js';
import Review from '../models/Review.js';

// Utility helper to slugify a title
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');
};

// @desc    Fetch all products with multi-facet filters, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    // 1. Search Query
    if (req.query.keyword && req.query.keyword.trim() !== '') {
      const keywordRegex = new RegExp(req.query.keyword.trim(), 'i');
      query.$or = [
        { name: keywordRegex },
        { brand: keywordRegex },
        { category: keywordRegex },
        { description: keywordRegex },
      ];
    }

    // 2. Category Filter (can be single or comma separated)
    if (req.query.category && req.query.category !== 'all') {
      const categories = req.query.category.split(',').map((c) => new RegExp(`^${c.trim()}$`, 'i'));
      query.category = { $in: categories };
    }

    // 3. Brand Filter
    if (req.query.brand && req.query.brand !== 'all') {
      const brands = req.query.brand.split(',').map((b) => new RegExp(`^${b.trim()}$`, 'i'));
      query.brand = { $in: brands };
    }

    // 4. Price Filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // 5. Rating Filter
    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }

    // 6. Discount Filter
    if (req.query.discount) {
      query.discount = { $gte: Number(req.query.discount) };
    }

    // 7. In-Stock Filter
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // 8. Featured / Trending filters
    if (req.query.featured === 'true') {
      query.featured = true;
    }
    if (req.query.trending === 'true') {
      query.trending = true;
    }

    // Sorting
    let sort = { createdAt: -1 };
    switch (req.query.sort) {
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { rating: -1, numReviews: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'discount':
        sort = { discount: -1 };
        break;
      case 'featured':
      default:
        sort = { featured: -1, rating: -1, createdAt: -1 };
        break;
    }

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sort).skip(skip).limit(limit);

    // Retrieve unique list of all available brands and categories for frontend filter options
    const allBrands = await Product.distinct('brand');
    const allCategories = await Product.distinct('category');

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(totalProducts / limit) || 1,
      totalProducts,
      availableBrands: allBrands,
      availableCategories: allCategories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fast search suggestions & quick preview
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res, next) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';
    if (!q) {
      return res.json({ success: true, suggestions: [], products: [] });
    }

    const regex = new RegExp(q, 'i');
    const products = await Product.find({
      $or: [{ name: regex }, { brand: regex }, { category: regex }],
    })
      .select('name slug brand category price originalPrice discount images rating')
      .limit(8);

    // Generate dynamic suggestions
    const suggestionsSet = new Set();
    products.forEach((p) => {
      if (p.name.toLowerCase().includes(q.toLowerCase())) suggestionsSet.add(p.name);
      if (p.brand.toLowerCase().includes(q.toLowerCase())) suggestionsSet.add(p.brand);
      if (p.category.toLowerCase().includes(q.toLowerCase())) suggestionsSet.add(p.category);
    });

    res.json({
      success: true,
      suggestions: Array.from(suggestionsSet).slice(0, 6),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const param = req.params.id;
    let product;

    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(param);
    }

    if (!product) {
      product = await Product.findOne({ slug: param });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found with the requested identifier.',
      });
    }

    // Fetch related reviews
    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      product,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      description,
      category,
      price,
      originalPrice,
      stock,
      images,
      colors,
      sizes,
      specifications,
      featured,
      trending,
    } = req.body;

    if (!name || !brand || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, brand, category, and price.',
      });
    }

    let slug = slugify(name);
    let existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const effectiveOriginalPrice = originalPrice && Number(originalPrice) >= Number(price) ? Number(originalPrice) : Number(price);
    const discount = Math.round(((effectiveOriginalPrice - Number(price)) / effectiveOriginalPrice) * 100);

    const product = new Product({
      name,
      slug,
      brand,
      description: description || 'High quality premium craftsmanship by NOVA MART.',
      category,
      price: Number(price),
      originalPrice: effectiveOriginalPrice,
      discount,
      stock: stock !== undefined ? Number(stock) : 10,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
      colors: Array.isArray(colors) ? colors : colors ? colors.split(',').map((c) => c.trim()) : [],
      sizes: Array.isArray(sizes) ? sizes : sizes ? sizes.split(',').map((s) => s.trim()) : [],
      specifications: specifications || [],
      featured: Boolean(featured),
      trending: Boolean(trending),
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: savedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const {
      name,
      brand,
      description,
      category,
      price,
      originalPrice,
      stock,
      images,
      colors,
      sizes,
      specifications,
      featured,
      trending,
    } = req.body;

    if (name) product.name = name;
    if (brand) product.brand = brand;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (stock !== undefined) product.stock = Number(stock);
    if (images) product.images = images;
    if (colors !== undefined) {
      product.colors = Array.isArray(colors) ? colors : colors.split(',').map((c) => c.trim());
    }
    if (sizes !== undefined) {
      product.sizes = Array.isArray(sizes) ? sizes : sizes.split(',').map((s) => s.trim());
    }
    if (specifications) product.specifications = specifications;
    if (featured !== undefined) product.featured = Boolean(featured);
    if (trending !== undefined) product.trending = Boolean(trending);

    // Recompute discount
    if (product.originalPrice && product.originalPrice > product.price) {
      product.discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    } else {
      product.discount = 0;
    }

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    await Product.deleteOne({ _id: product._id });
    await Review.deleteMany({ product: product._id });

    res.json({
      success: true,
      message: 'Product and associated reviews deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product review & update average rating
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this product.',
      });
    }

    const review = await Review.create({
      user: req.user._id,
      userName: req.user.name,
      product: productId,
      rating: Number(rating),
      title,
      comment,
    });

    // Update aggregate product rating & review count
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
    product.rating = Number((totalRating / reviews.length).toFixed(1));

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review posted successfully.',
      review,
      productRating: product.rating,
      numReviews: product.numReviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
