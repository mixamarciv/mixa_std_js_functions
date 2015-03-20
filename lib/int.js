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

/************
smin	smax	bit	
0	1	1	
0	3	2	11
0	7	3	111
0	15	4	1111
0	31	5	11011
0	63	6	110111
0	127	7	1101101
0	255	8	11011011


2	31
3	20
4	16
5	14
6 - 7	12
8	11
9 - 10	10
11	9
15-21	8
22-35	7
36-73	6
74-215	5
216-255	4


*************/

module.exports.convert = function(num,from_symbols,to_symbols,add_end_sybols) {
  
  num = String(num);
  var len1 = from_symbols.length;
  var len2 = to_symbols.length;
  var i;
  var from_symbols_n = {};
  var to_symbols_n = {};
  var num2 = '';
  
  for(i=0;i<from_symbols.length;i++){
    var s = from_symbols[i];
    from_symbols_n[s] = i;
  }
  for(i=0;i<to_symbols.length;i++){
    var s = to_symbols[i];
    to_symbols_n[s] = i;
  }
  
  
  if (len1==len2) {
    for(i=0;i<num.length;i++){
      var s = num[i];
      num2 += String(to_symbols[from_symbols_n[s]]);
    }
    return num2;
  }
  
  var sz = 0;
  

  {
      var num3 = '';
      var sz1 = get_sz(len1);
      var sz2 = get_sz(len2);
      
      var istart = 0;
      var isend = 1;
      var sec = String(num);
      if (num.length>sz1) {
          istart = num.length-sz1;
          isend = 0;
          sec = num.substring(istart);
      }
      while(1){
          var n = 0;
          for(i=0;i<sec.length;i++){
              var s = sec[i];
              var sn = from_symbols_n[s];
              n += sn * Math.pow(len1,sec.length-1-i);
          }
          while(n>=len2) {
            var ost = n % len2;
            n = Math.floor(Number(n / len2));
            num2 = String(to_symbols[ost]) + num2;
            //num2 += String(to_symbols[ost]);
            ost = 0;
          }
          num2 = String(to_symbols[n]) + num2;
          //num2 += String(to_symbols[n]) ;
          if (!isend || add_end_sybols)
          while(num2.length < sz2) {
            num2 = String(to_symbols[0]) + num2;
            //num2 += String(to_symbols[0]);
          }
          
          num3 = num2 + num3;
          num2 = '';
          var sz1_crop = sz1;
          istart -= sz1;
          if (istart<=0){
            sz1_crop += istart;
            istart = 0;
            isend++;
          }
          if (isend>1) break;
          sec = String(num).substring(istart,sz1_crop);
      }
      return num3;
  }

  

}

//определяет размер блоков в зависимости от количества используемых символов в числе 
function get_sz(l) {
/*************
2	31
3	20
4	16
5	14
6 - 7	12
8	11
9 - 10	10
11-14   9
15-21	8
22-35	7
36-73	6
74-215	5
216-255	4
*************/
  //return ;
  if (l<=73) {
    if (l>=15) {
      if (l<=21) return 8;
      if (l<=35) return 7;
      return 6;
    }
    if (l>=9) {
      if (l<=10) return 10;
      return 9;
    }
    if (l>=6) {
      if (l<=7) return 12;
      return 11;
    }
    if (l==5) return 14;
    if (l==4) return 16;
    if (l==3) return 20;
    if (l==2) return 31;
  }
  if (l<=215) return 5;
  return 4;
}

