var crypto =  Meteor.npmRequire('crypto');

//----------------------------------------------------

function userUnipue(phone, callback) {
 var user = Meteor.users.findOne({username: phone})
 if(user) {
  return false;
 } else {
  return true;
 }
}
//----------------------------------------------------

function codeVerification(phone, code, timestamp) {
  if(phone && code && timestamp) {
    var userCode = UserCode.findOne({phone: phone});
    if(userCode) {
      var createTime = userCode.createTime;
      var _code = userCode.code;
      var timeLegal = (timestamp - createTime) <= 180 * 1000 || false;
      if(code.toLowerCase() === _code.toLowerCase() && timeLegal) {
        log("codeVerification: verify code legal.")
        return true;
      } else {
        log("codeVerification: verify code illegal or out of time.")
        return false;
      }
    } else {
      log("codeVerification: no user code in db.")
      return false;
    }
  } else {
    log("codeVerification: options illegal")
    return false;
  }
}

//----------------------------------------------------

function verifyPhone(phone) {
  var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
  if(!phoneReg.test(phone)) {
    return false;
  } else {
    return true;
  }
} 


//----------------------------------------------------

function codeGenerateLegal(phone) {
  if(verifyPhone(phone)) {
    var userCode = UserCode.findOne({phone: phone});
    if(userCode) {
      var createTime = userCode.createTime;
      var timestamp = Date.now();
      var times = userCode.times;
      if(times <= 100 && timestamp - createTime >= 1 * 60 * 1000) {
        return true;
      } else {
        log('you have call verify code  more than 100 times , or less than 1 minutes')
        return false;
      }
    } else {
      return true;
    }
  } else {
    log('phone number illegal')
    return false;
  }
} 

//----------------------------------------------------

/**
 * randomWord, generate randomword
 * Refered: http://www.xuanfengge.com/js-random.html
 */
 
