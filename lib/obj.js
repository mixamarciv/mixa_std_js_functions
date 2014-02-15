//classof - строковое название типа объекта
exports.classof = function classof(p){
  return Object.prototype.toString.call(p).slice(8,-1);
}
//is_array - является ли obj - массивом
exports.is_array = function is_array(obj){
    return obj !== null && obj instanceof Array;
}
exports.is_object = function is_object(obj){
    return obj !== null && typeof obj == 'object';
}



exports.get_object_size = function get_object_size(obj){
  var size = 0, key; // get the size data
  for (key in obj) { // check the okeys in the object
    if (obj.hasOwnProperty(key)) size++; // increase the size
  }
  return size; // return the size of the object
}

//add_object - добавляем все элементы из from_object в to_obj,
//  если replace==1 то существующие элементы заменяем
exports.add_object = function add_object(to_obj,from_object,replace){
  var key; // get the size data
  for (key in from_object) { // check the okeys in the object
    if (from_object.hasOwnProperty(key)){
      if(to_obj.hasOwnProperty(key)==0 || replace) to_obj[key] = from_object[key];
    }
  }
  return to_obj;
}
