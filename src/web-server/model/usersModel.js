class userNode {
    constructor(username, password, nickname, photo) {
        this.username = username; // unique!
        this.password = password;
        this.nickname = nickname;
        this.photo = photo;
        this.tokenVersion = 1;
        this.filemap = new Map(); // fileid -> fileNode, last access for the user

    }
}

class usersDict {
    constructor() {
        this.map = new Map(); // username -> userNode
    }

    getUser(username) {
        return this.map.get(username);
    }

    addUser(username, password, nickname, photo) {
        if (this.map.has(username)) {
            return undefined;
        }
        const newUser = new userNode(username, password, nickname, photo);
        this.map.set(username, newUser);
    }
    updateUserTokenVersion(username){
        if (!(this.map.has(username))) {
            return undefined;
        }
        const user = this.map.get(username);
        user.tokenVersion += 1;
    }
    getUsertokenVersion(username){
        if (!(this.map.has(username))) {
            return undefined;
        }
        const user = this.map.get(username);
        return user.tokenVersion;
    }
}

const singletonUsersModel = new usersDict();
module.exports = {singletonUsersModel};