const jwt = require('jsonwebtoken');

const requireAuth = (req,res,next) => {

    const token = req.headers.authorization;
    if(token) {
        jwt.verify(token,"jako velika tajna 56", (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.send({error: "Not authorized."});
            } else {
                console.log(decodedToken)
                next();
            }
        });
    } else {
        res.send({error: "Not authorized."});
    }
}

module.exports = {requireAuth};