//classof - строковое название типа объекта
function classof(p){
  return Object.prototype.toString.call(p).slice(8,-1);
}
//is_array - является ли obj - массивом
function is_array(obj){
    return obj !== null && obj instanceof Array;
}
function is_object(obj){
    return obj !== null && typeof obj == 'object';
}


/**
 * возвращает список атрибутов объекта и значения
 * var_dump(obj[,options,max_level,separator,level])
 * obj - элемент по которому нужно вывести информацию
 * options - параметры { hide_functions:1|0 - скрыть содержимое функций
 *                     }
 * max_level - уровень детализации дочерних объектов
 * separator - разделитель между элементами объекта
 *
 * пример вызова:
 * var_dump(obj,{hide_functions:1},2);
 */
function var_dump(obj,options,max_level,separator,level){
  if(max_level === null) max_level = 99999;
  if(level === null) level = 0;
  if(separator===null) separator = "\n";
  if(is_object(obj)){
    if( level >= max_level ) return "{/*dump_max_level:"+max_level+"*/}";
    var tab = '  ';
    var tab_lv = tab;
    var i = 0;
    while(i++<level) tab_lv += tab;
    var ret = "{\n";
    i = 0;
    for(var key in obj){ // обращение к свойствам объекта по индексу
      i++;
      ret += tab_lv + key + " : " + var_dump(obj[key],options,max_level,separator,level+1) ;
      ret += ",";
      ret += separator;
    }
    ret += tab_lv + "}";
    if(i==0) ret = "{}";
    return ret;
  }
  if(options.hide_functions==1 && typeof obj == 'function'){
    re_fnc = /[^\{]*function[^\{]*\([^\)]*\)/g;
    var params = re_fnc.exec(obj.toString());
    re_fnc2 = /\([^\)]*\)/;
    params = re_fnc2.exec(params[0]);
    var newstr = "function"+params[0]+"{/*hide_functions==1*/}";
    return newstr;
  }
  return obj;
}
exports.var_dump = var_dump;

/**
 * возвращает список атрибутов объекта и значения
 * var_dump2(obj_name,obj[,options,max_level,separator,level])
 * obj_name - название элемента по которому нужно вывести информацию
 * obj - элемент по которому нужно вывести информацию
 * options - параметры { hide_functions:1|0 - скрыть содержимое функций
 *                     }
 * max_level - уровень детализации дочерних объектов
 * separator - разделитель между элементами объекта
 *
 * пример вызова:
 * var_dump(obj,{hide_functions:1},2);
 */
function var_dump2(obj_name,obj,options,max_level,separator,level){
  //return "AA";
  if(obj===null) return obj_name+" = null;";
  if(obj===undefined) return obj_name+" = undefined;";

  if(max_level === null || max_level === undefined) max_level = 99999;
  if(level === null || level === undefined) level = 0;
  if(separator===null || separator === undefined) separator = "\n";
  
  
  
  if(level>max_level) return obj_name+" = {/*dump_max_level:"+max_level+"*/};";

  var ret = "";
  if(is_object(obj)){
    if(level>=max_level) return obj_name+" = {/*dump_max_level:"+max_level+"*/};";
    var i = 0;
    for(var key in obj){
      if(i++>0) ret += separator;
      var t = obj[key];
      if(t===undefined){
        ret += obj_name+"."+key+" = undefined;";
      }else if(t===null){
        ret += obj_name+"."+key+" = null;";
      }else{
        ret += var_dump2(obj_name+"."+key,t,options,max_level,separator,level+1);
      }
    }
    if(i==0) ret = obj_name+" = {};";
  }else
  if(options.hide_functions==1 && typeof obj == 'function'){
    var newstr;
        re_fnc = /[^\(]*function[^\(\w]*\([^\)]*\)/g;
        var params = re_fnc.exec(obj);
        if(params!==null){
          re_fnc2 = /\([^\)]*\)/;
          params = re_fnc2.exec(params[0]);
          newstr = "function"+params[0]+"{/*hide_functions==1*/}";
        }else{
          newstr = obj;
        }
    ret += obj_name+" = "+newstr+";";
  }else{
    ret += obj_name+" = "+obj+";";
  }
  //if(obj!==null && obj!==undefined)

  if(level<=max_level)
  {
    var protonames = Array(
                      '__proto__',
                      //'prototype', - аналог '__proto__'
                      'proto'
                      );
    for(var i in protonames){
      var protoname = protonames[i];
      var t = obj[protoname];
      
      if(t!==undefined && t!==null && ((is_object(t) && t.length>0) || typeof t=='function') ){
        i++;
        ret += separator;
        ret += var_dump2(obj_name+"."+protoname,t,options,max_level,separator,level+1);
        console.log("var_dump2("+obj_name+"."+protoname+" ["+protoname+"],obj,options,"+max_level+",separator,"+(level+1)+");");
      }
    }
  }
  
  return ret;
}
exports.var_dump2 = var_dump2;

