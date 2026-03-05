const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
    const { credential } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        // Find if user already exists
        let userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        let user;

        if (userResult.rows.length === 0) {
            // Register new user via Google
            const salt = await bcrypt.genSalt(10);
            // Create a random password since they logged in with Google
            const randomPassword = await bcrypt.hash(googleId + process.env.JWT_SECRET, salt);

            const newUserResult = await db.query(
                'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
                [name, email, randomPassword]
            );
            user = newUserResult.rows[0];
        } else {
            user = userResult.rows[0];
        }

        const jwtPayload = { user: { id: user.id, role: user.role } };

        jwt.sign(
            jwtPayload,
            process.env.JWT_SECRET || 'secretcode',
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (err) {
        console.error("Google Auth Error:", err.message);
        res.status(500).json({ msg: 'Google authentication failed' });
    }
};
