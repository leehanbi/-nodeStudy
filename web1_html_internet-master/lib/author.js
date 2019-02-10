var template = require('../lib/template.js');
var qs = require('querystring');
var db = require('./db.js');
var sanitize = require('sanitize-html');

exports.author = function(response){
    db.query('SELECT * FROM topic', (err,topics)=> {
        if(err){
            throw err;
        }
        db.query(`SELECT * FROM author`,(err2,authors)=>{
            if(err2){
                throw err2;
            }
            var title = 'author_data';
            var list = template.list(topics);
            var html = template.HTML(title, list,
                 `
                ${template.author_table(authors)}
                <form action="/author_create" method="post">
                    <button>create</button> 
                </form>
                 <style>
                    table{
                        border-collapse: collapse;
                    }
                    td {
                        border : 1px solid black;
                    }
                 </style>

                 `,
                 `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}
exports.author_create = function(response){
    db.query('SELECT * FROM topic', (err,topics)=> {
        if(err){
            throw err;
        }
        db.query(`SELECT * FROM author`,(err2,authors)=>{
            if(err2){
                throw err2;
            }
            var title = 'author_data';
            var list = template.list(topics);
            var html = template.HTML(title, list,
                 `
                ${template.author_table(authors)}
                <form action="/author_create_process" method="post">
                    <table>
                        <tr>
                            <td>글쓴이</td>
                            <td>프로필</td>
                        </tr>
                        <tr>
                            <td><input type="text" name="name"></td>
                            <td><input type="text" name="profile"></td>
                        </tr>
                    </table>
                    <button>create</button> 
                </form>
                 <style>
                    table{
                        border-collapse: collapse;
                    }
                    td {
                        border : 1px solid black;
                    }
                 </style>

                 `,
                 `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
        });
    });

}
exports.author_create_process = function(request ,response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        
        var post = qs.parse(body);
        var name = sanitize(post.name);
        var profile = sanitize(post.profile);
        db.query(`
          INSERT INTO author (name, profile)
          VALUES (?,?)`, [name, profile],(err,result)=> {
          if(err){
            throw err;
          }

          response.writeHead(302, {Location: `/author`});
          response.end();
        });
    });
}