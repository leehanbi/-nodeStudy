

var fs = require('fs');

console.log('A');
// 동기화
var result1 = fs.readFileSync('syntax/sample.txt','utf8');
console.log(result1);
console.log('C');


console.log('A');
// 비동기화
fs.readFile('syntax/sample.txt','utf8', (err,result) => {
  console.log(result);
});
console.log('C');
