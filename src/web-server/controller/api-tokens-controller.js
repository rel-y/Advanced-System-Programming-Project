const singletonUsersModel = require("../model/usersModel")

function postReqController(req, res) {
    let { username, password } = req.body;

    if (!username || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'missing fields' }));
    }

    const requestedUser = singletonUsersModel.getUser(inputId);

    if (requestedUser === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user with this username does not exists' }));
    }

    if (!(requestedUser.password === password)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'wrong password for this user' }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: username }));
}
module.exports = {postReqController};