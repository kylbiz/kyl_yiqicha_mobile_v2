function verifyCompany(checkname) {
  if(typeof(checkname) === "string" && checkname.length >=6) {
    return true;
  } else {
    return false;
  }
}

Template.application_create.events({
  "submit form": function(event) {
    event.preventDefault();
    var checkname = $("#checkname").val();
    var messageNotify = $(".message-notify").is(":checked") || false;
    if(!Meteor.userId()) {
      log("用户没有登录，跳转登录！");
      FlowRouter.go("login");
    } else if(!checkname || !verifyCompany(checkname)) {
      log("公司名称不合法，不进行核名操作！")
    } else {
      var options = {
        checkname: checkname,
        messageNotify: messageNotify,
        userId: Meteor.userId()
      }
      Meteor.call("CreateCheckName", options, function(err) {
        if(!err) {
          FlowRouter.go("/checkname/list");
        }
      });
    }
  }
})