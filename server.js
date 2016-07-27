var express = require('express');
var request = require('request');
var path = require('path');

var app = express();

app.use(express.static('public'));

var JIRA_URL = "http://jira.lan.courtanet.net";

app.get('/rest/api/2/search', function (req, res) {
    request(JIRA_URL + req.url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.setHeader('Content-Type', 'application/json');
            res.send(body);
        }
    })
});

app.all('*', function (req, res) {
    //res.sendFile("./public/index.html");
    res.sendFile(path.join(__dirname, './public', 'index.html'));
});

app.listen(8080);

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
    contentBase: "./public",
    hot: true,
    historyApiFallback: true,
    colors: true,
    stats: 'normal',
    proxy: {
      "*": "http://localhost:8080"
    }
}).listen(8081, 'localhost', function (err, result) {
    if (err) {
        return console.log(err);
    }

    console.log('Listening at http://localhost:8081/');
});

// we start a webpack-dev-server with our config
// var webpack = require('webpack');
// var WebpackDevServer = require('webpack-dev-server');
// var config = require('./webpack.config.js');
//
// new WebpackDevServer(webpack(config), {
//     hot: true,
//     historyApiFallback: true,
//     proxy: {
//         "*": "http://localhost:8080"
//     }
// }).listen(8081, 'localhost', function (err, result) {
//     if (err) {
//         console.log(err);
//     }
//
//     console.log('Listening at localhost:8081');
// });