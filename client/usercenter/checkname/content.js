Template.application_content.onCreated(function() {
  var self = this;
  var userId = Meteor.userId();
  var cid = FlowRouter.getQueryParam("cid");
  var options = {
    userId: userId,
    cid: cid
  }
  self.autorun(function() {
    self.subscribe("getCheckName", options);
  })
})


Template.application_content.helpers({
  "checkObj": function() {
  var userId = Meteor.userId();
  var cid = FlowRouter.getQueryParam("cid");
  return CheckName.findOne({userId: userId, _id: cid});
  }
})
