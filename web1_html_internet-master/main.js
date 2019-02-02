var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var templat = require('./lib/templat.js');
// 보안 관리 코드.
var path = require('path');


function makeInfo(tatle,filelist,description,data){
  var list = templat.list(filelist,description);
  var html= templat.html(tatle,list,`<h2>${tatle}</h2>${description}`,data);
  return html;
}
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname =  url.parse(_url,true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
          fs.readdir('./data',function( error,filelist){
            var temp = makeInfo('welcome',filelist,'hello node.js','<a href="/create">create</a>');
            response.writeHead(200);
            response.end(temp);
          })
      }else{
        fs.readdir('./data',function( error,filelist){
          // file내용 세탁
          var filteredId= path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`,'utf8',function(err,description){
            var tatle = queryData.id;
            var templat = makeInfo(tatle,filelist,description,`
              <a href="/create">create</a>
              <a href="/update?id=${tatle}">update</a>
              <form action="/delete_process" method="post">
                <p><input type="hidden" name ="id" value ="${tatle}"></p>
                <p><input type="submit" value="delete¥"></p>
              </form>
              `);
            response.writeHead(200);
            response.end(templat);
          });
      });
    }
  } else if (pathname === '/create') {
    fs.readdir('./data',function( error,filelist){
      var templat = makeInfo('Web - create',filelist,`
      <form action="/create_process" method="post">
        <p><input type="text" name ="tatle" placeholder="tatle"></p>
        <p><textarea name="description" rows="8" cols="80" name ="description"
        placeholder="description"> </textarea></p>
        <p><input type="submit"></p>
      </form>
       `);
       // 200은 성공했다는 의미
      response.writeHead(200);
      response.end(templat);
    })
  }else if(pathname === '/create_process') {
    var body = '';
    // requst data를 통해서 데이터가 들어와 body에 저장
    request.on('data',function(data){
        body += data;
    });

    // 그 후 end`로 넘어와 post에 담아서 뽑아 쓸수 있다
    request.on('end',function(){
      // post에 body데이터가 저장됨
      var post = qs.parse(body);
      var tatle = post.tatle;
      var description = post.description;
      fs.writeFile(`data/${tatle}`,description,'utf8',
      err => {
        // 302 요청은 페이지를 다른 곳으로 리다이렉션 시키는 것
        response.writeHead(302,{Location:`/?id=${tatle}`});
        response.end();
      })
    });
  }else if (pathname === '/update'){
    fs.readdir('./data',function( error,filelist){
      var filteredId= path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`,'utf8',function(err,description){
        console.log(description);
        var tatle = queryData.id;
        var templat = makeInfo('Web - update',filelist,`
        <form action="/update_process" method="post">
          <p><input type="hidden" name ="id" value ="${tatle}"></p>
          <p><input type="text" name ="tatle" placeholder="tatle" value ="${tatle}"></p>
          <p><textarea name="description" rows="8" cols="80" name ="description"
          placeholder="description"> ${description}</textarea></p>
          <p><input type="submit"></p>
        </form>
         `,`<a href="/create">create</a> <a href="/update?id=${tatle}">update</a>`);
        response.writeHead(200);
        response.end(templat);
      });
  });
  }else if (pathname === '/update_process'){
    var body = '';
    // requst data를 통해서 데이터가 들어와 body에 저장
    request.on('data',function(data){
        body += data;
    });

    // 그 후 end`로 넘어와 post에 담아서 뽑아 쓸수 있다
    request.on('end',function(){
      // post에 body데이터가 저장됨
      var post = qs.parse(body);
      var tatle = post.tatle;
      var id = post.id;
      var filteredId= path.parse(id).base;
      var description = post.description;
      fs.rename(`data/${filteredId}`, `data/${tatle}`, (err) => {
          fs.writeFile(`data/${tatle}`,description,'utf8' ,(err) => {
          response.writeHead(302,{Location:`/?id=${tatle}`});
          response.end();
        })
      });
    });
  }else if (pathname === '/delete_process'){
    var body = '';
    // requst data를 통해서 데이터가 들어와 body에 저장
    request.on('data',function(data){
        body += data;
    });
    // 그 후 end`로 넘어와 post에 담아서 뽑아 쓸수 있다
    request.on('end',function(){
      // post에 body데이터가 저장됨
      var post = qs.parse(body);
      var id = post.id;
      var filteredId= path.parse(id).base;
      fs.unlink(`data/${filteredId}`, (err) => {
        response.writeHead(302,{Location:`/`});
        response.end();
      })
    });

  }else{
      // 404에러 날리기
      response.writeHead(404);
      response.end('not found');
    }
});
app.listen(3000);
