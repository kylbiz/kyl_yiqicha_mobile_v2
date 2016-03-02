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
//  var self = $(e.currentTarget);
//  var field = self.closest(".field").addClass("error");
//  
//  var prompt= $('<div/>')                                                                                         // 1141
//        .addClass('ui basic red pointing prompt label')                                                          // 1142
//        .html("你好").appendTo(field);
//    
//  field.removeClass("error");
//  field.find(".prompt").remove();  
    
		Session.set('codeTime', 60);     
  }
})

Template.register.onRendered(function(){

$('.ui.form').form('reset');
  
//clearInterval();    
setInterval(function() {
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

$('.ui.form')
  .form({
    inline: true,
    onSuccess: function (event, fields) {
      console.log(fields);
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
            type:'isPhone',
            prompt: '请输入正确的手机号'
          }
        ]
      },
      password: {
        rules: [
          {
            type: 'empty',
            prompt: '请输入密码'
          }
        ]
      },
      verifycode: {
        rules: [
          {
            type:'empty',
            prompt:'请输入验证码'
          },
          {
            type:'isValidCode',
            prompt:'验证码不正确'
          }
        ] 
      }
    }
  });
  
})

               
