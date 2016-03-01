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
      console.log(fields);
      console.log(fields.password);
      //do something...
      alert("success");
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