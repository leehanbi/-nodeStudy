var http = require('http');
var url = require('url');
var topic = require('./lib/topic.js');
var author = require('./lib/author.js');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        topic.main(response);
      } else {
        topic.main_sub(queryData,response);
      }
    }else if(pathname === '/create'){
      topic.create(response);
    } else if(pathname === '/create_process'){
      topic.create_process(request, response);
    } else if(pathname === '/update'){
      topic.update(response, queryData);   
    } else if(pathname === '/update_process'){
      topic.update_process(request ,response);
    } else if(pathname === '/delete_process'){
      topic.delete_process(request ,response);
    } else if(pathname === '/author'){
      author.author(response);
    } else if(pathname === '/author_create'){
      author.author_create(response);
    } else if(pathname === '/author_create_process'){
      author.author_create_process(request ,response);
    } else if(pathname === '/author_update'){
      author.author_update(queryData, response);
    } else if(pathname === '/author_update_process'){
      author.author_update_process(request ,response);
    } else if(pathname === '/author_delete'){
      author.author_delete(queryData, response);
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);