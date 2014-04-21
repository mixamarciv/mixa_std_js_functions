var fs = require('fs');
var path = require('path');

exports.mkdir_path = mkdir_path;
exports.path_norm  = path_norm;
exports.path_join  = path_join;

//рекурсивно создает или проверяет существование указанного пути
function mkdir_path(path_n,fn){
  fs.exists(path_n,function(exists){
      //console.log("check_path["+exists+"]: "+path_n);
      if(!exists){
	  fs.mkdir(path_n, function(err){
	      if(err){
		if(err.code=="ENOENT"){
		    mkdir_path(path.dirname(path_n),function(){
			mkdir_path(path_n,fn);
		    });
		}else{
		    !err.debug ? err.debug = []: null; 
		    err.debug.push("check_path(\""+path_n+"\",fn)");
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

function path_norm(arg) {
    //path.sep = '/'; - установка этого параметра ничего не меняет (кроме самого параметра)
    //console.log("path.sep = "+path.sep);
    return path.normalize( arg ).replace(/\\/g,'/');
}

function path_join(arg1,arg2) {
    return path_norm( path.join( arg1,arg2 ) );
}

