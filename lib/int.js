'use strict'

var clog = console.log;

//возвращает случайное число от min до max
module.exports.get_random_int = function get_random_int(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports.round_size_bytes = function round_size_bytes(s){
  var type = 'b ';
  if (s >= 10000) {
    s /= 1024;
    type = 'Kb';
  }
  if (s >= 10000) {
    s /= 1024;
    type = 'Mb';
  }
  if (s >= 10000) {
    s /= 1024;
    type = 'Gb';
  }
  if (s >= 10000) {
    s /= 1024;
    type = 'Tb';
  }
  s = s.toFixed(2)+type;
  return s;
}

var bigint = require("bigint-node"); //Leemon Baird's BigInt Lib

var bigint_digitsStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_=!@#$%^&*()[]{}|;:,.<>/? \\\'\"+-'; //need add `
/*****
var bigint_digitsStr_n = {};
for(var i=0;i<bigint_digitsStr.length;i++){
    var s = bigint_digitsStr[i];
    bigint_digitsStr_n[s] = i;
}
*****/
module.exports.convert = function(num,from_symbols,to_symbols) {
  if (bigint_digitsStr.length < from_symbols.length) {
    return 'ERROR: from_symbols.length ('+from_symbols.length+') > max_base ('+bigint_digitsStr.length+')';
  }
  if (bigint_digitsStr.length < to_symbols.length) {
    return 'ERROR: to_symbols.length ('+to_symbols.length+') > max_base ('+bigint_digitsStr.length+')';
  }
  
  /*****
  var from_symbols_n = {};
  for(i=0;i<from_symbols.length;i++){
    var s = from_symbols[i];
    from_symbols_n[s] = i;
  }
  *****/
  
  var base1 = from_symbols.length;
  var num1 = '';
  for(var i=0;i<num.length;i++){
      var s = num[i];
      //var n = from_symbols_n[s];
      var n = from_symbols.indexOf(s);
      num1 += String(bigint_digitsStr[n]);
  }
  
  var base2 = to_symbols.length;
  var num2 = '';
  
  if (base1==base2) {
    for(i=0;i<num.length;i++){
      var s = num[i];
      //var n = from_symbols_n[s];
      var n = from_symbols.indexOf(s);
      num2 += String(to_symbols[n]);
    }
    return num2;
  }
  
  
  var bint = bigint.ParseFromString(num1,base1);
  var bstr = bint.toStr(base2);
  
  var num2 = '';
  //var test_1 = num2;
  //var test_2 = '';
  for(var i=0;i<bstr.length;i++){
    var s = bstr[i];
    //var n = bigint_digitsStr_n[s];
    var n = bigint_digitsStr.indexOf(s);
    num2 += String(to_symbols[n]);
    //test_2 += i+':'+s+'('+n+')->'+to_symbols[n]+'; ';
  }
  //clog(test_2);
  //clog(num+' -> str2int('+num1+','+base1+') -> toStr('+bint.toStr(16)+','+base2+') -> '+bstr+' -> '+num2);
  return num2;
}






