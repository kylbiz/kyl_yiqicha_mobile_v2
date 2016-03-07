Template.userinfo.helpers({
  "username": function() {
    if(Meteor.user()) {
      return Meteor.user().username;
    } else {
      return "";
    }
  }
})


Template.userinfo.events({
  "click .logoutBtn": function(event) {
    if(Meteor.userId()) {
      Meteor.logout();
      FlowRouter.go("/");
    } else {
      FlowRouter.go("login");
    }
  } 
})