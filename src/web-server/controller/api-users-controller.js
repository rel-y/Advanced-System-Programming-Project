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

    const inputId = req.params.id;

    const requestedUser = singletonUsersModel.getUser(inputId);

    if (requestedUser === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user with this username does not exists' }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    const retjson = {...requestedUser };
    delete retjson.password; // dont send password...
    return res.end(JSON.stringify(retjson));
}
function disconnectController(req, res){ //for api/users/logout
    let username = req.user.username;

    singletonUsersModel.updateUserTokenVersion(username);
    return res.status(200).send("Disconnected");
}
module.exports = { postReqController, getReqController, disconnectController};
