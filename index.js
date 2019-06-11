// Require express and create an instance of it
var express = require('express');
var fs = require('fs'),
    path = require('path');

var modelFilePath = path.join(__dirname, 'models');
var modelFiles = [];
var models = {};

fs.readdirSync(modelFilePath).forEach(file => {
    modelFiles.push(file);
    models[file] = fs.readFileSync(path.join(modelFilePath, file));
    console.log(modelFiles);
    console.log(models);
});

var app = express();

// on the request to root (localhost:3000/)
app.get('/', function (req, res) {
    res.send(modelFiles);
});

app.get('/disk/models', function (req, res) {
    res.send(modelFiles);
});

app.get('/memory/models', function (req, res) {
    res.send(modelFiles);
});

app.get('/disk/models/:modelId', function (req, res) {
    var filePath = path.join(__dirname, 'models', req.params.modelId);
    if (fs.existsSync(filePath)) {
        console.log(`model file ${filePath} found in disk`)
        res.sendFile(filePath)
    }
    else
    {
        res.send(`model file ${filePath} found in disk`);
        res.status(404);
    }
});

app.get('/memory/models/:modelId', function (req, res) {
    var model = models[req.params.modelId];
    if (model) {
        console.log(`model ${req.params.modelId} found in memory`)
        res.contentType('application/octet-stream');
        res.end(model);
    }
    else{
        res.send(`Model ${req.params.modelId} not found in memory`);
        res.status(404);
    }
});

// On localhost:3000/welcome
app.get('/welcome', function (req, res) {
    res.send('<b>Hello</b> welcome to my http server made with express');
});

// Change the 404 message modifing the middleware
app.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

// start the server in the port 3000 !
app.listen(80, function () {
    console.log('Example app listening on port 80.');
});
