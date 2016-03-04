Template.message.helpers({
  messageLists:function(){
    var messages = Messages.find({toUserId: Meteor.userId(), removed: false}).fetch();
    messages.map(function(message) {
      var createTime = moment(message.createTime).format("YYYY-MM-DD hh:mm")
      message.createTime = createTime
      return message
    })
    return messages;
  }
})

// -----------------------------------------------------------

Template.message.onCreated(function() {
  var self = this;
  self.autorun(function() {
    if(Meteor.userId()) {
      var userId = Meteor.userId();
      self.subscribe("getMessageLists", userId);
    } else {
      FlowRouter.go("login");
    }
  })
})

// -----------------------------------------------------------

Template.message_navbar.onRendered(function() {
  $(".clearMessage").click(function() {
    var MessagesIdsObj = $(".messageItem");
    var messageIds = [];

    MessagesIdsObj.each(function(index, element) {
      var messageId = $(element).attr("data-messageid");
      messageIds.push({messageId: messageId});
    })

    if(messageIds.length !== 0) {
      Template.mainLayout.confirm({
        title: "是否全部清除通知信息"
      }).on(function(confirm) {
        if (confirm) {
          if(!Meteor.userId()) {
            alert("当前未登录，禁止清空！");
          } else {
            var options = {
              userId: Meteor.userId(),
              messageIds: messageIds
            }
            log(options)
            Meteor.call("clearMessages", options);
          }
        } 
      })
    }
  })
});
