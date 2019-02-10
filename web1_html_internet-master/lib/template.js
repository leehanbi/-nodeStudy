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
    var author_table = `
    <table>
      <tr>
        <td>글번호</td>
        <td>이름</td>
        <td>프로필</td>
        <td>수정</td>
        <td>삭제</td>
      </tr>
    `;
    var i = 0;
    
    while(i< authors.length){
        author_table += `
        <tr>
            <td>${authors[i].id}</td>
            <td>${authors[i].name}</td>
            <td>${authors[i].profile}</td>
            <td><a href="/author_update?id=${authors[i].id}">update</a></td>
            <td><a href="/author_delete?id=${authors[i].id}">delete</a></td>
        </td>
        `
        i++;
    };
    author_table += '</table>';
    return author_table;
  }
}
