Template.reset.onCreated(function(){
  Session.set('codeTime', 0);
});

Template.reset.helpers({
  'codeTime': function(){
   return Session.get('codeTime');
  }
});

Template.reset.events({
  "click #send":function(){    
    Session.set('codeTime', 60);   

    var phone = $("#phone").val();

    if(!verifyPhone(phone)) {
      alert("请正确填写手机号！");
    } else {
      Meteor.call('genereateUserCode', phone, function (err, codeValue) {
        if (!err && codeValue && codeValue['codestatus'] && codeValue['message']) {
          if (codeValue['codestatus'] === 0 || codeValue['codestatus'] === 2) {
            alert(codeValue['message'] || "未知错误");
          }
        } else {
          alert(codeValue['message'] || "未知错误");
        }
      });     
    }
  }
})

Template.reset.onRendered(function(){
  clearInterval();   
  setInterval(function() {     
    if (Session.get('codeTime') > 0) {
      Session.set('codeTime', Session.get('codeTime') - 1);
    }
  }, 1000);   
})


//----------------------------------------------------------------------
//验证手机号码
function verifyPhone(phone) {
  var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  if (!phoneReg.test(phone)) {
    return false;
  } else {
    return true;
  }
}
//----------------------------------------------------------------------

Template.reset.events({
  "click .changePassword": function(event) {
    var phone = $("#phone").val();
    var password = $("#password").val();
    var verifyCode = $("input[name='verifyCode']").val();

    if(!verifyPhone(phone)) {
      alert("手机号码有误，请确认！");
    } else if(!password || password.length < 6) {
      alert("请输入至少6位修改密码！");
    } else if(!verifyCode){
      alert("请输入验证码！");
    } else {
      var options = {
        username: phone,
        password: password,
        verifyCode: verifyCode
      }
      Meteor.call("changeUserPassword", options, function(err, result) {
        log(arguments)
        if(err) {
          alert("修改密码失败，请重试！");
        } else if(result && result.status && result.status === 1){
          alert("修改密码成功,退出请重新登录！");
          Meteor.logout();
          Router.go('/login')
        } else {
          alert(result.message)
        }   
      })   
    }
  }
})

//----------------------------------------------------------------------
//验证手机号码
function verifyPhone(phone) {
  var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  if (!phoneReg.test(phone)) {
    return false;
  } else {
    return true;
  }
}




