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

verifyPhone = function(phone) {
  var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
  if(!phoneReg.test(phone)) {
    return false;
  } else {
    return true;
  }
} 
//----------------------------------------------------
// 发送手机信息
var crypto =  Meteor.npmRequire('crypto');
var accountSid= '8a48b5514a9e4570014a9f056aa300ec'; //Account Sid
var accountToken = '0fe4efa3c2c54a0eb91dbac340aa49cf'; //Account Token
var appId = '8a48b5514a9e4570014a9f1ac45b0115'



//----------------------------------------------------
var Crawler = Meteor.npmRequire('mycrawl').Crawler;
var crawler = new Crawler();

var baseUrl = "http://www.sgs.gov.cn/lz/etpsInfo.do";
var creditOptions =  {
    homeRefererUrl: baseUrl + '?method=index', 
    registrationResultsUrl: baseUrl + '?method=doSearch',
    registrationDetailUrl: baseUrl + '?method=viewDetail' 
  }

var nameStatusOptions = {
  targetUrl: 'http://www.sgs.gov.cn/shaic/workonline/appStat!toNameAppList.action'
};

//----------------------------------------------------

var Fiber = Npm.require('fibers');
var maxSearchTimes = 80;
var maxValidDate = 10;

CheckUtil = {};

var companyTypeLists = ["有限公司", "有限责任公司", "股份有限公司"];

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

    var checkname = options.checkname || "";
    var userId = options.userId || "";
    self.checkCreditName(checkname, function(err, result) {
      if(err) {
        log("InitCreditName: get credit information error.", err);
        callback(err, null);
      } else {
        var allpageNo = result.allpageNo || 0;
        if(allpageNo !== 0) {
          log("InitCreditName: checkname: " + checkname + " exits credit information");

          checkPoint = 0;
          checkStatus = 3;


          Fiber(function() {
            CheckName.update({
              checkname: checkname,
              userId: userId
            }, {
              $set: {
                nameStatus: "已经存该名称的公司",
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

          // 发送消息核名
          var message = {
            from: "系统消息",
            toUserId: userId,
            title: checkname,
            subtitle: checkname,
            summary: "已经存该名称的公司",
            type: "system",
            detail: "已经存该名称的公司"
          }

          self.sysMsg(message);


        } else {

          // 不存在公司，查询核名信息
          crawler.searchCompanyNameStatus(nameStatusOptions, checkname, function(err, statusInfo) {
            if(err) {
              log("InitCreditName: get statusInfo abount " + checkname  + " error.", err);
              callback(err, null);
            } else {
              var statuscode = statusInfo.statuscode || 0;
              var nameStatus = "目前没有核名信息";
              log(statusInfo)

              if(statuscode === 0) {
                nameStatus = "目前没有核名信息";
                checkPoint = 0;
                checkStatus = 0;
              } else if(statuscode === 1) {
                nameStatus = statusInfo.companynameInfo[0].applayStatus || "目前没有核名信息";
              } else if(statuscode === 2) {
                nameStatus = statusInfo.companynameInfo[0].applayStatus || "目前多余一条核名信息";
              }

              var searchFinished = false;
              if(nameStatus === "核准，可取") {
                searchFinished = true;
                checkPoint = 2;
                checkStatus = 1;
              } else if(nameStatus === "审查中") {
                checkPoint = 1;

                var acceptedDate = new Date(statusInfo.companynameInfo[0].acceptedDate);
                //TODO

                var validateDate = moment().subtract(maxValidDate, 'days');
                if(acceptedDate < validateDate) {
                  checkStatus = 1;
                  searchFinished = true;
                } else {
                  checkStatus = 0;
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

              self.sysMsg(message);

            }
          });
        }
      }
    })

  }
}


//----------------------------------------------------

CheckUtil.maintainName = function() {
  log("maintainName: maintain checkname starts.");

  var date = moment(new Date());
  var latestValidTime = date.subtract(0.5, "hours").toDate()
  var beginValidTime = date.add(12, "days").toDate();

  var checkOptions = {
    removed: false,
    searchFinished: false,
    searchedTimes: {
      "$lt": maxSearchTimes
    },
    latestSearchTime: {
      "$lte": latestValidTime
    },
    beginSearchTime: {
      "$lte": beginValidTime
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

          var statuscode = statusInfo.statuscode || 0;
          var newNameStatus = "";

          // var searchFinished = false;
          // if(nameStatus === "核准，可取") {
          //   searchFinished = true;
          //   checkPoint = 2;
          //   checkStatus = 1;
          // } else if(nameStatus === "审查中") {
          //   checkPoint = 1;

          //   var acceptedDate = new Date(statusInfo.companynameInfo[0].acceptedDate);
          //   //TODO

          //   var validateDate = moment().subtract(maxValidDate, 'days');
          //   if(acceptedDate < validateDate) {
          //     checkStatus = 1;
          //     searchFinished = true;
          //   } else {
          //     checkStatus = 0;
          //   }
          // }



         if(statuscode >= 1) {
            newNameStatus = statusInfo.companynameInfo[0].applayStatus;
          }

          if(newNameStatus === "") {
            newNameStatus = nameStatus;        
          }

          if(newNameStatus === "审查中") {
            checkPoint = 1;
            var acceptedDate = new Date(statusInfo.companynameInfo[0].acceptedDate);
            var validateDate = moment().subtract(maxValidDate, 'days');
            if(acceptedDate < validateDate) {
              checkStatus = 1;
              searchFinished = true;
            } else {
              checkStatus = 0;
            }
          }

          var searchFinished = false;
          if(newNameStatus === "核准，可取" || newNameStatus === "已经存该名称的公司") {
            searchFinished = true;
            sendMsgFlag = true;
            checkPoint = 2;
            checkStatus = 1;
          }



          if(!messageNotify) {
            sendMsgFlag = false;
          }

          if(searchedTimes >= maxSearchTimes) {
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
                nameStatus: newNameStatus,
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

          if(newNameStatus !== nameStatus) {
            // 发送消息核名
            if(statuscode === 1) {
              var message = {
                from: "系统消息",
                toUserId: userId,
                title: checkname,
                subtitle: checkname,
                type: "system",
                summary: nameStatus,
                detail: nameStatus
              }

              self.sysMsg(message);
            }
          }

          if(searchedTimes === maxSearchTimes -1) {
              var message = {
                from: "系统消息",
                toUserId: userId,
                title: checkname,
                subtitle: checkname,
                type: "system",
                summary: "查询结束，没有新的消息了",
                detail: "查询结束，没有新的消息了"
              }

              self.sysMsg(message);             
          }

          // 发送手机短信
          if(sendMsgFlag) {
            var msgOptions = {
              nameStatus: newNameStatus,
              toUserId: userId,
              checkname: checkname
            }
            self.mobileMsg(options);
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

        var randomCode = randomWord(true, 4, 4);
        var timestamp = moment().format('YYYYMMDDHHmmss'); //时间戳
        var auth = accountSid + ':' + timestamp;
        var a = new Buffer(auth).toString('base64');
        var content = accountSid + accountToken + timestamp;
        var md5 = crypto.createHash('md5');
        md5.update(content);
        var sig = md5.digest('hex').toUpperCase();

        HTTP.call("POST", "https://sandboxapp.cloopen.com:8883/2013-12-26/Accounts/"+accountSid+"/SMS/TemplateSMS?sig="+sig,{"data":{"to":phone,"appId":""+appId+"","templateId":"11559","datas":[randomCode,"3"]},"headers":{"Accept":"application/json","content-type":"application/json;charset=UTF-8","Authorization":a}},
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

