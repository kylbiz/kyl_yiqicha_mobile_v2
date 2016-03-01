loggedIn = FlowRouter.group({
  "triggersEnter": [function() {
    log("triggersEnter")
    if(!Meteor.loggingIn() || !Meteor.userId()) {
      route = FlowRouter.current();
      console.log(route)

      if(route.route.name !== "login") {
        Session.set("redirectAfterLogin", route.path);
      }

      FlowRouter.go("login");
    }
  }]
})


loggedIn.route('/usercenter', {
    name: "usercenter",
    action: function() {
        BlazeLayout.render('mainLayout',{main:"usercenter",top:"navbar"});
    }
});



FlowRouter.route('/accounts',{
    action: function() {
        BlazeLayout.render("mainLayout",{main:"accounts",top:"navbar"});
    }
});

FlowRouter.route('/login', {
    name: "login",
    action: function() {
        BlazeLayout.render('mainLayout',{main:"login"});
    }
});

FlowRouter.route('/register', {
    name: "register",
    triggersEnter: [function() {
      if(Meteor.loggingIn() || Meteor.userId()) {
        FlowRouter.go(Session.get("redirectAfterLogin") || "/");
      }
    }],
    action: function() {
        BlazeLayout.render('mainLayout',{main:"register"});
    }
});