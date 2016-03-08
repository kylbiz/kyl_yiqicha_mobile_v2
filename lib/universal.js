log = function(info) {
  console.log('--------------------');
  for(var i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
}


verifyKeywords = function(keywords) {
  if (!typeof (keywords) === "string" || keywords.length < 2) {
    return false;
  } else {
    return true;
  }
};


var companyTypeLists = ["有限公司", "有限责任公司", "股份有限公司", "普通合伙", "有限合伙"];

var _verifyNamePart = function(checkname, typeArray) {
  log("_verifyNamePart: Hi I am called.", "checkname: " + checkname)
  if(typeof(checkname) !== "string" 
    || !(typeArray instanceof Array)) {
    return false;
  } else {
    var checkflag = false;
    for(var i = 0; i < typeArray.length; i++) {
      if(checkname.indexOf(typeArray[i]) !== -1) {
        checkflag = true;
        break;
      }
    }
    return checkflag;
  }
}

//----------------------------------------------------
/**
 * 判断公司名称
 * @param  {string} checkname 公司名称
 * @return {Boolean} 如果公司名称合法，则返回true,否则false
 */
verifyCheckName = function(checkname) {
  log("verifyCheckName: Hi I am called.", "checkname: " + checkname);
  var checkstatus = true;

  if(!checkname
    || typeof(checkname) !== "string"
    || checkname.length < 6
    || !_verifyNamePart(checkname, companyTypeLists)){
    checkstatus = false;
  }
  return checkstatus;
}