/**
 * возвращает список атрибутов объекта и значения
 * var_dump_node(obj_name,obj,options,level)
 * obj_name - название элемента по которому нужно вывести информацию
 * obj - элемент по которому нужно вывести информацию
 * options - параметры { hide_functions:1|0, - скрыть содержимое функций
 *                       showHidden:1|0,
 *                       max_level:1-99999, - уровень детализации дочерних объектов
 *                       max_str_length: 200, - максимальная длина выводимой строки
 *                       prepare_str_function: null, - функция обработки строки до её вывода, например function(s){return s.replace(/\n/g,"");}
 *                       prepare_num_function: null, - функция обработки числа до его вывода, например function(n){return n*1000;}
 *                       separator:"\n", - разделитель между значениями объекта
 *                       exclude: [/^exclude_object_name$/i,/other_name/i] //исключить следующие имена из набора
 *                       search: /^regexp$/igm //включить в набор только элементы которые соответствуют этому значению
 *                     }
 * пример вызова:
 * var_dump("dumpvarname",obj,{hide_functions:1,max_level:3});
 */
function var_dump_node(obj_name,obj,options,level){
  if(options === null || options === undefined){
    options = {max_level:5,
               separator:'\n',
               showHidden:1,
               hide_functions:0,
               max_str_length: 200,
               prepare_str_function:null,
               prepare_num_function:null,
               _main_obj:obj,
               _main_obj_name:obj_name
              };
  }else{
    if(options.max_level===null || options.max_level===undefined) options.max_level = 5;
    if(options.max_str_length===null || options.max_str_length===undefined) options.max_str_length = 200;
    if(options.separator===null || options.separator===undefined) options.separator = "\n";
    if(options.showHidden===null || options.showHidden===undefined) options.showHidden = 1;
    if(options.hide_functions===null || options.hide_functions===undefined) options.hide_functions = 1;
    if(options._main_obj===null || options._main_obj===undefined) options._main_obj = obj;
    if(options._main_obj_name===null || options._main_obj_name===undefined) options._main_obj_name = obj_name;
  }
  
  if(options.exclude){
    if(options.exclude instanceof Array){
        for(var i in options.exclude){
            var exclude_opt = options.exclude[i];
            if(exclude_opt instanceof RegExp){
                if(exclude_opt.test(obj_name)) return obj_name + " = {/*exclude: RegExp(" +exclude_opt+ ")*/};"+options.separator;
            }else
            if(exclude_opt instanceof String){
                if(exclude_opt == obj_name) return obj_name + " = {/*exclude: String(" +exclude_opt+ ")*/};";
            }
        }
    }else{
        var exclude_opt = options.exclude[i];
        if(exclude_opt instanceof RegExp){
            if(exclude_opt.test(obj_name)) return obj_name + " = {/*exclude: RegExp(" +exclude_opt+ ")*/};"+options.separator;
        }else
        if(exclude_opt instanceof String){
            if(exclude_opt == obj_name) return obj_name + " = {/*exclude: String(" +exclude_opt+ ")*/};"+options.separator;
        }
    }
  }
  
  if(level===null || level===undefined) level = 0;
  else if(level>0 && options._main_obj === obj){
      return obj_name+" = &"+options._main_obj_name+";"+options.separator;
  }
  
  if(level>=options.max_level) return obj_name+" = {/*dump_max_level:"+options.max_level+"*/};"+options.separator;
  
  if(obj===null) return obj_name+" = null;"+options.separator;
  if(obj===undefined) return obj_name+" = undefined;"+options.separator;
  

  var ret = "";

  if(typeof obj == 'function'){
      if(options.hide_functions==1){
        var newstr = hide_function_strcode(obj);
        ret += obj_name+" = "+newstr+";"+options.separator;
      }else{
        ret += obj_name+" = "+obj+";"+options.separator;
      }
  }
  else if(typeof obj == 'string' ){
    var s = obj;
    var len = s.length;
    if(len>options.max_str_length*2){
        s = s.substr(0,options.max_str_length)+"\"+\""+s.substr(len-options.max_str_length);
    }
    if(typeof options.prepare_str_function == 'function'){
        s = options.prepare_str_function(s);
    }
    ret += obj_name+" = String(\"" +s+"\"); //length:"+len+options.separator;
  }else if(typeof obj == 'number' ){
    var n = Number(obj);
    if(typeof options.prepare_num_function == 'function'){
        n = options.prepare_num_function(n);
    }
    ret += obj_name+" = Number(" +n+");"+options.separator;
  }else if(typeof obj == 'boolean') ret += obj_name+" = Boolean("+obj+");"+options.separator;
  else if(obj instanceof Date    ) ret += obj_name+" = new Date(\""+obj.toString()+"\");"+options.separator;
  /*else if(obj instanceof Array   ){
    for(var key in obj){
        if(i++>0) ret += separator;
        var t = obj[key];
        if(t===undefined){
          ret += obj_name+"."+key+" = undefined;";
        }else if(t===null){
          ret += obj_name+"."+key+" = null;";
        }else{
          ret += var_dump2(obj_name+"."+key,t,options,max_level,separator,level+1);
        }
    }
  }*/
  else if(obj.toString().match(/^[\s\n]*function/)){
        ret += obj_name+" = "+hide_function_strcode(obj)+";"+options.separator;
  }
  if( obj instanceof Array ){
    for(var key in obj){
        var t = obj[key];
        var sname = "["+key+"]";
        ret += var_dump_node(obj_name+sname,t,options,level+1);
    }
  }
  if(typeof obj == 'function' || obj instanceof Object ){
        var text_dump = require('util').inspect(obj,{showHidden:options.showHidden,depth:0});
        var a = text_dump.match(/(\w*|\'[^\']*\'|\"[^\"]*\")(?=\:)/ig);
        //console.log(require('util').inspect(a));
        if(a!==null){
            a.sort();
            var prev_a = "";
            for(var i in a){
              var aname = a[i];
              if(aname=="" || aname=="Function" || prev_a==aname) continue;
              prev_a = aname;
              //ret += "["+a[i]+"]\n";
              var sname = "."+aname;
              var var_str = "obj."+aname;
              if(aname.charAt(0)=="\'" || aname.charAt(0)=="\""){
                sname = "["+aname+"]";
                var_str = "obj["+aname+"]";
              }
              //console.log("var_str == "+var_str);

              var t = undefined;
              try{
                t = eval(var_str);
              }catch(e){
                ret += obj_name+sname+" = # DUMP ERROR #;"+options.separator;
              }
              if(t!==undefined){
                ret += var_dump_node(obj_name+sname,t,options,level+1);
              }
            }
        }
  }
  if(ret==""){
    if(obj.toString().charAt(0)=="/") ret += obj_name+" = "+obj+";"+options.separator;
    else{
        if(get_object_size(obj)>0){
            ret += obj_name+" = /* DUMP UNDEFINED */ "+obj+";"+options.separator;
        }else{
            ret += obj_name+" = {};"+options.separator;
        }
    }
  }
  if(options.search){
    if(options.search.test(ret)){
        return ret;
    }else{
        //return obj_name+" = {/*not found RegExp("+options.search+")*/};"+options.separator;
        return "";
    }
  }
  return ret;
}
exports.var_dump_node = var_dump_node;
exports.dump = var_dump_node;

function get_object_size(obj){
  var size = 0, key; // get the size data
  for (key in obj) { // check the okeys in the object
    if (obj.hasOwnProperty(key)) size++; // increase the size
  }
  return size; // return the size of the object
}
exports.get_object_size = get_object_size;

function hide_function_strcode(str_function){
    var newstr;
    re_fnc = /[^\{]*(?=\{)/g;
    var params = re_fnc.exec(str_function);
    if(params!==null){
          newstr = params[0].replace("  "," ");
          newstr = newstr.replace(") ",")");
          newstr = newstr.replace(" (","(");
          newstr = newstr.replace(" function","function");
          newstr = newstr+"{/*hide_functions==1*/}";
    }else{
          newstr = str_function;
    }
    return newstr;
}