const express = require('express');
var app = express();
//setting the urlencoder so the app can prase json 
app.use(express.json());

app.use('/api/users', require('./routes/usersRouter'));
app.use('/api/tokens', require('./routes/tokensRouter'));
app.use('/api/files', require('./routes/filesRouter'));
app.use('/api/search', require('./routes/searchRouter'));

const port = process.env.WEB_SERVER_PORT; //the port the server listen to is passed as an enviroment variable

app.listen(port);