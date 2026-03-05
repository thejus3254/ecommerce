module.exports = function (req, res, next) {
    if (!req.user) {
        return res.status(401).json({ msg: 'Unauthorized request' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied: Requires administrator privileges' });
    }

    next();
};
