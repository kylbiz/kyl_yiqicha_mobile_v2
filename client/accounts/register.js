Template.register.onCreated(function(){
  Session.set('codeTime', 0);
});

Template.register.helpers({
  'codeTime': function(){
   return Session.get('codeTime');
  }
});

Template.register.events({
  "click #send":function(e){    
    var self = $(e.currentTarget);      
    var phone = $("#phone").val();
    if(!(phone)) {
      mainApp.myPrompt($("#phone"),"请输入手机号");     
      return false;
    }    
    var phoneReg = new RegExp(/^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/);    
    if(!phoneReg.test(phone)) {  
      mainApp.myPrompt($("#phone"),"请输入正确的手机号");      
    } else {
      
      Session.set('codeTime', 60);      
      Meteor.call('genereateUserCode', phone, function (err, codeValue) {
        if (!err && codeValue && codeValue['codestatus'] && codeValue['message']) {
          if (codeValue['codestatus'] === 0 || codeValue['codestatus'] === 2) {
            var error = codeValue['message'] || "未知错误";
            mainApp.alert(error);
          }
        } else {
            var error = codeValue['message'] || "未知错误";          
            mainApp.alert(error);
        }
      });     
    }
  }
})

Template.register.onRendered(function () {

  $('.ui.form').form('reset');

  clearInterval();    
  setInterval(function () {
    if (Session.get('codeTime') > 0) {
      Session.set('codeTime', Session.get('codeTime') - 1);
    }
  }, 1000);

  $.fn.form.settings.rules.isPhone = function (value) {
    var pattern = /^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/;
    return pattern.test(value);
  }

  $.fn.form.settings.rules.isValidCode = function (value) {
    //call
    //...return
    return true;
  }


  //------------------------------------------------------------
  //用户注册操作

  $('.ui.form')
    .form({
      inline: true,
      onSuccess: function (event, fields) {
        var phone = fields.phone;
        var password = fields.password;

        Meteor.call('UserRegistration', fields, function (err, registitionValue) {
          if (!err && registitionValue && (registitionValue['code'] === 0)) {
            Meteor.loginWithPassword(phone, password, function (err) {
              if (err) {
                mainApp.alert("注册成功，但登录失败，请重新登录！");
                FlowRouter.go('/login');
              } else {
                FlowRouter.go("/usercenter");
              }
            })
          } else {
            var error = registitionValue['message'] || "注册失败！";
            mainApp.alert(error);
          }
        });
      },
      onFailure: function (formErrors, fields) {

      },
      fields: {
        phone: {
          rules: [
            {
              type: 'empty',
              prompt: '请输入手机号'
          },
            {
              //            type: 'regExp[/^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/]',
              type: 'isPhone',
              prompt: '请输入正确的手机号'
          }
        ]
        },
        password: {
          rules: [
          {
              type: 'empty',
              prompt: '请输入密码'
          },
          {
              type: 'minLength[6]',
              prompt: '必须输入6为以上字符密码'
          }
        ]
        },
        conform_password: {
          rules: [
            {
              type: 'empty',
              prompt: '请再次输入密码'
          },
            {
              type: 'match[password]',
              prompt: '两次输入密码不符'
          }
        ]
        },
        code: {
          rules: [
            {
              type: 'empty',
              prompt: '请输入验证码'
          },
          {
              type: 'isValidCode',
              prompt: '验证码不正确'
          }
        ]
        }
      }
    });

});

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





           
