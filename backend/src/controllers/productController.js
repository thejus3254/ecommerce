const db = require('../config/db');

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
        const result = await db.query('SELECT * FROM products ORDER BY id ASC');
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
        const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }
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
        res.json({ msg: 'Product deleted' });
    } catch (err) {
        next(err);
    }
};
