import Product from '../models/Product.js';

// @route GET /api/products
// Supports: page, limit, category, minPrice, maxPrice, rating, flavor, sort
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 9, category, minPrice, maxPrice, rating, flavor, sort, organic } = req.query;

    const query = {};
    if (category) query.category = { $regex: category, $options: 'i' };
    if (flavor)   query.flavor   = { $regex: flavor, $options: 'i' };
    if (rating)   query.rating   = { $gte: Number(rating) };
    if (organic === 'true') query.organic = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortObj = {};
    if (sort === 'price_asc')    sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'rating_desc') sortObj = { rating: -1 };
    else sortObj = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortObj).skip(skip).limit(Number(limit));

    res.json({
      success: true,
      products,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalItems: total
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/products  (admin+)
export const createProduct = async (req, res) => {
  try {
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(f => `http://localhost:5000/uploads/${f.filename}`);
    } else if (req.body.images && !Array.isArray(req.body.images)) {
      req.body.images = [req.body.images];
    }
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route PUT /api/products/:id  (admin+)
export const updateProduct = async (req, res) => {
  try {
    const oldProduct = await Product.findById(req.params.id);
    if (!oldProduct) return res.status(404).json({ success: false, message: 'Product not found' });

    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(f => `http://localhost:5000/uploads/${f.filename}`);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    // Check if price or stock changed
    const changes = {};
    if (oldProduct.price !== product.price) changes.price = `${oldProduct.price} -> ${product.price}`;
    if (oldProduct.stock !== product.stock) changes.stock = `${oldProduct.stock} -> ${product.stock}`;

    if (Object.keys(changes).length > 0) {
      // Fire and forget notification to NestJS microservice
      fetch('http://localhost:4000/api/reviews/notify-product-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          productName: product.name,
          changes
        })
      }).catch(err => console.error('Failed to trigger NestJS notification:', err.message));
    }

    res.json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route DELETE /api/products/:id  (superadmin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
