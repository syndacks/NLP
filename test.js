function foo() {
  var passMe = 1+1;
  foo();
  bar(passMe);
}

function bar(passMe) {
  console.log(passMe);
}