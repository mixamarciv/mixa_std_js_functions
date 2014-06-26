

//получить время в виде строки сколько прошло с time_begin по time_end
exports.time_duration_str = function time_duration_str(time_begin,time_end){
      if(!time_begin['getTime']){
            if(time_begin['toFixed']){
                  time_begin = new Date(time_begin);
            }            
      }
      if(!time_end){
            time_end = new Date();
      }else
      if(!time_end['getTime']){
            if(time_end['toFixed']){
                  time_end = new Date(time_end);
            }
      }
      
      var t = time_end.getTime()-time_begin.getTime();
      
      var a = t % 1000;
      t /= 1000;
      var ret_s = a+"ms";
      //ret_s += "["+t+"]";
      
      t = t.toFixed();
      if(t>0){
          a = t % 60;
          t /= 60;
          ret_s = a+"s "+ret_s;
      }else{
          return ret_s;
      }
      
      t = t.toFixed();
      if(t>0){
          a = t % 60;
          t /= 60;   
          ret_s = a+"m "+ret_s;
      }else{
          return ret_s;
      }
      
      t = t.toFixed();
      if(t>0){
          a = t % 24;
          t /= 24;   
          ret_s = a+"h "+ret_s;
      }else{
          return ret_s;
      }
      
      t = t.toFixed();
      if(t>0){
          a = t % 30;
          t /= 30;   
          ret_s = a+"d "+ret_s;
      }else{
          return ret_s;
      }
      
      t = t.toFixed();
      if(t>0){
          a = t % 12;
          t /= 12;   
          ret_s = a+"mth "+ret_s;
      }else{
          return ret_s;
      }
      
      t = t.toFixed();
      if(t>0){
          a = t;
          ret_s = a+"y "+ret_s;
      }else{
          return ret_s;
      }
      
      return ret_s;
}

/**********
date_to_str_format(time,format_str) выводит дату - time в формате format_str:
format_str - строка задает какие данные даты и в какой последовательности будут выведены:
Y - год, в виде 1900-2100
M - месяц (01-12)
D - день (01-31)
W - день недели 0-6(0 - воскресенье;1-п)
h - час (00-23)
m - минуты (00-59)
k - миллисекунды (000-999)
**********/
exports.date_format = date_to_str_format;
exports.date_to_str_format = date_to_str_format;
function date_to_str_format(time,format_str){
      if(arguments.length==1){
            format_str = time;
            time = new Date();
      }else{
            time = new Date(time);
            /*if (typeof(time)!=='Date') {
                  return "WRONG TIME";
            }*/
      }
      
      var s = String(format_str);
      if(!s || s=="") s = "Y.M.D (W) h:m:s.k";
      if(/Y/gm.test(s)) s = s.replace(/Y/gm,time.getFullYear());
      if(/M/gm.test(s)) s = s.replace(/M/gm,String(100+time.getMonth()+1).substring(1));       
      if(/D/gm.test(s)) s = s.replace(/D/gm,String(100+time.getDate()).substring(1));          
      if(/W/gm.test(s)) s = s.replace(/W/gm,time.getDay());                                    
      if(/h/gm.test(s)) s = s.replace(/h/gm,String(100+time.getHours()).substring(1));
      if(/m/gm.test(s)) s = s.replace(/m/gm,String(100+time.getMinutes()).substring(1));
      if(/s/gm.test(s)) s = s.replace(/s/gm,String(100+time.getSeconds()).substring(1));
      if(/k/gm.test(s)) s = s.replace(/k/gm,String(1000+time.getMilliseconds()).substring(1));
      return s;
}



