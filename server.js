var sys  = require('sys');
var path = require('path');
var url = require('url');
var fs = require('fs');

var connect = require('connect');
var mustache = require('mustache');

var currentPath = process.cwd();

(function () {
    var server;
    function writePage(response, body, contentType, code){
      response.writeHead(code || 200, {"Content-Type": contentType || "text/html"});
      response.write(body, "binary");
      response.end();
    };
    function start(port, webRoot) {
      server = connect()
        .use(function(req, res){
          switch (req.url) {
            case '/':
              var filePath = path.join(webRoot, '/index.html');
              fs.readFile(filePath, function(err, file){
                writePage(res, file);
              });
              break;
            default:
              var jsInc = url.parse(req.url, true).query['number'];
              var nexts = url.parse(req.url, true).query['nexts'];
              if (jsInc) {
                fs.readFile(path.join(webRoot, '/include.mustache'), function(err, file){
                  var html = mustache.to_html('scriptLoaded({{number}});', {number:jsInc});
                  if (nexts) {
                    html += mustache.to_html('{{#.}}loadScript({{.}});{{/.}}', nexts.split(','));
                  }
                  writePage(res, html, 'application/javascript');
                });
              }
              break;
          }
        })
        .listen(port);
      sys.log('Listening on: http://localhost:' + port);
      return server;
    }
    function stop() {
        if (server) {
            server.close();
        }
    }
    return {
        start:start,
        stop:stop
    }
})().start(59877, currentPath);
