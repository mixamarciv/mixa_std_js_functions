
exports.get_ipv4_adress_list = function get_ipv4_adress_list(filter) {
  var list = [];
  var os=require('os');
  var ifaces=os.networkInterfaces();
  for (var dev in ifaces) {
    ifaces[dev].forEach(function(details){
      if (details.family=='IPv4') {
          //console.log(dev+(alias?':'+alias:''),details.address);
          if (filter instanceof RegExp) {
              if (filter.test(details.address)) {
                  list.push(details.address);
              }
          }else if (typeof(filter) === 'string' || filter instanceof String) {
              if (filter == details.address.substring(0,filter.length)) {
                  list.push(details.address);
              }
          }else{
              list.push(details.address);
          }
      }
    });
  }
  return list;
}

