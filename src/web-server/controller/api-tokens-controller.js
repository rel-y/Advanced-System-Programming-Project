const { singletonUsersModel } = require("../model/usersModel")
const jwt = require("jsonwebtoken")
const {key} = require("../.secret");

function postReqController(req, res) {
    let { username, password } = req.body;

    if (!username || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'missing fields' }));
    }

    const requestedUser = singletonUsersModel.getUser(username);
    if (requestedUser === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user with this username does not exists' }));
    }

    if (!(requestedUser.password === password)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'wrong password for this user' }));
    }
    //generaing a token
    const data = { username: username, tokenVersion: requestedUser.tokenVersion}
    const token = jwt.sign(data, key)
    res.status(201).json({ token })
}
module.exports = { postReqController };