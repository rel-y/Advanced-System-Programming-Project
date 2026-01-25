const {getUser, addUser, updateUserTokenVersion, getUsertokenVersion, isFileAccessedByUser} = require("../services/usersServices");
const jwt = require("jsonwebtoken")
const {key} = require("../.secret");
async function isLoggedIn(req, res, next) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const data = jwt.verify(token, key);
            const version = await getUsertokenVersion(data.username);
            if(version === null || version === undefined){
                return res.status(401).send("Invalid Token");
            }
            if(data.tokenVersion !== version){
                return res.status(401).send("Invalid Token");
            }else{
                //adding username to req
                req.user = {
                    username: data.username
                };
                return next()
            }
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    }
    else
        return res.status(403).send('Token required');
}
async function CheckToken(req, res) {//returns true if the token is valid else returns false
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const data = jwt.verify(token, key);
            const version = await getUsertokenVersion(data.username);
            if(version === null || version === undefined){
                return res.status(200).send("false");
            }
            if(data.tokenVersion !== version){
                return res.status(200).send("false");
            }else{
                return res.status(200).send("true");
            }
        } catch (err) {
            return res.status(200).send("false");
        }
    }
    else
        return res.status(200).send('false');
}

module.exports = {
    isLoggedIn,
    CheckToken
}