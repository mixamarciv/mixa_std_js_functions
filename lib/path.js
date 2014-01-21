var fs = require('fs');
var path = require('path');

exports.mkdir_path = mkdir_path;

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

