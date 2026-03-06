const db = require('../config/db');

/**
 * Add a product to the user's favorites
 */
exports.addFavorite = async (req, res, next) => {
    try {
        const { id: product_id } = req.params;
        const user_id = req.user.id;

        // Ensure the product exists
        const productCheck = await db.query('SELECT id FROM products WHERE id = $1', [product_id]);
        if (productCheck.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Add to favorites (ON CONFLICT DO NOTHING handles duplicates gracefully since it's a composite primary key)
        const result = await db.query(
            'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) ON CONFLICT (user_id, product_id) DO NOTHING RETURNING *',
            [user_id, product_id]
        );

        res.status(201).json({ msg: 'Product added to favorites' });
    } catch (err) {
        next(err);
    }
};

/**
 * Remove a product from the user's favorites
 */
exports.removeFavorite = async (req, res, next) => {
    try {
        const { id: product_id } = req.params;
        const user_id = req.user.id;

        const result = await db.query(
            'DELETE FROM favorites WHERE user_id = $1 AND product_id = $2 RETURNING *',
            [user_id, product_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Favorite not found' });
        }

        res.json({ msg: 'Product removed from favorites' });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all favorited products for the logged-in user
 */
exports.getFavorites = async (req, res, next) => {
    try {
        const user_id = req.user.id;

        const result = await db.query(
            `SELECT p.* 
             FROM products p
             INNER JOIN favorites f ON p.id = f.product_id
             WHERE f.user_id = $1
             ORDER BY f.created_at DESC`,
            [user_id]
        );

        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};
