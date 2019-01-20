var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring')

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
    <a href="/create">create</a>
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

function makeInfo(tatle,filelist,description){
  var list = makeFlieList(filelist,description);
  var templat = templatHTML(tatle,list,`<h2>${tatle}</h2>${description}`);
  console.log(templat);
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
            var templat = makeInfo('welcome',filelist,'hello node.js');
            response.writeHead(200);
            response.end(templat);
          })
      }else{
        fs.readdir('./data',function( error,filelist){
          fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
            var tatle = queryData.id;
            var templat = makeInfo(tatle,filelist,description);
            response.writeHead(200);
            response.end(templat);
          });
      });
    }
  } else if (pathname === '/create') {
    fs.readdir('./data',function( error,filelist){
      var templat = makeInfo('Web - create',filelist,`
      <form action="http://localhost:3000/create_process" method="post">
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
  }else{
      // 404에러 날리기
      response.writeHead(404);
      response.end('not found');
    }
});
app.listen(3000);
