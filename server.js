//var http = require('http');
//var url = require('url');
//var querystring = require('querystring');
//
//var server = http.createServer(function(req, res) {
//    var params = querystring.parse(url.parse(req.url).query);
//    res.writeHead(200, {"Content-Type": "text/plain"});
//    if ('prenom' in params && 'nom' in params) {
//        res.write('Vous vous appelez ' + params['prenom'] + ' ' + params['nom']);
//    }
//    else {
//        res.write('Vous devez bien avoir un prénom et un nom, non ?');
//    }
//    res.end();
//});
//server.listen(8080);

var express = require('express');
var request = require('request');

var app = express();

app.use(express.static('public'));

var JIRA_URL = "http://jira.lan.courtanet.net";

app.get('/rest/api/2/search', function(req, res) {
    request(JIRA_URL + req.url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.setHeader('Content-Type', 'application/json');
            res.send(body);
        }
    })
});

app.listen(8080);