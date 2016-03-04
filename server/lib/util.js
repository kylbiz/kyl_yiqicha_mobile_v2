log = function(info) {
  console.log("--------------------------");
  console.log("Time: " + new Date())
  for(var i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
}

logError = function(info) {
  console.error("--------------------------");
  console.error("Time: " + new Date());
  for(var i = 0; i < arguments.length; i++) {
    console.error(arguments[i]);
  }
}


//----------------------------------------------------

verifyPhone = function(phone) {
  var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
  if(!phoneReg.test(phone)) {
    return false;
  } else {
    return true;
  }
} 

//----------------------------------------------------

CheckUtil = {};

var checknameZone = "上海";
var companyTypeLists = ["有限公司", "有限责任公司"];
var industryTypeLists = ["信息科技","生物科技","电子科技","生物科技","网络科技","智能科技","印务科技","医疗科技","环保科技","化工科技","新材料科技","教育科技","文化传播","广告","文化传媒","文化发展","图文设计制作","广告设计","广告制作","广告设计制作","广告传媒","装饰设计","建筑设计","图文设计","景观设计","建筑工程设计","艺术设计","创意设计","空间设计","建筑装潢设计","商务咨询","企业管理咨询","投资咨询","信息咨询","财务咨询","投资管理咨询","健康管理咨询","建筑工程咨询","旅游信息咨询","法律咨询","投资管理","餐饮管理","企业管理","资产管理","物业管理","酒店管理","供应链管理","体育发展","商业管理","汽车服务","金融信息服务","保洁服务","展览展示服务","会展服务","汽车租赁服务","投资管理服务","装饰工程","建筑工程","装饰设计工程","绿化工程","园林工程","建筑安装工程","防水工程","景观工程","石材装饰工程","机电工程","货运代理","货物运输代理","国际货运代理","知识产权代理","商贸","电子商务"]


CheckUtil.prototype._verifyNamePart = function(checkname, typeArray) {
  if(typeof(checkname) !== "string" 
    || typeArray instanceof Array) {
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
CheckUtil.prototype.verifyCheckName = function(checkname) {
  log("verifyCheckName: Hi I am called.");
  var self = this;
  var checkstatus = true;

  if(!checkname
    || typeof(checkname) !== "string"
    || checkname.indexOf(checknameZone) === -1
    || checkname.length < 8
    || !self._verifyNamePart(checkname, companyTypeLists)
    || !self._verifyNamePart(checkname, industryTypeLists)) {
    checkstatus = false;
  }
  return checkstatus;
}

//----------------------------------------------------
// TODO: get check information
CheckUtil.prototype.getCheckInfo = function(checkname, callback) {

}
