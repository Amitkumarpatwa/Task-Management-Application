// middleware to check if user is logged in
module.exports = function (req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized. Please login first.' });
};
