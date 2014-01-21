//функции для определения типа объекта

//classof - строковое название типа объекта
exports.class_of = function class_of(p){
  return Object.prototype.toString.call(p).slice(8,-1);
}
//is_array - является ли obj - массивом
exports.is_array = function is_array(obj){
    return obj !== null && obj instanceof Array;
}
//is_array - является ли obj - объектом
exports.is_object = function is_object(obj){
    return obj !==null && typeof obj == 'object' && !(obj instanceof Array) && !(obj instanceof RegExp);
}
exports.str_typeof = function str_typeof(obj){
    return typeof obj;
}

/*******
console.log('===================================');
var test_fnc = is_object;
test_function("class_of");
test_function("str_typeof");
test_function("is_object");
test_function("is_array");

function test_function(function_name){
    var test_fnc = null;
    eval('test_fnc = '+function_name+';');
    
    console.log(function_name+': undefined == ' + test_fnc(undefined));
    console.log(function_name+': null      == ' + test_fnc(null));
    console.log(function_name+': "test"    == ' + test_fnc('test'));
    console.log(function_name+': ""        == ' + test_fnc(''));
    console.log(function_name+': 123       == ' + test_fnc(123));
    console.log(function_name+': 0         == ' + test_fnc(0));
    console.log(function_name+': [1,2,3]   == ' + test_fnc([1,2,3]));
    console.log(function_name+': []        == ' + test_fnc([]));
    console.log(function_name+': {a:1,b:2} == ' + test_fnc({a:1,b:2}));
    console.log(function_name+': {}        == ' + test_fnc({}));
    console.log(function_name+': /\w/i     == ' + test_fnc(/\w/i));
    console.log(function_name+': express   == ' + test_fnc(express));
    console.log(function_name+': function  == ' + test_fnc(function(){}));
}
******/
