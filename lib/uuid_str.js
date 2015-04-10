
var lib = require("../index.js");
var uuid = lib.uuid;

var conv = lib._int.convert;
var symbols = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
function convert_tostr(p) {
    p = conv(p,'0123456789abcdef',symbols);
    while(p.length<22) {
        p = symbols[0] + p;
    }
    return p;
}
function convert_fromstr(p) {
    p = conv(p,symbols,'0123456789abcdef');
    while(p.length<32) {
        p = '0' + p;
    }
    return p;
}

module.exports = function(p1){
    if (arguments.length==0) return uuid_tostr(uuid.v4());
    if (p1.length==36) {
        return uuid_tostr(p1);
    }
    return uuid_fromstr(p1);
}

module.exports.tostr   = uuid_tostr;
module.exports.fromstr = uuid_fromstr;

function uuid_tostr(p) {
    p = p.replace(/\-/g,'');
    p = convert_tostr(p);
    return p;
}

//9440c4cc-3c00-4104-8afd-398d3b69ec52
//SrzO01PR-xP5WwnBPjM7M
//bU0hYi1azaZS09_CAdiYl_
function uuid_fromstr(p) {
    p = convert_fromstr(p);
    p = p.substring(0,8)+'-'+p.substring(8,12)+'-'+p.substring(12,16)+'-'+p.substring(16,20)+'-'+p.substring(20,32);
    return p;
}



