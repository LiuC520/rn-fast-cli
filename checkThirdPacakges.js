/*
 * @PageName: 检查是否命令行是否包含一些选装包
 * @Description: 
 *  1、包名
 *  2、三方库的自定义配置
 * 
 * @Author: 刘成
 * @Date: 2019-12-05 17:06:15
 * @LastEditTime: 2019-12-11 15:09:04
 * @LastEditors: 刘成
 */

var readlineSync = require('readline-sync');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');


function checkHasThridPackages(options){
  const newOptions = options
  //是否有android包名
  if(!newOptions.android){
     var androidName = readlineSync.question('请输入android包名，默认：' + chalk.red('com.' + newOptions._[1]) + '，默认请按下回车，输入完请按下回车\n');
    if(androidName){
      newOptions.android = androidName
    }
  }
  //ios包名
  if(!newOptions.ios){
     var iosName = readlineSync.question('请输入ios包名 bundle id，默认：' + chalk.red('org.reactjs.native.example.' + newOptions._[1]) + '，默认请按下回车，输入完请按下回车\n');
    if(iosName){
      newOptions.ios = iosName
    }
  }
  //是否有三方库
  var pacakgePath
  if(!newOptions.pacakgesconfig){
     pacakgePath = readlineSync.question('是否导入三方库的配置文件，文件名为'+chalk.red('packages.config.js')+'，配置文件的格式如下：'+chalk.green('\nmodule.exports = {\n //安装包\n packages:[\n  { name: "mobx", version:"4.2.1" },\n ],\n //dev安装包\n devpackages:[\n  { name: "tslint" },\n ]\n}') + '\n请输入配置文件的全路径：\n');
  }else{
    pacakgePath = newOptions.pacakgesconfig
  }
  packagePathRight(pacakgePath,newOptions)
  
  return newOptions
}
//合并各packages，并用 | 分割开
function joinPackages(packages){
  var s=""
  for(var i=0; i<packages.length; i++){
    if(packages[i].name){
      s+=packages[i].name
      if(packages[i].version){
        s+=("@"+packages[i].version)
      }
      //添加分隔符
      if(i!==packages.length-1){
        s+="|"
      }
    }
  }
  return s
}
//给命令行的配置添加安装包
function setPackagesToOptions(pacakgePath,newOptions){
  const packagesConfig = require(pacakgePath)
  //安装包
  var packages = packagesConfig.packages
  var devpackages = packagesConfig.devpackages
  if(packages){
    var ps = joinPackages(packages)
    if(ps){
      newOptions.packages = ps
    }
  }
  //dev安装包
  if(devpackages){
    var devps = joinPackages(devpackages)
    if(devps){
      newOptions.devpackages = devps
    }
  }
  // npm代理
  if(packagesConfig.registry){
    newOptions.registry= packagesConfig.registry
  }
}
//判断npm安装包的路径是否存在
function packagePathRight(pacakgePath,newOptions) {
   if( pacakgePath ){
      if(pacakgePath.endsWith('packages.config.js')){
         var configPath = pacakgePath;
        if(pacakgePath.length = 18){ 
          configPath = path.resolve(pacakgePath);
        }
        if(fs.existsSync(configPath)) {
          setPackagesToOptions(configPath,newOptions)
        }else{
          var newPacakgePath = readlineSync.question(chalk.red(pacakgePath)+' 文件不存在，请重新输入:\n');
          packagePathRight(newPacakgePath)
        }
      }else{
        var newPacakgePath = readlineSync.question(chalk.red(pacakgePath)+' 路径不正确，请重新输入:\n');
        packagePathRight(newPacakgePath)
      }
    }
}
var _default = checkHasThridPackages;
exports.default = _default;