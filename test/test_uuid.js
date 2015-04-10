'use strict';

require('mocha');
var should = require('should');
var join = require('path').join;

var lib = require('../index.js');

var clog = console.log;

var count_test_repeat1 = 200;
var count_test_repeat2 = 20;
var count_subtests     = 0;
var count_subtests_big = 5;
var run_all_test = 1;
var hide_log_test = 1;

var tests_info = {pass:0,fail:0};
/****
function get_sz(l) {
    var max_n = Math.pow(2,32);
    var ret = {sz: 2, max_n: Math.pow(l,2)};
    for(var i=2;i<33;i++){
        var p = Math.pow(l,i);
        if (p>=max_n) {
            break;
        }
        ret.sz = i;
        ret.max_n = p;
    }
    return ret;
}
for(var i=2;i<256;i++){
    var d = get_sz(i);
    //d.max_n /= 1024*1024*1024;
    var msg = 'if (l=='+i+') return {sz:'+d.sz+',max_n:'+d.max_n+'};';
    clog(msg);
}
*****/
var uuid = lib.uuid;
var uuid_str = lib.uuid_str;
describe('run tests uuid', function() {
    var itogi = {pass:0,fail:0};
    for (var i=0;i<count_test_repeat1;i++) {
        var id1 = uuid.v1();
        var ids = uuid_str.tostr(id1);
        var id2 = uuid_str.fromstr(ids);
        
        
        var msg = i+': '+id1+' -> '+ids+' -> '+id2;
        var ok = 0;
        if (id1==id2) ok = 1;
        
        if (ok){
            itogi.pass++;
            msg += ' pass';
        }else{
            itogi.fail++;
            msg += ' fail';
        }
        clog(msg);
    }
    
    for (var i=0;i<count_test_repeat2;i++) {
        var id1 = uuid.v4();
        var ids = uuid_str.tostr(id1);
        var id2 = uuid_str.fromstr(ids);
        
        
        var msg = i+': '+id1+' -> '+ids+' -> '+id2;
        var ok = 0;
        if (id1==id2) ok = 1;
        
        if (ok){
            itogi.pass++;
            msg += ' pass';
        }else{
            itogi.fail++;
            msg += ' fail';
        }
        clog(msg);
    }
    
    for (var i=0;i<count_test_repeat2;i++) {
        var id1 = uuid.v4();
        var ids = uuid_str(id1);
        var id2 = uuid_str(ids);
        
        
        var msg = i+': '+id1+' -> '+ids+' -> '+id2;
        var ok = 0;
        if (id1==id2) ok = 1;
        
        if (ok){
            itogi.pass++;
            msg += ' pass';
        }else{
            itogi.fail++;
            msg += ' fail';
        }
        clog(msg);
    }

    clog(itogi);
});

