var bytenode = require('bytenode');
var fs = require('fs');
var path = require("path");
const generateDirName = 'bytenode-run';// 生成可执行文件的目录

/**
 * 
 * @param {*} originDir 需要编译的目录，默认是nestjs项目根目录下的dist目录
 * @param * 
 */
const compileMain = function(rootDir = null, originDir = './dist', {nodeModulesPack = true}){
  let absoluteOriginDir = path.join(rootDir, originDir);
  if(!rootDir){
    throw new Error(`rootDir must be a string`);
  }
  let generateDir = path.join(rootDir, generateDirName);console.log(generateDir)
  const exist = fs.existsSync(generateDir)
  if (exist) {
    delDir(generateDir);
  }
  fs.mkdirSync(generateDir);
  compileDir(absoluteOriginDir);
  const options = arguments.pop()
  if(options.nodeModulesPack){
    nodeModulesCopy(rootDir);
  }
}

function compileDir(dir) {
  var stat = fs.statSync(dir);
  if (stat.isFile() ) {
    if(path.extname(dir) == '.js'){
      // 文件，直接转换
      const output = path.join(path.dirname(dir.replace('dist', generateDirName)), path.basename(dir) + 'c')
      console.log("*-*-*-*-*-*-*-*", output)
      bytenode.compileFile({
          filename: dir,
          output,
      });
      // fs.unlinkSync(dir);
    }else if(path.extname(dir) == '.map' || path.extname(dir) == '.ts'){
      // fs.unlinkSync(dir);
    }
  } else if (stat.isDirectory()) {
    // 目录，列出文件列表，循环处理
    var files = fs.readdirSync(dir);
    for (var i = 0; i < files.length; i++) {
      var file = dir + '/' + files[i];
      compileDir(file);
    }
  }
}

// 转移打包node_modules
function nodeModulesCopy(rootDir){
  const nodule_modules_path = path.join(rootDir, 'node_modules');
  const dest_nodule_modules_path = path.join(rootDir, generateDirName,'node_modules');
  copyDir(nodule_modules_path, dest_nodule_modules_path);
}
 
//递归创建目录 同步方法  
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      console.log("mkdirsSync = " + dirname);
      fs.mkdirSync(dirname);
      return true;
    }
  }
}
 
function _copy(src, dist) {
  var paths = fs.readdirSync(src)
  paths.forEach(function (p) {
    var _src = src + '/' + p;
    var _dist = dist + '/' + p;
    var stat = fs.statSync(_src)
    if (stat.isFile()) {// 判断是文件还是目录
      fs.writeFileSync(_dist, fs.readFileSync(_src));
    } else if (stat.isDirectory()) {
      copyDir(_src, _dist)// 当是目录是，递归复制
    }
  })
}
 
/*
 * 复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 */
function copyDir(src, dist) {
  var b = fs.existsSync(dist)
  // console.log("dist = " + dist)
  if (!b) {
    // console.log("mk dist = ", dist)
    mkdirsSync(dist);//创建目录
  }
  console.log("_copy start")
  _copy(src, dist);
}
 
function createDocs(src, dist, callback) {
  console.log("createDocs...")
  copyDir(src, dist);
  console.log("copyDir finish exec callback")
  if (callback) {
    callback();
  }
}
 
function delDir(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);
  }
}

global.bytenode_generate = {
  compileMain,
}
module.exports = global.bytenode_generate;