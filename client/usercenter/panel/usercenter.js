Template.usercenter.helpers({
  "username": function() {
    if(Meteor.user()) {
      return Meteor.user().username;
    } else {
      return "";
    }
  }
})