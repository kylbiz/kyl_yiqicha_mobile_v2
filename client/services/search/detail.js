Template.search_result.onCreated(function() {
  var self = this;
  var cid = FlowRouter.getQueryParam("cid");
  self.autorun(function() {
    self.subscribe("creditDetail", cid);
  })
})



Template.search_result.helpers({
  "credit": function() {
    var self = this;
    var cid = FlowRouter.getQueryParam("cid");    
    var credit = Credit.findOne({"companyId": cid}, {fields: {companyName: 1, basicDetail: 1}});
    if(credit && credit.hasOwnProperty("companyName")) {
      Session.set("title", credit.companyName);
    }
    return credit;
  }
})
