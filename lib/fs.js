'use strict'

var path = require('path');
var fs = require('fs');


module.exports.mkdir_path 	= mkdir_path;
module.exports.check_directory 	= check_directory;
module.exports.exists 		= exists;

//для создания генератора для fs.exists
function exists(file,fn){
    fs.exists(file,function(ex){
        fn(null,ex);
    });
};


//проверяет существует ли заданный каталог, если нет то создает его
function check_directory(path,fn) {
    fs.exists( path, function (exists) {
        if (!exists) {
            mkdir_path( path, function (err) {
                if (err) {
                    var msg = "can't create path:\n  "+path;
                    console.log(msg);
                    return fn(new Error(msg));
                }
                return fn(null,0);
            });
        }else{
            fs.stat( path, function (err,stat) {
                if (err) return fn(err);
                if (!stat.isDirectory()) {
                    var msg = "path is not directory!:\n  "+path;
                    console.log(msg);
                    return fn(new Error(msg));
                }
                return fn(null,1);
            });
        }
    });
}

//создает нужный каталог и в случае надобности создает родительские каталоги
function mkdir_path(path_n,fn){
  fs.exists(path_n,function(exists){
      if(!exists){
	  fs.mkdir(path_n, function(err){
	      if(err){
		if(err.code=="ENOENT"){
		    var parent_dir = path.dirname(path_n);
		    if (parent_dir == path_n) return fn(err);
		    mkdir_path(parent_dir,function(){
			mkdir_path(path_n,fn);
		    });
		}else{
		    return fn(err);
		}
	      }else{
		fn();
	      }
	  });
      }else{
	  fn();
      }
  });
}
