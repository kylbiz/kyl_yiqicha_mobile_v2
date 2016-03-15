
// 发送手机信息
var crypto =  Meteor.npmRequire('crypto');
var accountSid= '8a48b5514a9e4570014a9f056aa300ec'; //Account Sid
var accountToken = '0fe4efa3c2c54a0eb91dbac340aa49cf'; //Account Token
var appId = '8a48b5514a9e4570014a9f1ac45b0115'

//----------------------------------------------------
// 一企查
var Crawler = Meteor.npmRequire('mycrawl').Crawler;
var crawler = new Crawler();

// 核名验证公司名称时，公司名称中的某些关键字
var companyTypeLists = ["有限公司", "有限责任公司", "股份有限公司"];

var baseUrl = "http://www.sgs.gov.cn/lz/etpsInfo.do";
// 企业信息查询参数
var creditOptions =  {
    homeRefererUrl: baseUrl + '?method=index', 
    registrationResultsUrl: baseUrl + '?method=doSearch',
    registrationDetailUrl: baseUrl + '?method=viewDetail' 
  }
// 核名状态查询参数
var nameStatusOptions = {
  targetUrl: 'http://www.sgs.gov.cn/shaic/workonline/appStat!toNameAppList.action'
};

//----------------------------------------------------
var Fiber = Npm.require('fibers');
var maxSearchTimes = 80; // 核名最大查询次数
var maxValidDate = 10; // 核名最长合法时间
var checkHoursPeriod = 4; // 系统轮询核名时间周期

