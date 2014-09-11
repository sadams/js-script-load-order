var mustache = require('mustache');
var express = require('express');

var app = express();

app.get('/js/include.js', function(req, res){
    var jsInc = req.param('number');
    var nexts = req.param('nexts');
    var js = '';
    if (jsInc) {
        js = mustache.to_html('scriptLoaded({{number}});', {number : jsInc});
        if (nexts) {
            js += mustache.to_html('{{#.}}loadScript({{.}});{{/.}}', nexts.split(','));
        }
    }
    res.header('Content-Type', 'application/javascript');
    res.send(js);
});

app.get('/js/wait.js', function(req, res){
    var milliseconds = +req.param('for');
    setTimeout(function(){
        var content = req.param('then') || '';
        res.header('Content-Type', 'application/javascript');
        res.send(content);
    },milliseconds);
});

app.use(express.static(__dirname + '/public'));

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});