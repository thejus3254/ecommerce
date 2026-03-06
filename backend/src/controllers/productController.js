const db = require('../config/db');
const NodeCache = require('node-cache');

// Initialize cache with a Time-To-Live of 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 });

/**
 * Fetch all products in the platform.
 * Sorts by ascending ID to ensure consistent display formats on the frontend.
 * 
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @param {Function} next - Error middleware.
 */
exports.getProducts = async (req, res, next) => {
    try {
        const cacheKey = 'all_products';
        const cachedProducts = cache.get(cacheKey);

        if (cachedProducts) {
            return res.json(cachedProducts);
        }

        const result = await db.query('SELECT * FROM products ORDER BY id ASC');

        // Save the fresh result to the cache
        cache.set(cacheKey, result.rows);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

/**
 * Fetch a single product's details using its ID.
 * Returns a 404 if the product does not exist.
 * 
 * @param {Object} req - Extract `id` from URL params.
 * @param {Object} res - Express response.
 * @param {Function} next - Error middleware.
 */
exports.getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const cacheKey = `product_${id}`;
        const cachedProduct = cache.get(cacheKey);

        if (cachedProduct) {
            return res.json(cachedProduct);
        }

        const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Save the specific product to cache
        cache.set(cacheKey, result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

/**
 * (Admin Only) Create a new product.
 * Expects the product payload to be provided in the request body.
 * 
 * @param {Object} req - Body contains name, description, price, image_url, category, stock.
 * @param {Object} res - Express response.
 * @param {Function} next - Error middleware.
 */
exports.createProduct = async (req, res, next) => {
    const { name, description, price, image_url, category, stock } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO products (name, description, price, image_url, category, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, description, price, image_url, category, stock || 0]
        );

        // Invalidate the 'all_products' cache so the new product shows up instantly for everyone
        cache.del('all_products');

        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

/**
 * (Admin Only) Update an existing product.
 * Returns a 404 if the requested product ID does not exist.
 * 
 * @param {Object} req - URL param `id` and body payload.
 * @param {Object} res - Express response.
 * @param {Function} next - Error middleware.
 */
exports.updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const { name, description, price, image_url, category, stock } = req.body;
    try {
        const result = await db.query(
            'UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, category = $5, stock = $6 WHERE id = $7 RETURNING *',
            [name, description, price, image_url, category, stock, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Invalidate both the master list and this specific product's cache
        cache.del(['all_products', `product_${id}`]);

        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

/**
 * (Admin Only) Delete a product entirely from the registry.
 * 
 * @param {Object} req - Extract `id` from URL params.
 * @param {Object} res - Express response.
 * @param {Function} next - Error middleware.
 */
exports.deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Invalidate both the master list and this specific product's cache
        cache.del(['all_products', `product_${id}`]);

        res.json({ msg: 'Product deleted' });
    } catch (err) {
        next(err);
    }
};
