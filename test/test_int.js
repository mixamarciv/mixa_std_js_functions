'use strict';

require('mocha');
var should = require('should');
var join = require('path').join;

var lib = require('../index.js');

var clog = console.log;

var count_test_repeat = 2;
var count_subtests    = 5;

describe('run int tests', function() {
    
    var from_chars, to_chars;
    
    from_chars = '0123456789';
    to_chars   = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    clog('\nfrom: '+from_chars+'  to: '+to_chars);
    for(var j=0;j<count_test_repeat;j++){
        for(var i=0;i<count_subtests;i++){
            var n = get_big_random_n();
            test(String(n),from_chars,to_chars,0);
        }
        for(var i=0;i<count_subtests;i++){
            var n = Math.floor(Math.random() * 1024*1024);
            test(String(n),from_chars,to_chars,0);
        }
    }

    from_chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    to_chars   = '0123456789';
    clog('\nfrom: '+from_chars+'  to: '+to_chars);
    for(var j=0;j<count_test_repeat;j++){
        for(var i=0;i<count_subtests;i++){
            var n = get_big_random_n();
            n = n.toString(36);
            test(String(n),from_chars,to_chars,0);
        }
        for(var i=0;i<count_subtests;i++){
            var n = Math.floor(Math.random() * 1024*1024);
            n = n.toString(36);
            test(String(n),from_chars,to_chars,0);
        }
    }
    
    from_chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    to_chars   = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    clog('\nfrom: '+from_chars+'  to: '+to_chars);
    for(var j=0;j<count_test_repeat;j++){
        for(var i=0;i<count_subtests;i++){
            var n = get_big_random_n();
            n = n.toString(36);
            test(String(n),from_chars,to_chars,0);
        }
        for(var i=0;i<count_subtests;i++){
            var n = Math.floor(Math.random() * 1024*1024);
            n = n.toString(36);
            test(String(n),from_chars,to_chars,0);
        }
    }
    
    from_chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    to_chars   = 'abc';
    clog('\nfrom: '+from_chars+'  to: '+to_chars);
    for(var j=0;j<count_test_repeat;j++){
        for(var i=0;i<count_subtests;i++){
            var n = get_big_random_n();
            n = n.toString(36);
            test(String(n),from_chars,to_chars,0);
        }
        for(var i=0;i<count_subtests;i++){
            var n = Math.floor(Math.random() * 1024*1024);
            n = n.toString(36);
            test(String(n),from_chars,to_chars,0);
        }
    }
    
    from_chars = '01';
    to_chars   = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    clog('\nfrom: '+from_chars+'  to: '+to_chars);
    for(var j=0;j<count_test_repeat;j++){
        for(var i=0;i<count_subtests;i++){
            var n = Math.floor(Math.random() * 1024*1024);
            n = n.toString(2);
            test(String(n),from_chars,to_chars,0);
        }
    }
    
});

function get_big_random_n() {
    return Math.floor(Math.random() * Math.pow(1024,5)) + Math.floor(Math.random() * Math.pow(1024,2)) + Math.floor(Math.random() * 100000);
}

function test(num,from_chars,to_chars,notest,add_end_symbols) {
    var convert = lib._int.convert;
    var num1 = num;
    var num2 = convert(num1,from_chars,to_chars,add_end_symbols);
    var num3 = convert(num2,to_chars,from_chars,add_end_symbols);
    clog(num1+' -> '+num2+' -> '+num3);
    if(!notest) (num2).should.be.not.equal(num1);
    if(!notest) (num3).should.be.equal(num1);
}


