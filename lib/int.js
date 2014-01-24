
//возвращает случайное число от min до max
module.exports.get_random_int = function get_random_int(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


