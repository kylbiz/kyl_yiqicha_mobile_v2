Template.login.onRendered(function(){
  Session.set("title","登录");
})
Template.register.onRendered(function(){
  Session.set("title","注册");
});
Template.reset.onRendered(function(){
  Session.set("title","重置密码");
});

Template.home.onRendered(function(){
  Session.set("title","企业自助查询系统");
});

Template.message.onRendered(function(){
  Session.set("title","通知");
});
Template.usercenter.onRendered(function(){
  Session.set("title","个人中心");
});
Template.about.onRendered(function(){
  Session.set("title","关于一企查");
});
Template.userinfo.onRendered(function(){
  Session.set("title","详情");
});
Template.history.onRendered(function(){
  Session.set("title","查询记录");
});

Template.application.onRendered(function(){
  Session.set("title","名称状态提醒");
});
Template.application_empty.onRendered(function(){
  Session.set("title","名称状态提醒")
})

Template.application_create.onRendered(function(){
  Session.set("title","增加名称");
});
Template.application_content.onRendered(function(){
  Session.set("title","名称状态提醒详情"); 
})
