'use strict';

require('mocha');
var should = require('should');
var join = require('path').join;

var lib = require('../index.js');

var clog = console.log;

var count_test_repeat = 2;
var count_subtests     = 0;
var count_subtests_big = 5;
var run_all_test = 1;
var hide_log_test = 0;

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
var bigint = require("bigint-node");
function convert_bigint(num,from_base,to_base) {
    var bint = bigint.ParseFromString(num,from_base);
    var bstr = bint.toStr(to_base);
    return bstr;
}

function test_bigint(num1,from_base,to_base,hide) {
    var num2 = convert_bigint(num1,from_base,to_base);
    var num3 = convert_bigint(num2,to_base,from_base);

    var enc_info = from_base + '->' + to_base;
    var msg = num1+' -> '+num2;
    
    if(!tests_info[enc_info]) tests_info[enc_info] = {pass:0,fail:0};
    var fail = 0;
    if (num1 == num3) {
        msg = enc_info+' [pass] '+msg;
        tests_info.pass ++;
        tests_info[enc_info].pass++;
    }else{
        fail = 1;
        msg += ' ->fail: '+num3;
        msg = enc_info+' [fail] '+msg;
        tests_info.fail ++;
        tests_info[enc_info].fail++;
    }
    if(fail || !hide) console.log(msg);
}

function rand(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var bigint_digitsStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_=!@#$%^&*()[]{}|;:,.<>/? \\\'\"+-';//need add `
function get_random_n(symbols,base,len) {
    var r = String(symbols[rand(1,base-1)]);
    for(var i=0;i<len;i++){
        r += String(symbols[rand(0,base-1)]);
    }
    return r;
}

function run_tests_bigint(from_base,to_base,len_from,len_to,repeat,hide) {
    clog('from: '+from_base+' to: '+to_base);
    for(var len=len_from;len<=len_to;len++){
        for(var j=0;j<repeat;j++){
            var num = get_random_n(bigint_digitsStr,from_base,len);
            test_bigint(num,from_base,to_base,hide);
        }
    }
}

if (!run_all_test)
describe('run int tests bigInt', function() {
    tests_info = {pass:0,fail:0};
    var max_base = bigint_digitsStr.length;
    for(var i=2;i<=max_base;i++){
        for(var j=2;j<=max_base;j++){
            run_tests_bigint(i,j,1,20,count_test_repeat,1);
        }
    }
    show_tests_info();
});

if (run_all_test)
describe('run int tests', function() {
    
    var from_chars, to_chars;
    var all_symbols = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .,!@#$%^&*()_-+=/{}\\\'|"?[]<>:;'; //`~
    var from_chars_all = '0123456789abcdefghijklmnopqrstuvwxyz';
    var to_chars_all   = all_symbols;
     
  
    if (run_all_test) {
        var sz1 = from_chars_all.length;
        var sz2 = to_chars_all.length;
        var c = [93,36];
        //c = [8,9,10]
        for(var i=2;i<=sz1;i+=1){
            //if (c.indexOf(i)<0) continue;
            from_chars = from_chars_all.substring(0,i);
            for(var j=2;j<=sz2;j+=1){
                //if (c.indexOf(j)<0) continue;
                
                to_chars = to_chars_all.substring(0,j);
                run_tests(from_chars,to_chars,hide_log_test);
            }
        }
    }

    //vtest('50746304641836',from_chars,to_chars);
    //test('112233445566778800112233445566778800112233445566778800',from_chars,to_chars);

    var symbols = [];
    symbols.push({
            from_chars: all_symbols,
            to_chars:   '01'
        });
    symbols.push({
            from_chars: all_symbols,
            to_chars:   '012345'
        });
    symbols.push({
            from_chars: all_symbols,
            to_chars:   '01234567'
        });
    symbols.push({
            from_chars: all_symbols,
            to_chars:  '012345678'
        });
    symbols.push({
            from_chars: all_symbols,
            to_chars:   '0123456789'
        });
    symbols.push({
            from_chars: all_symbols,
            to_chars:   '0123456789a'
        });
    symbols.push({
            from_chars: all_symbols,
            to_chars:   '0123456789abcdef'
        });
    symbols.push({
            from_chars: all_symbols,
            to_chars:   '0123456789abcdefghijklmnopqrstuvwxyz'
        });
    symbols.push({
            from_chars: all_symbols,
            to_chars:   '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        });
    
    for (var i in symbols) {
        var t = symbols[i];
        from_chars = t.from_chars;
        to_chars   = t.to_chars;
        clog('\nfrom: '+from_chars+'  to: '+to_chars);
    
        test('london',from_chars,to_chars,0,0);
        test('i am from london',from_chars,to_chars,0,0);
        test('hi my name is helen',from_chars,to_chars,0,0);
        test('long long long number 3000100500',from_chars,to_chars,0,0);
        test('long long long number 3000100500 with message: '+
             '"hi my name is Helen. I am from London. London is a capital of Greate Britan"',from_chars,to_chars,0,0);
    }
    //test('Hi my name is Helen, i am from London. London is a capital of Greate Britan.',from_chars,to_chars,0,0);
    /*****/
    show_tests_info();
});

function run_tests(from_chars,to_chars,hide) {
    if(!hide) clog('\nfrom: '+from_chars+'\n  to: '+to_chars);
    for(var j=0;j<count_test_repeat;j++){
        for(var i=0;i<count_subtests_big;i++){
            var n = get_big_random_n();
            n = n.toString(from_chars.length);
            test(String(n),from_chars,to_chars,0,0,hide);
        }
        for(var i=0;i<count_subtests;i++){
            var n = Math.floor(Math.random() * 1024*1024);
            n = n.toString(from_chars.length);
            test(String(n),from_chars,to_chars,0,0,hide);
        }
    }
}

function get_big_random_n() {
    return Math.floor(Math.random() * Math.pow(1024,5)) + Math.floor(Math.random() * Math.pow(1024,2)) + Math.floor(Math.random() * 100000);
}


function test(num,from_chars,to_chars,showtest,add_end_symbols,hide) {
    var convert = lib._int.convert;
    var num1 = num;
    var num2 = convert(num1,from_chars,to_chars);
    var num3 = convert(num2,to_chars,from_chars);
    
    
    var enc_info = from_chars.length + '->' + to_chars.length;
    var msg = num1+' -> '+num2;
    
    if(!tests_info[enc_info]) tests_info[enc_info] = {pass:0,fail:0};
    if (num1 == num3) {
        if (showtest ) msg += ' ->ok: '+num3;
        msg = enc_info+' [pass] '+msg;
        tests_info.pass ++;
        tests_info[enc_info].pass++;
    }else{
        msg += ' ->fail: '+num3;
        msg = enc_info+' [fail] '+msg;
        tests_info.fail ++;
        tests_info[enc_info].fail++;
    }
    if(!hide) console.log(msg);
}


function show_tests_info() {
    clog('\n');
    var t = tests_info;
    var msg = 'tests count: '+(t.fail+t.pass);
    if (t.fail) {
        msg += ' / fail: '+t.fail;
    }else{
        msg += ' all ok';
    }
    
    var cnt = 0;
    if (t.fail){
         msg += '\n';
        for(var i in t){
            if (i=='pass' || i=='fail') continue;
            var e = tests_info[i];
            if (!e.fail) continue;
            msg += ' ('+i+': '+(e.fail+e.pass)+'/'+e.fail+')';
        }
    }
    clog(msg);
}