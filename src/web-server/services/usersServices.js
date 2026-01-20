const User = require('../models/usersModelMongo');

const getUser = async (username) => { // rets null when didnt find
    return User.findOne({username});
};

const addUser = async (username, password, nickname, photo) => {
    try {
      const user = await User.create({ username, password, nickname, photo });
      return user;
    } catch (err) {
      // duplicate username, 11000 means a duplicate unique key
      if (err && err.code === 11000) return undefined;
      throw err;
    }
};

const updateUserTokenVersion = async (username) => {
    // add 1 to token, matchedCount tells if username exists. 
    const res = await User.updateOne({ username }, { $inc: { tokenVersion: 1 } });
    if (res.matchedCount === 0) return undefined;
    return true;
};

const getUsertokenVersion = async (username) => {
    const user = await User.findOne({username}).lean(); //lean is fine cause we dont return the object
    return user ? user.tokenVersion : undefined;
};

const isFileAccessedByUser = async (username, fileId) => {
    const res = await User.findOne({username, [`filemap.${fileId}`]: { $exists: true }}).lean();
    return (res !== null);
    //rets true if found such a user, false otherwise
};

module.exports = {getUser, addUser, updateUserTokenVersion, getUsertokenVersion, isFileAccessedByUser};