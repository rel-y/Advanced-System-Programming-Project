const express = require('express');
var app = express();
//setting the urlencoder so the app can prase json 
app.use(express.json({limit: '10mb'})); //allowing the incoming data to be up to 10mb to support large data as images

app.use('/api/users', require('./routes/usersRouter'));
app.use('/api/tokens', require('./routes/tokensRouter'));
app.use('/api/files', require('./routes/filesRouter'));
app.use('/api/search', require('./routes/searchRouter'));
app.use('/api/folders', require('./routes/folderRouter'));

const port = process.env.WEB_SERVER_PORT; //the port the server listen to is passed as an enviroment variable

app.listen(port);