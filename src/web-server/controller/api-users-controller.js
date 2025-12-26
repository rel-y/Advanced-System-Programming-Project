const {singletonUsersModel} = require("../model/usersModel")

function postReqController(req, res) {
    let { username, password, nickname, photo } = req.body;
    if (!username || !password || !nickname || !photo) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'missing fields for signup' }));
    }

    if (!(singletonUsersModel.getUser(username) === undefined)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user with this username already exists' }));
    }

    singletonUsersModel.addUser(username, password, nickname, photo);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'user created successfully' }));
}

function getReqController(req, res) { // for api/users/:id !!!
    const loggedInUsername = req.headers['username'];
    if (loggedInUsername === undefined) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user must be logged in. username in header' }));
    }
    const inputId = req.params.id;

    const requestedUser = singletonUsersModel.getUser(inputId);

    if (requestedUser === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user with this username does not exists' }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    const retjson = {...requestedUser };
    return res.end(JSON.stringify(retjson));
}

module.exports = { postReqController, getReqController};