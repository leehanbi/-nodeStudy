

var a = function () {
  console.log('A');
}


// callback에 var a를 넘겨주면 콜백메소드로 로그 출력하는 a메소드가 불러와진다
function slowfunc(callback){
  callback();
}

slowfunc(a);
