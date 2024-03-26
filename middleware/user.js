const jwt = require("jsonwebtoken");
const jwtSecret= "123456";

function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected

    const token=req.headers.authorization;
    const splitToken=token.split(" ");
    const jwtToken=splitToken[1];
    
    try{
        const verifiedJwt=jwt.verify(jwtToken,jwtSecret);
        req.username=verifiedJwt.username;
        next();
    }catch(e){
        res.status("401").json({
            message: "Unauthorized"
        });
    }
}

module.exports = userMiddleware;