function randomWord(randomFlag, min, max){
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

//--------------------------------------------------

Meteor.methods({
  'genereateUserCode': function(phone) {
    var phoneLegal = verifyPhone(phone) || false;

    function userCodeGenerator( callback) {
      var codeValue = {};
      log('phoneLegal', phoneLegal, 'codeGenerateLegal', codeGenerateLegal(phone))
      var codeGenerateFlag = codeGenerateLegal(phone);
      if(phoneLegal && codeGenerateFlag) {
        var randomCode = randomWord(true, 4, 4);
        var timestamp = moment().format('YYYYMMDDHHmmss'); //时间戳
        var accountSid= '8a48b5514a9e4570014a9f056aa300ec'; //Account Sid
        var accountToken = '0fe4efa3c2c54a0eb91dbac340aa49cf'; //Account Token
        var appId = '8a48b5514a9e4570014a9f1ac45b0115'
        var auth = accountSid + ':' + timestamp;
        var a = new Buffer(auth).toString('base64');
        var content = accountSid + accountToken + timestamp;
        var md5 = crypto.createHash('md5');
        md5.update(content);
        var sig = md5.digest('hex').toUpperCase();

        UserCode.update({phone: phone}, {
          $set: {
            phone: phone,
            code: randomCode,
            createTime: Date.now(),
            codeType: 'codeVefify',
            used: false, // verify if the code been used
          },
          $inc: {times: 1}
        }, {
          upsert: true
        }, function(err) {
          if(err) {
            log('update verification code error');
          } else {
            log('update codeVerification code succeed.');
          }
        });

        HTTP.call("POST", "https://sandboxapp.cloopen.com:8883/2013-12-26/Accounts/"+accountSid+"/SMS/TemplateSMS?sig="+sig,{"data":{"to":phone,"appId":""+appId+"","templateId":"11559","datas":[randomCode,"3"]},"headers":{"Accept":"application/json","content-type":"application/json;charset=UTF-8","Authorization":a}},
          function (err, result) {
            if(err) {
              log('send verification code error', err);
              codeValue = {
                codestatus: 0,
                message: "发送验证码失败"
              }              
              callback(err, codeValue);
            } else {
              log('send verification code succeed');
              codeValue = {
                codestatus: 1,
                message: "验证码发送成功!"
              }
              callback(null, codeValue);
            }
          });
                
      } else  {
        if(!codeGenerateFlag) {
          var err = '提交太频繁,请一分钟后再试!'
        } else {
          var err = '手机号错误或者该用户已经是注册用户!';
        }

        log(err)

        var codeValue = {
          codestatus: 2,
          message: err
        }
        callback(null, codeValue);
      };
    }

    var UserCodeHandle = Async.wrap(userCodeGenerator);
    var response = UserCodeHandle();
    return response;
  }
  
});

//----------------------------------------------------
/** 
 * callback value like below
 * code 0, message: 'user create succeed'
 * code 1, message: 'user exist already'
 * code 2, message: 'internal error'
 * code 3, message: 'phone has signed in or verification code illegal'
 */

Meteor.methods({
  'UserRegistration': function(options) {
    function UserHandle(callback) {
      var phone = options['phone'];
      var password = options['password'];
      var code = options['code'];
      var timestamp = Date.now();
      var registrationValue = {};
      log(phone, code, timestamp, codeVerification(phone, code, timestamp))
      if(options && userUnipue(phone) && codeVerification(phone, code, timestamp)) {
        var user = Meteor.users.findOne({username: phone})
        if(user) {
           registrationValue = {
            code: 1, 
            message: '该用户已经存在'
          }
          log("UserRegistration: " + phone + 'user alerady exists')
          callback(null, registrationValue)
        } else {
          var userOptions = {
            username: phone,
            password: password,
            profile: {
              phone: phone
            }
          }

          var user = Accounts.createUser(userOptions);
          if(!user) {
            log("UserRegistration: " + 'user create error');
            registrationValue = {
              code: 2,
              message: '创建用户错误!'
            }
            callback(err, registrationValue);
          } else {
            Meteor.users.update({_id: user}, {
              $set: {
                roles: ['customer']
              }
            }, function(err) {
              if(err) {
                log("UserRegistration: " + 'add user roles about customer error', err);
              } else {
                log("UserRegistration: " + 'add user roles about customer succeed');   
              }
            })

            // 发送注册成功消息
            RegistrationNotify({userId: user, phone: phone}) 

            log("UserRegistration: " + 'user create succeed');
            registrationValue = {
              code: 0, 
              message: '用户创建成功!'
            }
            callback(null, registrationValue);
          }

          UserCode.update({phone: phone}, {
            $set: {
              used: true
            }
          }, {
            upsert: true
          }, function(err) {
            if(err) {
              log('update user code [used] error');
            } else {
              log('update user code [used] succeed');
            }
          })
      }

      } else {
        
        if(!userUnipue(phone)) {
          registrationValue = {
            code: 3,
            message:  "手机重复注册!" 
          }       
        } else {
          registrationValue = {
            code: 3,
            message:  "注册码验证不合法,请确认!" 
          }
        }
       
        callback(null, registrationValue);
      }
    }
    var wrapperUserHandle = Async.wrap(UserHandle);
    var response = wrapperUserHandle();
    return response;
  }
});


//----------------------------------------------------
function RegistrationNotify(options) {
  log("RegistrationNotify: Hi, I am called.");
  if(!options
    || !options.hasOwnProperty("phone")
    || !verifyPhone(options.phone)
    || !options.hasOwnProperty("userId")) {
    log("RegistrationNotify: options illegal.", options);
  } else {
    var phone = options.phone;
    var userId = options.userId;
    var detail = "欢迎 " + phone + " 注册一企查账户，我们将用心提供优质的企业服务，给您带来温馨的体验，欢迎访问我们的官网：http://www.kyl.biz 获取更多信息！\n"
    + "祝您体验愉快!"

    var message = {
      from: "一企查优质企业服务",
      toUserId: userId,
      toUserName: phone,
      title: "一企查账户提醒",
      subtitle: "欢迎注册一企查账户",
      summary: "欢迎注册一企查账户: " + phone,
      type: "system",
      detail: detail,
      removed: false,
      createTime: new Date()
    }

    Messages.insert(message, function(err) {
      if(err) {
        logError("RegistrationNotify: send welcome notification to : " + phone  + " error.", err);
      } else {
        log("RegistrationNotify: send welcome notification to : " + phone  + " succeed.")
      }
    })
  }
}

//----------------------------------------------------


Meteor.methods({
  'updateProfile': function(profileOptions) {
    function checkEmail(str){
      var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
      if(re.test(str)){
        return true;
      }else{
        return false;
      }
    }
    if(profileOptions) {
      var nickname = profileOptions.nickname;
      var email = profileOptions.email;
      if(nickname.length >= 3 || checkEmail(email)) {
        Meteor.users.update({_id: Meteor.userId()}, {
          $set: {
            'profile.nickname': nickname || "",
            'profile.email': email || ""
          }
        }, function(err) {
          if(err) {
            log('update user profile error');
          } else {
            log('update user profile succeed');
          }
        })
      }
    }
  }
})

//----------------------------------------------------

function userExists(phone) {
  if(verifyPhone(phone) && Meteor.users.findOne({username: phone})) {
    return true;
  } else {
    return false;
  }
}


Meteor.methods({
  'passwordGenerateCode': function(phone) {
    console.log('passwordGenerateCode')
    var phoneLegal = verifyPhone(phone) || false;

    function passworduserCodeGenerator( callback){
      var codeValue = {};
      log('phoneLegal', phoneLegal, 'codeGenerateLegal', codeGenerateLegal(phone))
      var codeGenerateFlag = codeGenerateLegal(phone);
      if(phoneLegal && userExists(phone) && codeGenerateFlag) {
        var randomCode = randomWord(true, 4, 4);
        var timestamp = moment().format('YYYYMMDDHHmmss'); //时间戳
        var accountSid= '8a48b5514a9e4570014a9f056aa300ec'; //Account Sid
        var accountToken = '0fe4efa3c2c54a0eb91dbac340aa49cf'; //Account Token
        var appId = '8a48b5514a9e4570014a9f1ac45b0115'
        var auth = accountSid + ':' + timestamp;
        var a = new Buffer(auth).toString('base64');
        var content = accountSid + accountToken + timestamp;
        var md5 = crypto.createHash('md5');
        md5.update(content);
        var sig = md5.digest('hex').toUpperCase();

        UserCode.update({phone: phone}, {
          $set: {
            phone: phone,
            code: randomCode,
            createTime: Date.now(),
            codeType: 'codeVefify',
            used: false, // verify if the code been used
          },
          $inc: {times: 1}
        }, {
          upsert: true
        }, function(err) {
          if(err) {
            log('update verification code error');
          } else {
            log('update codeVerification code succeed.');
          }
        });

        HTTP.call("POST", "https://sandboxapp.cloopen.com:8883/2013-12-26/Accounts/"+accountSid+"/SMS/TemplateSMS?sig="+sig,{"data":{"to":phone,"appId":""+appId+"","templateId":"11559","datas":[randomCode,"3"]},"headers":{"Accept":"application/json","content-type":"application/json;charset=UTF-8","Authorization":a}},
          function (err, result) {
            if(err) {
              log('send verification code error', err);
              codeValue = {
                codestatus: 0,
                message: "发送验证码失败"
              }              
              callback(err, codeValue);
            } else {
              log('send verification code succeed');
              codeValue = {
                codestatus: 1,
                message: "验证码发送成功!"
              }
              callback(null, codeValue);
            }
          });                
        } else if(!phoneLegal) {
          codeValue =   {
            codestatus: 0,
            message: "用户手机不合法，请确认！"
          }
          callback(null, codeValue);
        } else if(!userExists(phone)) {
          codeValue ={
            codestatus: 0,
            message: "该用户不存在，请确认！"
          }
          callback(null, codeValue);
        } else if(!codeGenerateLegal)    {
          codeValue = {
            codestatus: 0,
            message: "提交太频繁，请一分钟之后再提交！"
          }
          callback(null, codeValue);
        } else  {
          codeValue = {
            codestatus: 0,
            message: "发送验证码失败，请一分钟后重新尝试！"
          }
          callback(null, codeValue);
        }
    }
    var PasswordUserCodeHandle = Async.wrap(passworduserCodeGenerator);
    var response = PasswordUserCodeHandle();
    return response;
  }  
});

