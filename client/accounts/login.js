Template.login.onRendered(function(){
    
$('.ui.form').form('reset');
  
$.fn.form.settings.rules.isPhone = function (value) {
  var pattern = /^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/; 
  return pattern.test(value); 
}

$.fn.form.settings.rules.isMatchAccount = function (value) {
  //call
  //...return
  return true;
} 



$('.ui.form')
  .form({
    inline : true,  
    onSuccess : function(event, fields) {
    },
    onFailure : function(formErrors, fields) {
      
    },  
    fields: {
      phone   : {
        rules: [
          {
            type:'empty',
            prompt : '请输入手机号'
          },
          {
//            type:'regExp[/^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/]',
            type:'isPhone',
            prompt : '请输入正确的手机号'            
          }                    
        ]        
      },      
      password : {
        rules: [
          {
            type:'empty',
            prompt : '请输入密码'
          },
//          {
//            type:'',
//            prompt : '请输入正确的密码'
//          },           
          {
            type:'isMatchAccount',
            prompt: '用户名或密码错误'
          }
          
        ]          
      },
    }
  })
;
  
//  $form = $('.get.example form'),  
  
})


// ---------------------------------------------------------------

//验证手机号码
function verifyPhone(phone) {
  var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  if (!phoneReg.test(phone)) {
    return false;
  } else {
    return true;
  }
}


Template.login.events({
  "click .loginBtn": function(event) {
    var phone = $("#phone").val() || "";
    var password = $("#password").val() || "";

    if(!verifyPhone(phone)) {
      // alert("请正确输入手机号！");
    } else if(!password || password.length < 6) {
      // alert("必须输入6为以上字符密码！");
    } else {
      Meteor.loginWithPassword(phone, password, function (err) {
        if (err) {
          alert("用户名或密码错误,请再次登录!")    
        } else {
          FlowRouter.go(Session.get("redirectAfterLogin") || "/");
        }
      })
    }
  }
})


