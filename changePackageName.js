/*
 * @PageName: modufy android packagename and ios bundlename
 * @Description: 
 * @Author: 刘成
 * @mail: 674668211@qq.com
 * @Date: 2019-10-14 10:44:36
 * @LastEditTime: 2019-12-09 20:49:04
 * @LastEditors: 刘成
 */
var fs = require('fs');

 const util = require('./util').default
 function changePackageName(projectDir,projectName, options){
    console.log('start change android package name'.green)
  //  return
    changeAndroidName(projectDir, projectName,options)
    console.log('end change android package name'.green)
    console.log('start change ios bundle name'.green)
    changeIosBundleName(projectDir, projectName,options)
    console.log('end change ios bundle name'.green)

 }

// change android package name
// 1. touch packageDir in projectDir/android/app/src/main/java/com/
// 2、
 function changeAndroidName(projectDir, projectName,options){
    if(!options.android){
      return
    }
   var androidPackageNameDot = options.android
   var androidPackageNameLine = androidPackageNameDot.replace(/\./g,'/')
   try{
     //先把com文件夹文件拷贝到根目录下面去tmp，然后删除com文件夹
     //再把文件拷贝到指定包名文件夹下
     //然后把android的文件加复制android1的文件夹中
     //然后把android文件删除，再把android1命名为android
     
    util.copyProjectTemplateAndReplace(projectDir+'/android/app/src/main/java/com/'+ projectName.toLowerCase(), projectDir+'/tmp')
    util.deleteDir(projectDir+'/android/app/src/main/java/com/' + projectName.toLowerCase())

    // create dirs com.android.lc 
    var n = projectDir+'/android/app/src/main/java'
    androidPackageNameDot.split('.').forEach(d=>{
      n = n+ "/" + d
      if(!util.checkFileOrDirExits(n)){
        fs.mkdirSync(n)
      }
      process.chdir(n)
    })
    process.chdir(projectDir)

    util.copyProjectTemplateAndReplace(projectDir+'/tmp',projectDir+'/android/app/src/main/java/'+androidPackageNameLine)

    var oldPacakgeName = `com.${projectName.toLowerCase()}`
    var replacements = {}
    replacements[oldPacakgeName] = androidPackageNameDot

    util.copyProjectTemplateAndReplace(projectDir+'/android/', projectDir+'/android1/', replacements )

    util.deleteDir(projectDir+'/tmp')
    util.deleteDir(projectDir+'/android')
    fs.renameSync(projectDir+'/android1',projectDir+'/android')
   }catch(e){
     console.log(e)
   }
 }

 // change ios bundle name
 function changeIosBundleName(projectDir, projectName,options){
    if(!options.ios){
      return
    }
    var oldPacakgeName = 'org.reactjs.native.example.'
    var replacements = {}
    replacements[oldPacakgeName] = options.ios + '.'
    util.copyProjectTemplateAndReplace(projectDir+'/ios', projectDir+'/ios1', replacements )
    util.deleteDir(projectDir+'/ios')
    fs.renameSync(projectDir+'/ios1',projectDir+'/ios')
 }



var _default = changePackageName;
exports.default = _default;