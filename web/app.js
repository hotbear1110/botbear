const express = require('express');
const favicon = require('express-favicon');
var http = require('http');


const app = express();

app.use(favicon(__dirname + '/public/img/LETSPEPE.png'));
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));


app.set('views', './src/views');
app.set('view engine', 'ejs');


const commandRouter = require('./src/routes/commands');
const suggestionRouter = require('./src/routes/suggestions');

app.use('/', commandRouter);
app.use('/suggestions', suggestionRouter);

var httpServer = http.createServer(app);

httpServer.listen(4000);
require('../tools/webhook.js');
