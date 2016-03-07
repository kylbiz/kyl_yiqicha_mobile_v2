Template.login.onRendered(function(){
    
$('.ui.form').form('reset');
  
$.fn.form.settings.rules.isPhone = function (value) {
  var pattern = /^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/; 
  return pattern.test(value); 
}

$('.ui.form')
  .form({
    inline : true,  
    onSuccess : function(event, fields) {
      var phone = fields.phone;
      var password = fields.password;
      
      Meteor.loginWithPassword(phone, password, function (err) {
        if (err) {
          mainApp.alert("用户名或密码错误,请再次登录!")    
        } else {
          FlowRouter.go(Session.get("redirectAfterLogin") || "/");
        }
      })      
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
          {
            type: 'minLength[6]',
            prompt: '必须输入6为以上字符密码'
          }          
        ]          
      },
    }
  });  
});

