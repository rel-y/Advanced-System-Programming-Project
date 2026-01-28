const express = require('express');
const cors = require('cors');

const { connectDB } = require("./dbsetup");
const {isLoggedIn} = require("./authentication/JWT")
const { ensureRootExists } = require("./services/metadataServices");

require("./model/metadataModelMongo");
require("./model/usersModelMongo");

var app = express();
app.use(cors());

//setting the urlencoder so the app can prase json 
app.use(express.json({limit: '10mb'})); //allowing the incoming data to be up to 10mb to support large data as images


app.use('/api/users' ,require('./routes/usersRouter'));
app.use('/api/tokens', require('./routes/tokensRouter'));
app.use('/api/files', isLoggedIn, require('./routes/filesRouter'));
app.use('/api/search', isLoggedIn, require('./routes/searchRouter'));
app.use('/api/folders', isLoggedIn, require('./routes/folderRouter'));

const port = process.env.WEB_SERVER_PORT; //the port the server listen to is passed as an enviroment variable

async function start() {
  try {
    await connectDB();
    await ensureRootExists(); // runs after DB is connected and models are registered

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();