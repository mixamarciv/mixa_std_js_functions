var fs = require('fs');
var path = require('path');

exports.mkdir      = mkdir_path;
exports.mkdir_path = mkdir_path;
exports.norm       = path_norm;
exports.path_norm  = path_norm;
exports.join       = path_join;
exports.path_join  = path_join;
exports.is_parent  = is_parent_path;
exports.is_parent_path = is_parent_path;

//рекурсивно создает или проверяет существование указанного пути
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

function path_norm(arg) {
    //path.sep = '/'; - установка этого параметра ничего не меняет (кроме самого параметра)
    //console.log("path.sep = "+path.sep);
    return path.normalize( arg ).replace(/\\/g,'/');
}

function path_join(arg1,arg2) {
    return path_norm( path.join( arg1,arg2 ) );
}


function is_parent_path(child_path,parent_path) {
    parent_path = parent_path.toLowerCase().replace(/\\/g,'/').replace(/\/$/g,'');
    child_path = child_path.toLowerCase().replace(/\\/g,'/').replace(/\/$/g,'');
    
    if ( parent_path == child_path ) return 1;
    
    function r_is_parent_path(child_path,parent_path) {
        child_path = path.dirname(child_path);
        if ( parent_path == child_path ) return 1;
        if ( parent_path.length >= child_path.length ) return 0;
        return r_is_parent_path(child_path,parent_path);
    }
    
    return r_is_parent_path(child_path,parent_path);
}
