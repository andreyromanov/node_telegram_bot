module.exports = function isAuthorized(req, res, next) {
    if (req.get("Authorization") === "12345") {
        // user is authenticated
        next();
    } else {
        // return unauthorized
        res.status(401).send('Unauthorized');
    }
};