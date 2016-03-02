loggedIn = FlowRouter.group({
  "triggersEnter": [function() {
    if(!Meteor.userId()) {
      route = FlowRouter.current();
      if(route.route.name !== "login") {
        Session.set("redirectAfterLogin", route.path);
      }
      FlowRouter.go("/login");
    }
  }]
})


loggedIn.route('/usercenter', {
  name: "usercenter",
  action: function() {
      BlazeLayout.render('mainLayout',{main:"usercenter",top:"navbar"});
  }
});

FlowRouter.route('/login', {
  name: "login",
  triggersEnter: [function() {
    if(Meteor.userId()) {
      FlowRouter.go(Session.get("redirectAfterLogin") || "/");
    }
  }],    
  action: function() {
      BlazeLayout.render('mainLayout',{main:"login"});
  }
});

FlowRouter.route('/register', {
  name: "register",
  triggersEnter: [function() {
    if(Meteor.userId()) {
      FlowRouter.go(Session.get("redirectAfterLogin") || "/");
    }
  }],
  action: function() {
      BlazeLayout.render('mainLayout',{main:"register"});
  }
});

loggedIn.route('/userinfo',{
  name: "userinfo",
  action: function() {
    BlazeLayout.render('mainLayout',{main:"userinfo",back:"usercenter"});
  }
});










