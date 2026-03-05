const db = require('../config/db');

/**
 * Create a new order for the authenticated user.
 * Expects an array of items and a paymentMethod string.
 * Simulates payment processing and uses database transactions to ensure consistency.
 *
 * @param {Object} req - Express request object containing user ID and order payload.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function for error handling.
 */
exports.createOrder = async (req, res, next) => {
    const { items, paymentMethod } = req.body; // items: [{ productId, quantity, price }]

    if (!items || items.length === 0) {
        return res.status(400).json({ msg: 'No items in order' });
    }

    try {
        await db.query('BEGIN');

        const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Mock payment process
        // In a real app, you would integrate Stripe/PayPal here
        let paymentStatus = 'completed';
        if (paymentMethod === 'fail_me') {
            paymentStatus = 'failed';
            await db.query('ROLLBACK');
            return res.status(400).json({ msg: 'Payment failed' });
        }

        const orderResult = await db.query(
            'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, totalAmount, paymentStatus]
        );

        const orderId = orderResult.rows[0].id;

        for (let item of items) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [orderId, item.productId, item.quantity, item.price]
            );

            // Reduce stock
            await db.query(
                'UPDATE products SET stock = stock - $1 WHERE id = $2',
                [item.quantity, item.productId]
            );
        }

        await db.query('COMMIT');

    } catch (err) {
        await db.query('ROLLBACK');
        next(err); // Pass the error to the centralized middleware
    }
};

/**
 * Get all past orders specifically for the logged-in user.
 * Aggregates all JSON order items into a single `items` array per order row.
 *
 * @param {Object} req - Express request object (requires valid req.user).
 * @param {Object} res - Express response object.
 * @param {Function} next - Pass errors to middleware.
 */
exports.getUserOrders = async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT o.*, 
                   json_agg(json_build_object(
                       'product_id', oi.product_id, 
                       'name', p.name,
                       'image_url', p.image_url,
                       'quantity', oi.quantity, 
                       'price', oi.price
                   )) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `, [req.user.id]);

        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

/**
 * (Admin Only) Fetch all orders across the entire platform.
 * Joins with the `users` table to display who placed the order.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Pass errors to middleware.
 */
exports.getAllOrders = async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT o.*, 
                   json_agg(json_build_object(
                       'product_id', oi.product_id, 
                       'name', p.name,
                       'image_url', p.image_url,
                       'quantity', oi.quantity, 
                       'price', oi.price
                   )) as items,
                   u.name as customer_name,
                   u.email as customer_email
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            JOIN users u ON o.user_id = u.id
            GROUP BY o.id, u.name, u.email
            ORDER BY o.created_at DESC
        `);

        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

/**
 * (Admin Only) Update the status of an existing order (e.g., pending -> shipped).
 * 
 * @param {Object} req - Express request object with URL param `id` and body `status`.
 * @param {Object} res - Express response object.
 * @param {Function} next - Pass errors to middleware.
 */
exports.updateOrderStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'completed', 'failed', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid order status' });
    }

    try {
        const result = await db.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        res.json({ msg: 'Order status updated successfully', order: result.rows[0] });
    } catch (err) {
        next(err);
    }
};