//----------------------------------------------------
// 打印函数
log = function(info) {
  console.log("--------------------------");
  console.log("Time: " + new Date())
  for(var i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
}
// 错误打印函数
logError = function(info) {
  console.error("--------------------------");
  console.error("Time: " + new Date());
  for(var i = 0; i < arguments.length; i++) {
    console.error(arguments[i]);
  }
}

//----------------------------------------------------
/**
 * randomWord, generate randomword
 * Refered: http://www.xuanfengge.com/js-random.html
 */
 
 randomWord = function(randomFlag, min, max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
 
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}

//----------------------------------------------------
/**
 * 验证手机号码是否合法
 * @param  {string} phone 手机号码
 * @return {Boolean}       合法为true
 */
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

/**
 * 验证公司名称中是否存在某些关键字
 * @param  {string} checkname 提供的公司名称
 * @param  {Array} typeArray 公司名称中的某些关键字
 * @return {Boolean}  true 如果验证正确
 */
CheckUtil._verifyNamePart = function(checkname, typeArray) {
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
CheckUtil.verifyCheckName = function(checkname) {
  log("verifyCheckName: Hi I am called.", "checkname: " + checkname);
  var self = this;
  var statusflag = true;

  if(!checkname
    || typeof(checkname) !== "string"
    || checkname.length < 6
    || !self._verifyNamePart(checkname, companyTypeLists)){
    statusflag = false;
  }
  return statusflag;
}

//----------------------------------------------------
/**
 * 验证核名公司名称
 * @param  {string}   checkname 核名公司名称
 * @param  {Function} callback  返回核名结果是否出错
 */
CheckUtil.checkCreditName = function(checkname, callback) {
  log("checkCreditName: Hi I am called.")
  if(!(typeof(checkname) === "string")
    || !CheckUtil.verifyCheckName(checkname)) {
    log("checkCreditName: options illegal.", 'checkname: ' + checkname);
  callback("checkname: " + checkname + " not an legal company name.", null);
  } else {
    crawler.searchCompanyInformation(creditOptions, checkname, function(err, results) {
      if(err) {
        logError("checkCreditName: search checkname: " + checkname  + " error.", err);
        callback(err, null);
      } else {
        log("checkCreditName: search checkname: " + checkname  + " succeed.")
        log(checkname, results)
        var allpageNo = results.allpageNo || 0;

        callback(null, {allpageNo: allpageNo})
      }
    });
  }
}

//----------------------------------------------------
/**
 * 初始化核名信息，保存核名最初查询状态，并提醒用户核名状态信息
 * 其中CheckName为核名结果数据库Collection,包含下面字段
 * checkname： 用户提交的公司名称
 * nameStatus: 当前核名状态信息
 * removed： 用户是否清除查询
 * messageNotify: 是否短信通知用户
 * searchedTimes: 当前查询该 checkname 的次数
 * checkPoint: 0提交——1审核——2领证
 * checkStatus: 0当前为不确定--1成功--2失败--3提交时已存在名字的情况
 * beginSearchTime: 初始一次查询时间节点
 * latestSearchTime: 最后一次查询时间节点
 * searchFinished: 是否查询结束
 * 
 * @param {json}   options 需要提供下面的参数
 */
CheckUtil.InitCreditName = function(options, callback) {
  log("InitCreditName: Hi I am called.")
  if(!options
    || !options.hasOwnProperty("checkname")
    || typeof(options.checkname) !== "string"
    || !CheckUtil.verifyCheckName(options.checkname)
    || !options.hasOwnProperty("userId")
    || options.userId !== Meteor.userId()) {
    log("InitCreditName: options illegal." + options);
  callback("InitCreditName: options illegal", null);
  } else {  
    var self = this;
    var checkPoint = 0;
    var checkStatus = 0;

    var msgStr = "";
    var nameStatus = "";
    var sendMsgFlag = false;

    var checkname = options.checkname || "";
    var userId = options.userId || "";

    var messageNotify = false;
    if(options.hasOwnProperty("messageNotify")) {
      messageNotify = options.messageNotify || false;
    }

    self.checkCreditName(checkname, function(err, result) {
      if(err) {
        log("InitCreditName: get credit information error.", err);
        callback(err, null);
      } else {
        var allpageNo = result.allpageNo || 0;
        // 已经存在同名公司
        if(allpageNo !== 0) {
          log("InitCreditName: checkname: " + checkname + " exits credit information");

          checkPoint = 0;
          checkStatus = 3;
          sendMsgFlag = true;
          msgStr = "已有同名公司";          
          nameStatus = "已有同名公司";

          Fiber(function() {
            CheckName.update({
              checkname: checkname,
              userId: userId
            }, {
              $set: {
                nameStatus: nameStatus,
                checkPoint: checkPoint, //提交审核阶段
                checkStatus: checkStatus, // 提交时已存在名字的情况
                latestSearchTime: new Date(),
                searchFinished: true
              },
              $inc: {
                searchedTimes: 1
              }
            }, function(err) {
              if(err) {
                log("InitCreditName: update checkname: " + checkname + "   status error.", err);
                callback(err, null);
              } else {
                log("InitCreditName: update checkname " + checkname + " succeed.");
                callback(null, {searchFinished: true})
              }
            })
          }).run();

          // 发送系统核名消息
          var message = {
            from: "系统消息",
            toUserId: userId,
            title: checkname,
            subtitle: checkname,
            summary: msgStr,
            type: "system",
            detail: "   "
          }

          self.sysMsg(message);

          // 发送短信
          if(sendMsgFlag) {
            var options = {
              userId: userId,
              msgStr: msgStr
            }
            self.mobileMsg(options);
          }
        } else {
          // 不存在公司，查询核名信息
          crawler.searchCompanyNameStatus(nameStatusOptions, checkname, function(err, statusInfo) {
            if(err) {
              log("InitCreditName: get statusInfo abount " + checkname  + " error.", err);
              callback(err, null);
            } else {
              var statuscode = statusInfo.statuscode || 0;
              var statusStr = "";

              if(statuscode === 0) {
                nameStatus = "正在提交工商总局";
                checkPoint = 0;
                checkStatus = 0;
              } else if(statuscode === 1) {
                statusStr = statusInfo.companynameInfo[0].applayStatus || "存在一条核名信息";
              } else if(statuscode === 2) {
                statusStr = statusInfo.companynameInfo[0].applayStatus || "目前多于一条核名信息";
              }

              var searchFinished = false;
              // 核名通过
              if(statusStr === "核准，可取") {
                searchFinished = true;
                checkPoint = 2;
                checkStatus = 1;

                sendMsgFlag = true;
                nameStatus = "成功通过工商总局审核";
                msgStr = "成功通过工商总局审核";

              } else if(statusStr === "审查中") { //核名审核中
                checkPoint = 1;
                sendMsgFlag = true;

                var acceptedDate = new Date(statusInfo.companynameInfo[0].acceptedDate);
                var validateDate = moment().subtract(maxValidDate, 'days');
                // 核名审核过期
                if(acceptedDate < validateDate) {
                  checkStatus = 2;
                  searchFinished = true;
                  
                  nameStatus = "工商局审核时间已超过5天，有较大几率无法通过审核";
                  msgStr = "工商局审核时间已超过5天，有较大几率无法通过审核";
                } else {
                  checkStatus = 0;
                  nameStatus = "成功提交工商总局";
                  msgStr = "成功提交工商总局";
                }
              }

              // 更新核名信息
              Fiber(function() {
                CheckName.update({
                  checkname: checkname,
                  userId: userId
                }, {
                  $set: {
                    nameStatus: nameStatus,
                    checkPoint: checkPoint,
                    checkStatus: checkStatus,
                    latestSearchTime: new Date(),
                    searchFinished: searchFinished
                  },
                  $inc: {
                    searchedTimes: 1
                  }
                }, function(err) {
                  if(err) {
                    log("InitCreditName: get statusInfo about: " + checkname + " error.", err);
                    callback(err, null);
                  } else {
                    log("InitCreditName: get statusInfo about " + checkname + " succeed.");
                    callback(null, {searchFinished: searchFinished})
                  }
                })
              }).run();   

              // 发送消息核名
              var message = {
                from: "系统消息",
                toUserId: userId,
                title: checkname,
                subtitle: checkname,
                type: "system",
                summary: nameStatus,
                detail: nameStatus
              }
              Fiber(function() {
                self.sysMsg(message);
              }).run();

              // 发送短信
              if(sendMsgFlag && messageNotify) {
                var options = {
                  toUserId: userId,
                  nameStatus: msgStr,
                  checkname: checkname
                }
                Fiber(function() {
                  self.mobileMsg(options);
                }).run();
              }
            }
          });
        }
      }
    })

  }
}


//----------------------------------------------------
/**
 * 系统维护核名信息状态查询，并根据核名信息的变化，向用户发送核名状态信息
 */
CheckUtil.maintainName = function() {
  log("maintainName: maintain checkname starts.");

  var date = moment(new Date());
  var latestValidTime = date.subtract(checkHoursPeriod, "hours").toDate()
  var beginValidTime = date.subtract(maxValidDate, "days").toDate();
  var searchFinished = false;

  var checkOptions = {
    removed: false,
    searchFinished: false,
    searchedTimes: {
      "$lte": maxSearchTimes
    },
    latestSearchTime: {
      "$lte": latestValidTime
    },
    beginSearchTime: {
      "$gte": beginValidTime
    }
  }

  var nameLists = CheckName.find(checkOptions).fetch();

  var getNameCheck = setInterval(function() {
    var nameObj = nameLists.pop();

    if(!nameObj) {
      clearInterval(getNameCheck);
    } else {

      var checkname = nameObj.checkname;
      var userId = nameObj.userId;
      var nameStatus = nameObj.nameStatus;
      var searchedTimes = nameObj.searchedTimes || maxSearchTimes;
      var messageNotify = nameObj.messageNotify || false;
      var checkPoint = nameObj.checkPoint;
      var checkStatus = nameObj.checkStatus;

      // 不存在公司，查询核名信息
      crawler.searchCompanyNameStatus(nameStatusOptions, checkname, function(err, statusInfo) {
        if(err) {
          log("maintainName: get statusInfo abount " + checkname  + " error.", err);
        } else {
          var sendMsgFlag = false; // 是否发送短信
          var msgStr = "";
          var statuscode = statusInfo.statuscode || 0;
          var statusStr = "";

          if(statuscode >= 1) {
            statusStr = statusInfo.companynameInfo[0].applayStatus;
          }

          // 审核中的情况
          if(statusStr === "审查中") {
            checkPoint = 1;
            var acceptedDate = new Date(statusInfo.companynameInfo[0].acceptedDate);
            var validateDate = moment().subtract(maxValidDate, 'days');
            // 审核过期失败
            if(acceptedDate < validateDate) {
              checkStatus = 2;
              searchFinished = true;
              msgStr = "工商局审核时间已超过5天，有较大几率无法通过审核";
              nameStatus = "工商局审核时间已超过5天，有较大几率无法通过审核";
            } else {
              // 正在审核中的情况
              checkStatus = 0;
              if(nameStatus !== "成功提交至工商总局") {
                sendMsgFlag = true;
                msgStr = "成功提交至工商总局";
                nameStatus = "成功提交至工商总局";
              }
            }
          }
          // 提交失败
          if((nameStatus === "正在提交工商总局") && statusStr === "") {
            var acceptedDate = new Date(statusInfo.companynameInfo[0].acceptedDate);
            var validateDate = moment().subtract(maxValidDate, 'days');
            if(acceptedDate < validateDate) {
              checkStatus = 2;
              searchFinished = true;
              nameStatus = "提交工商总局失败";
              msgStr = "提交工商总局失败";
            }
          }
          // 审核成功
          if(statusStr === "核准，可取") {
            searchFinished = true;
            checkPoint = 2;
            checkStatus = 1;
            sendMsgFlag = true;
            nameStatus = "成功通过工商总局审核";
            msgStr = "成功通过工商总局审核";
          }

          // 查询次数大于系统默认最大查询次数，停止查询，查询失败
          if(searchedTimes >= maxSearchTimes -1) {
            searchFinished = true;
            checkStatus = 2;
          }

          // 更新核名信息
          Fiber(function() {
            CheckName.update({
              checkname: checkname,
              userId: userId
            }, {
              $set: {
                nameStatus: nameStatus,
                checkPoint: checkPoint,
                checkStatus: checkStatus,
                latestSearchTime: new Date(),
                searchFinished: searchFinished
              },
              $inc: {
                searchedTimes: 1
              }
            }, function(err) {
              if(err) {
                log("maintainName: get statusInfo abount: " + checkname + " error.", err);
              } else {
                log("maintainName: get statusInfo abount " + checkname + " succeed.");
             }
            })
          }).run();   

          // 给用户发送系统消息
          if(sendMsgFlag) {
            var statusMsg = {
              from: "系统消息",
              toUserId: userId,
              title: checkname,
              subtitle: checkname,
              type: "system",
              summary: nameStatus,
              detail: nameStatus
            }
            var notifyMsg = {
              from: "系统消息",
              toUserId: userId,
              title: checkname,
              subtitle: checkname,
              type: "system",
              summary: "查询结束，没有新的消息了",
              detail: "查询结束，没有新的消息了"
            }
            self.sysMsg(statusMsg);
            self.sysMsg(notifyMsg);
          }

          // 用户是否要求发送信息
          if(!messageNotify) {
            sendMsgFlag = false;
          }

          // 发送手机短信
          if(sendMsgFlag) {
            var msgOptions = {
              nameStatus: nameStatus,
              toUserId: userId,
              checkname: checkname
            }
            self.mobileMsg(msgOptions);
          }

        }
      });   

      if(nameLists.length === 0) {
        clearInterval(getNameCheck)
      }
      
    }
  }, 5* 1000); 
}

//----------------------------------------------------
/**
 * 给用户发送信息信息
 * @param  {json} options 系统发送系统消息结构
 */
CheckUtil.sysMsg = function(options) {
  log("sysMsg: Hi I am called.");

  if(!options
    || !options.hasOwnProperty("from")
    || !options.hasOwnProperty("toUserId")
    || !options.hasOwnProperty("title")
    || !options.hasOwnProperty("summary")
    || !options.hasOwnProperty("type")) {
    log("sysMsg: options illegal.", options);
  } else {
    var from = options.from || "系统消息"; 
    var title = options.title || "";
    var toUserId = options.toUserId || Meteor.userId();
    var summary = options.summary || "";
    var type = options.type || "system";

    var subtitle = "";
    var detail = "";
    var removed = false;
    var createTime = new Date();
    var toUserName = "";

    if(options.hasOwnProperty("detail")) {
      detail = options.detail || detail;
    }

    if(options.hasOwnProperty("subtitle")) {
      subtitle = options.subtitle || subtitle;
    }

    if(options.hasOwnProperty("removed")) {
      removed = options.removed || false;
    }

    if(options.hasOwnProperty("createTime")) {
      createTime = options.createTime || createTime;
    }

    if(options.hasOwnProperty("toUserName")) {
      toUserName = options.toUserName || userId;
    }

    var message = {
      from: from,
      toUserId: toUserId,
      toUserName: toUserId,
      title: title,
      subtitle: subtitle,
      summary: summary,
      type: type,
      detail: detail,
      removed: removed,
      createTime: createTime
    }

    Fiber(function() {
      Messages.insert(message, function(err) {
        if(err) {
          logError("sysMsg: send message to : " + toUserId  + " error.", err);
        } else {
          log("sysMsg: send message to : " + toUserId  + " succeed.")
        }
      })
    }).run();
  }
}

//----------------------------------------------------
/**
 * 发送用户短信信息
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
CheckUtil.mobileMsg = function(options) {
  log("mobileMsg: Hi I am called.");

  if(!options
    || !options.hasOwnProperty("toUserId")
    || !options.hasOwnProperty("checkname")
    || !options.hasOwnProperty("nameStatus")) {
    log("mobileMsg: options illegal.", options);
  } else {  
    var self = this;
    var toUserId = options.toUserId;
    var checkname = options.checkname || "";
    var nameStatus = options.nameStatus;

    if(self.verifyCheckName(checkname) 
      && toUserId) {
      var user = Meteor.users.findOne({_id: toUserId});

      if(user && user.hasOwnProperty("username")) {
        var phone = user.username;

        if(verifyPhone(phone)) {
          var timestamp = moment().format('YYYYMMDDHHmmss'); //时间戳
          var auth = accountSid + ':' + timestamp;
          var authBase64 = new Buffer(auth).toString('base64');
          var content = accountSid + accountToken + timestamp;
          var md5 = crypto.createHash('md5');
          md5.update(content);
          var sig = md5.digest('hex').toUpperCase();


          HTTP.call("POST", "https://sandboxapp.cloopen.com:8883/2013-12-26/Accounts/"+accountSid+"/SMS/TemplateSMS?sig="+sig,{"data":{"to":phone,"appId":""+appId+"","templateId":"71881","datas":[checkname,nameStatus]},"headers":{"Accept":"application/json","content-type":"application/json;charset=UTF-8","Authorization":authBase64}},
            function (err, result) {
              if(err) {
                log('send verification code error', err);            
              } else {
                log('send verification code succeed');
              }
            }); 
        }
      }
    }
  }
}