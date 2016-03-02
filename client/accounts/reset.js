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
    var phoneReg = new RegExp(/^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/)

    if(!phoneReg.test(phone)) {
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





Template.reset.events({
  "click .change": function(event) {
    var phone = $("[id=tel").val();
    var password = $("[id=password]").val() || "";
    var password_re = $("[id=password_re]").val() || "";
    var verifyCode = $("#verifyCode").val() || "";
    if(verifyPhone(phone) && verifyCode && password && checkPassword(password, password_re)) {
      var options = {
        username: phone,
        password: password,
        verifyCode: verifyCode
      }
      Meteor.call("changeUserPassword", options, function(err, result) {
        if(err) {
          $("#codeError").html("修改密码失败，请重试！");
          $("#codeError").show();
        } else if(result && result.status && result.status === 1){
          $("#codeSuccess").html("修改密码成功");
          $("#codeSuccess").show();
          Router.go('/login')
        } else {
          $("#codeError").html(result.message);
          $("#codeError").show();
        }   
      })   
    } else {
      if(!verifyPhone(phone)){
        $("#phoneError").html("手机号码有误，请确认！");
        $("phoneError").show();
      } else if(!verifyCode) {
          $("#codeSuccess").html("请输入验证码");
          $("#codeSuccess").show();        
      }
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
//----------------------------------------------------------------------
//发送手机验证码
var SendVerifyCode = function () {
  var phone = $(".RegisterUserId").val() || "";
  if (verifyPhone(phone)) {
    Meteor.call('genereateUserCode', phone, function (err, codeValue) {
      if (!err && codeValue && codeValue['codestatus'] && codeValue['message']) {
        if (codeValue['codestatus'] === 0 || codeValue['codestatus'] === 2) {
          $("[id=registerError]").html(codeValue['message'] || "未知错误");
          $("[id=registerError]").show();
        }
      } else {
        $("[id=errregisterErroror]").html(codeValue['message'] || "未知错误");
        $("[id=registerError]").show();
      }
    });
  } else {
    $("[id=registerError]").html("手机号错误,请确认!");
    $("[id=registerError]").show();
  }
}



//------------------------------------------------------------
//用户注册操作

Template.reset.events({
  "click .": function(event) {
    var phone = $("#phone").val() || "";
    var password = $("#password").val() || "";
    var verifyCode = $("input[name='verifycode']").val() || "";

    if(!verifyPhone(phone)) {
      alert("请正确输入手机号！");
    } else if(!password || password.length < 6) {
      alert("必须输入6为以上字符密码！");
    } else {
      var options = {
        username: phone,
        password: password,
        verifyCode: verifyCode
      }
      Meteor.call("changeUserPassword", options, function(err, result) {
        if(err) {
          alert("修改密码失败，请重试！");
        } else if(result && result.status && result.status === 1){
          alert("修改密码成功,请重新登录!");
          Meteor.logout();
          FlowRouter.go('login')
        } else {
          alert(result.message);
        }   
      }) 
    }
  }
})


