/**
 * errorHandler.js
 * 
 * Centralized error handling middleware.
 * By using this, we avoid repeating `try/catch` with `res.status(500)` in every single controller.
 * Any controller can simply call `next(err)` to pass the error here.
 */
module.exports = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);

    // If the error has a specific status code, use it. Otherwise, default to 500 (Server Error).
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        msg: statusCode === 500 ? 'Internal Server Error' : err.message,
        // In development, it's helpful to see the stack trace. In production, hide it.
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};
