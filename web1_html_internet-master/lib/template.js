module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <p><a href="/author">author</a></p> 
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },author_table:function(authors){
    var author_table = `<table>
    <td>글번호</td>
    <td>이름</td>
    <td>프로필</td>
    `;
    var i = 0;
    
    while(i< authors.length){
        author_table += `
        <tr>
            <td>${authors[i].id}</td>
            <td>${authors[i].name}</td>
            <td>${authors[i].profile}</td>
        </td>
        `
        i++;
    };
    author_table += '</table>';
    return author_table;
  }
}
