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
    // 글만들기 
    }else if(pathname === '/create'){
      topic.create(response);
    // 글만들기 작성 
    } else if(pathname === '/create_process'){
      topic.create_process(request, response);
    // 글수정
    } else if(pathname === '/update'){
      topic.update(response, queryData); 
    // 글수정 업뎃  
    } else if(pathname === '/update_process'){
      topic.update_process(request ,response);
    // 글삭제
    } else if(pathname === '/delete_process'){
      topic.delete_process(request ,response);
    // author 불러오기
    } else if(pathname === '/author'){
      author.author(response);
    // author 목록 작성
    } else if(pathname === '/author_create'){
      author.author_create(response);
    // author 목록 인설트
    } else if(pathname === '/author_create_process'){
      author.author_create_process(request ,response);
    // author 수정  
    } else if(pathname === '/author_update'){
      author.author_update(queryData, response);
    // author 수정 업뎃
    } else if(pathname === '/author_update_process'){
      author.author_update_process(request ,response);
    // author 목록 삭제
    } else if(pathname === '/author_delete'){
      author.author_delete(queryData, response);
    // 예외처리 
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);