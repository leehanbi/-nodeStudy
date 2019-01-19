var http = require('http');
var fs = require('fs');
var url = require('url');

function templatHTML(tatle,list,body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${tatle}</title>
    <meta charset="utf-8">
  </head>
  <body>
  <h1><a href="/">Web</a></h1>
    ${list}
    ${body}
    <p>
    </p>
  </body>
  </html>
  `;
}

function makeFlieList(filelist){
  var list = '<ul>';
  var i = 0
  while (i< filelist.length) {
    console.log(i);
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i= i + 1;
  }
  list = list + '</ul>';
  return list
};

function makeInfo(tatle,filelist){
  var list = makeFlieList(filelist);
  var description = 'hello node.js'
  var templat = templatHTML(tatle,list,`<h2>${tatle}</h2>${description}`);
  return templat;
}
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname =  url.parse(_url,true).pathname;
    console.log(pathname);
    if(pathname === '/'){
      if(queryData.id === undefined){
          fs.readdir('./data',function( error,filelist){
            var templat = makeInfo('welcome',filelist);
            response.writeHead(200);
            response.end(templat);
          })
      }else{
        fs.readdir('./data',function( error,filelist){
          fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
            var tatle = queryData.id;
            var templat = makeInfo(tatle,filelist);
            response.writeHead(200);
            response.end(templat);
          });
      });
    }
    }else{
      response.writeHead(404);
      response.end('not found');
    }
});
app.listen(3000);