exports.set_fix_len = function set_fix_len(str,len,add_simbols,align_right){
      if (str.length==len) return str;
      if (str.length>len) {
            if (add_simbols) {
                  str = str.substr(0,len-add_simbols.length)+add_simbols;
                  return str;
            }else{
                  str = str.substr(0,len);
                  return str;
            }
            
      }
      //var tsp = str_spaces;
      var tsp = str_spaces;
      //var original = str;
      
      if (align_right) {
            str = String(tsp + String(str));
            while (str.length<len) str = String(tsp + String(str));
            str = str.substr(str.length-len,len);
            //console.log('"'+original+'"=>"'+str+'"')
            return str;
      }else{
            str = String(str) + tsp;
            while (str.length<len) str = String(String(str) + tsp);
            str = str.substr(0,len);
            //console.log('"'+original+'"=>"'+str+'"')
            return str;
      }
}

var str_spaces = "                                                           "
                +"                                                           "
                +"                                                           "
                +"                                                           "
                +"                                                           "
                +"                                                           "
                +"                                                           ";



exports.translitirate = function translitirate(text){
      var translit = text;
      if(text && typeof text == 'string' ){
            //applying зг-zgh rule
          translit = "";
          var map = translitirate_mapping;
          for(i=0; i < text.length; i++){
              var character = text[i], latinCharacter = map[character];
              if(latinCharacter || '' === latinCharacter){
                  translit += latinCharacter;
              }else{
                  translit += character;
              }
          }
      }
      return translit;
}

var translitirate_mapping = {
        'А':'A',
        'а':'a',
        'Б':'B',
        'б':'b',
        'В':'V',
        'в':'v',
        'Г':'H',
        'г':'h',
        'Ґ':'G',
        'ґ':'g',
        'Д':'D',
        'д':'d',
        'Е':'E',
        'е':'e',
        'Є':'Ye',
        'є':'ie',
        'Ж':'Zh',
        'ж':'zh',
        'З':'Z',
        'з':'z',
        'И':'I',
        'и':'i',
        'І':'I',
        'і':'i',
        'Ї':'Yi',
        'ї':'i',
        'Й':'iY',
        'й':'iy',
        'К':'K',
        'к':'k',
        'Л':'L',
        'л':'l',
        'М':'M',
        'м':'m',
        'Н':'N',
        'н':'n',
        'О':'O',
        'о':'o',
        'П':'P',
        'п':'p',
        'Р':'R',
        'р':'r',
        'С':'S',
        'с':'s',
        'Т':'T',
        'т':'t',
        'У':'U',
        'у':'u',
        'Ф':'F',
        'ф':'f',
        'Х':'Kh',
        'х':'kh',
        'Ц':'Ts',
        'ц':'ts',
        'Ч':'Ch',
        'ч':'ch',
        'Ш':'LLI',//'Sh',
        'ш':'lll',//'sh',
        'Щ':'LLL',//'Shch',
        'щ':'llL',//'shch',
        'ы':'bl',
        'Ы':'bI',
        'Ю':'Yu',
        'ю':'Yu',
        'Я':'Ya',
        'я':'ya',
        'ь':'b',
        'Ь':'b',
        'э':'e',
        'Э':'E',
        "'":''
};


//генерим пароль длиною pass_length
exports.pass_generator = function(pass_length){
	var plen = pass_length ? pass_length : 10;
	if(plen<3) plen = 3;

	var symbols_arr = ["QWERTYUPASDFGHJKLZXCVBNM","qwertyupasdfghjkzxcvbnm","23456789"]; //все кроме 1lIi0Oo
	var symbols_len = [];
	for(var i=0;i<symbols_arr.length;i++){
		var symbols = symbols_arr[i];
		symbols_len[i] = symbols.length;
	}
	var i_type_use = {};
	var pass = "";
	for(var i = 0; i < plen; i++){
		var i_type = Math.round(Math.random()*2);
		if(!i_type_use[i_type]) i_type_use[i_type] = 0;		
		if(i>=plen-symbols_arr.length){
			for(var t=0;t<symbols_arr.length;t++){
				if(!i_type_use[t] || i_type_use[t]==0){
					i_type = t;
					break;
				}
			}
		}
		i_type_use[i_type]++;
		var i_symbol = Math.round(Math.random()*(symbols_len[i_type]-1));
		pass += symbols_arr[i_type].charAt(i_symbol);
	}

	return pass;
}
