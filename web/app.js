const express = require('express');
const favicon = require('express-favicon');
var http = require('http');
var fs = require('fs');
var https = require('https');
var privateKey = fs.readFileSync('/etc/letsencrypt/live/hotbear.xyz/privkey.pem');
var certificate = fs.readFileSync('/etc/letsencrypt/live/hotbear.xyz/fullchain.pem');

var credentials = { key: privateKey, cert: certificate };


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
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3000);
httpsServer.listen(4000);
