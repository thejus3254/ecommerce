const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/**
 * Registers a new user.
 * Hashes passwords using bcrypt before saving to PostgreSQL.
 * Automatically generates an initial JWT token upon successful sign-up.
 * 
 * @param {Object} req - Containing `name`, `email`, and plaintext `password`.
 * @param {Object} res - Express response object.
 * @param {Function} next - Pass unexpected errors to the global error handler.
 */
exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        let userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUserResult = await db.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
            [name, email, password_hash]
        );

        const payload = { user: { id: newUserResult.rows[0].id, role: newUserResult.rows[0].role } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secretcode',
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: newUserResult.rows[0] });
            }
        );
    } catch (err) {
        next(err);
    }
};

/**
 * Authenticates an existing user log in.
 * Validates the provided credentials against the hashed password in DB.
 * 
 * @param {Object} req - Containing `email` and `password`.
 * @param {Object} res - Express response object.
 * @param {Function} next - Error middleware.
 */
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        let userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id, role: user.role } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secretcode',
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (err) {
        next(err);
    }
};

/**
 * Utility route for the frontend to fetch the current user's profile on hard reloads.
 * This reads the user's ID off the token provided in the authorization header.
 */
exports.getUser = async (req, res, next) => {
    try {
        const userResult = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
        res.json(userResult.rows[0]);
    } catch (err) {
        next(err);
    }
};
