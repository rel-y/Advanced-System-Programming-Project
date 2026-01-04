const {singletonUsersModel} = require("../model/usersModel")
const key = require("../.secret");
function isLoggedIn(req, res, next) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const data = jwt.verify(token, key);
            const version = singletonUsersModel.getUsertokenVersion(data.username);
            if(version === null || version === undefined){
                return res.status(401).send("Invalid Token");
            }
            if(data.tokenVersion !== version){
                return res.status(401).send("Invalid Token");
            }else{
                return next()
            }
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    }
    else
        return res.status(403).send('Token required');
}

module.exports ={
    isLoggedIn
}