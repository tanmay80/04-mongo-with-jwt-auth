const jwt = require("jsonwebtoken");
const jwtSecret= "123456";

// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const token=req.headers.authorization;
    const splitToken=token.split(" ");
    const jwtToken=splitToken[1];

    try{
        const verifiedJwt=jwt.verify(jwtToken,jwtSecret);
        next();
    }catch(e){
        res.status(401).json({
            message: " Unauthorized "
        });
    }
}

module.exports = adminMiddleware;