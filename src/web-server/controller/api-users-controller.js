const {getUser, addUser, updateUserTokenVersion, getUsertokenVersion, isFileAccessedByUser} = require("../services/usersServices");

async function postReqController(req, res) {
    console.log("in post user")
    let { username, password, nickname, photo } = req.body;
    if (!username || !password || !nickname || !photo) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'missing fields for signup' }));
    }
    const validPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!validPasswordRegex.test(password)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Password should contain at least 8 characters, one letter and one number' }));
    }
    if (!(await getUser(username) === undefined)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user with this username already exists' }));
    }

    await addUser(username, password, nickname, photo);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'user created successfully' }));
}

async function getReqController(req, res) { // for api/users/:id !!!

    const inputId = req.params.id;

    const requestedUser = await getUser(inputId);

    if (requestedUser === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user with this username does not exists' }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    const retjson = { ...requestedUser };
    delete retjson.password; // dont send password...
    return res.end(JSON.stringify(retjson));
}
async function disconnectController(req, res) { //for api/users/logout
    let username = req.user.username;

    await updateUserTokenVersion(username);
    return res.status(200).send("Disconnected");
}
module.exports = { postReqController, getReqController, disconnectController };
