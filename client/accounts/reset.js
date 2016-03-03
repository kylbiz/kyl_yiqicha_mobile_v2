Template.reset.onCreated(function () {
  Session.set('codeTime', 0);
});

Template.reset.onRendered(function(){
  $.fn.form.settings.rules.isPhone = function (value) {
    var pattern = /^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/;
    return pattern.test(value);
  }
  $("#resetForm")
    .form({
      inline: true,
      onSuccess: function (event, fields) {
        Meteor.call("changeUserPassword", fields, function(err, result) {
          log(arguments)
          if(err) {
            mainApp.alert("修改密码失败，请重试！");
          } else if(result && result.status && result.status === 1){
            mainApp.alert("修改密码成功,退出请重新登录！");
            Meteor.logout();
            FlowRouter.go('/login')
          } else {
            mainApp.alert(result.message)
          }   
        });                
      },
      fields: {
        username: {
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
        verifyCode: {
          rules: [
            {
              type: 'empty',
              prompt: '请输入验证码'
            }
          ]
        }
      }
    });
  
})
Template.reset.helpers({
  'codeTime': function(){
   return Session.get('codeTime');
  }
});

Template.reset.events({
  "click #send":function(){    
    var phone = $("#phone").val();

    if(!(phone)) {
      mainApp.myPrompt($("#phone"),"请输入手机号");     
      return false;
    }     
    if(!verifyPhone(phone)) {  
      mainApp.myPrompt($("#phone"),"请输入正确的手机号");      
    } else {
      Session.set('codeTime', 60);         
      Meteor.call('genereateUserCode', phone, function (err, codeValue) {
        if (!err && codeValue && codeValue['codestatus'] && codeValue['message']) {
          if (codeValue['codestatus'] === 0 || codeValue['codestatus'] === 2) {
            mainApp.alert(codeValue['message'] || "未知错误");
          }
        } else {
            mainApp.alert(codeValue['message'] || "未知错误");
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
