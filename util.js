
var fs = require('fs');
var path = require('path');
var copyAndReplace = require('./copyAndReplace').default


function checkFileOrDirExits(p){
  var filePath = path.resolve(p);
  if (fs.existsSync(filePath)) {
    return true
  }
  return false
}

function walk(current) {
  if(!checkFileOrDirExits(current)){
    fs.mkdirSync(current)
  }
  if (!fs.lstatSync(current).isDirectory()) {
    return [current];
  }

  const files = fs.readdirSync(current).map(child => walk(path.join(current, child)));

  return [].concat.apply([current], files);
}


function copyProjectTemplateAndReplace(srcPath, destPath, replacements={}, options = {}) {
  if (!srcPath) {
    throw new Error('Need a path to copy from');
  }
  if (!destPath) {
    throw new Error('Need a path to copy to');
  }


  walk(srcPath).forEach(absoluteSrcFilePath => {
    const relativeFilePath = path.relative(srcPath, absoluteSrcFilePath)
    copyAndReplace(absoluteSrcFilePath, path.resolve(destPath, relativeFilePath), replacements, null);
  });
}

function deleteDir(path){
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                deleteDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}

var utils={
  checkFileOrDirExits,
  copyProjectTemplateAndReplace,
  deleteDir
}

exports.default = utils;