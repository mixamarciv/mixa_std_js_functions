
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


