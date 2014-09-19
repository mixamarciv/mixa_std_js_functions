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
exports.copy_file  = copy_file;
exports.copy_path  = copy_path;
exports.rmdir      = rm;
exports.rm         = rm;

//рекурсивно создает или проверяет существование указанного пути
function mkdir_path(path_n,fn){
  if (!fn) fn = function(){};
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

//http://stackoverflow.com/questions/11293857/fastest-way-to-copy-file-in-node-js
function copy_file(src_file,dst_file,overwrite,fn) {
  if (overwrite==0) {
      fs.exists(dst_file,function(exists){
	  if (exists) return fn(null,0);
	  copy_file(src_file,dst_file,1,fn);
      });
      return;
  }
  var isCalled = false;

  var rd = fs.createReadStream(src_file);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(dst_file);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!isCalled) {
      fn(err,1);
      isCalled = true;
    }
  }
}

//http://stackoverflow.com/questions/11293857/fastest-way-to-copy-file-in-node-js
function copy_file_sync(src_file,dst_file,overwrite,fn) {
  if (overwrite==0 && fs.existsSync(dst_file)) return 0;

  var BUF_LENGTH = 64*1024;
  var buff = new Buffer(BUF_LENGTH);
  var fdr = fs.openSync(src_file, 'r')
  var fdw = fs.openSync(dst_file, 'w')
  var bytesRead = 1;
  var pos = 0
  while (bytesRead > 0){
    bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
    fs.writeSync(fdw,buff,0,bytesRead);
    pos += bytesRead;
  }
  fs.closeSync(fdr);
  fs.closeSync(fdw);
  return 1;
}

function copy_path(src,dst,opt,fn){
  if (!fn) fn = function(){};
  if (!opt) opt = {};
  if (!opt.filter) opt.filter = function(){return true;};
  if (typeof opt.clobber == "undefined") opt.clobber = true;  //if set to false, copy will not overwrite destination files that already exist.
  
  fs.exists(src,function(exists){
      if(!exists) return fn('ERROR: path "'+src+'" not exists!');
      mkdir_path(dst,function(err){
	  if (err) return fn(err);
	  fs.readdir(src, function(err,files){
	      if (err) return fn(err);
	      var c_files = [];
	      for(var i=0;i<files.length;i++){
		  var file = files[i];
		  //if (file == '.' || file == '..') continue;
		  var src_file = path_join(src,file);
		  if (opt.filter(src_file)){
		    c_files.push(file);
		  }
	      }
	      //console.log(c_files);
	      if (!opt.inf) opt.inf = {total_size:0,files_count:0,folder_count:0};
	      work_arr(src,dst,opt,c_files,0,function(err){
		  return fn(err,opt.inf);
	      });
	  });
      });
  });
  
  function work_arr(src,dst,opt,files,i,cb) {
      //console.log('work_arr '+i);
      if (i>=files.length) return cb();
      var file = files[i++];
      var src_file = path_join(src,file);
      var dst_file = path_join(dst,file);
      next(src_file,dst_file,opt,function(err){
	  if (err) return cb(err);
	  work_arr(src,dst,opt,files,i,cb);
      });
  }
  
  function next(src_file,dst_file,opt,cb) {
      fs.stat(src_file, function(err, stats){
	  if (err) return cb(err);
	  //console.log('next '+src_file+'  '+stats.isFile());
	  if (stats.isFile()) {
	    copy_file(src_file,dst_file,opt.clobber,function(err,was_copy){
		if(err) return cb(err);
		if (was_copy) {
		  opt.inf.files_count ++;
		  opt.inf.total_size += stats.size;
		}
		cb();
	    });
	  }else{
	    copy_path(src_file,dst_file,opt,function(err){
		if(err) return cb(err);
		opt.inf.folder_count ++;
		cb();
	    });
	  }
      });
  }
}

//rm - удаляет файл или каталог рекурсивно, возвращает количество удаленных файлов
var default_rm_opt = {filter:function(){return true;}};
function rm(dir,opt,fn) {
  if (!fn){
    if(typeof(opt)=='function'){
      fn = opt;
      opt = default_rm_opt;
    }else{
      fn = function(){};
    }
  }
  if (!opt) opt = default_rm_opt;
  //console.log('rm:'+dir);
  fs.stat(dir, function(err, stats){
      if (err) return fn(err,0);
      if (stats.isFile()){
	fs.unlink(dir,function(err){
	    if(err) return fn(err,0);
	    fn(null,1);
	});
	return;
      }
      fs.rmdir(dir, function(err){
	  if (err && err.code!='ENOTEMPTY') return fn(err,0);
	  fs.readdir(dir, function(err,files){
	      if (err) return fn(err);
	      var need_files = [];
	      var cnt_files = files.length;
	      for(var i=0;i<cnt_files;i++){
		    var file = files[i];
		    var need_file = path_join(dir,file);
		    if (opt.filter(need_file)){
		      need_files.push(need_file);
		    }
	      }
	      //----------------------------------------------------
	      //console.log('need_files:');
	      //console.log(need_files);
	      cnt_files = need_files.length;
	      var cnt_ok = 0;
	      var is_end = 0;
	      var cnt_del = 0;
	      for(var i=0;i<cnt_files;i++){
		  var rem_file = need_files[i];
		  rm(rem_file,opt,function(err,cnt_del_files){
		      if(err){
			  if (!is_end) {
			      is_end = 1;
			      return fn(err,0);
			  }
			  return;
		      }
		      cnt_del += cnt_del_files;
		      cnt_ok++;
		      if (cnt_ok>=cnt_files && !is_end) {
			  is_end = 1;
			  return fn(null,cnt_del);
		      }
		  });
	      }
	      //----------------------------------------------------
	  });//fs.readdir
      });//fs.rmdir
  });//fs.stat
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
