/**
 * 清楚系统消息
 * 用户需要提供userId
 * 以及需要清除的消息的id
 */
Meteor.methods({
  "clearMessages": function(options) {
    log("clearMessages: Hi, I am calling!")
    if(!options
      || !options.hasOwnProperty("userId")
      || Meteor.userId() !== options.userId
      || !options.hasOwnProperty("messageIds")) {
      log("clearMessages: options illegal.");
    } else {
     var messageIds = options.messageIds || [];
     var userId = options.userId;

     messageIds.forEach(function(message) {
      if(message.hasOwnProperty("messageId")) {
        var messageId = message.messageId;

        Messages.update({
          _id: messageId,
          toUserId: userId
        }, {
          $set: {
            removed: true
          }
        }, function(err) {
          if(err) {
            logError("clearMessages: clear message: " + messageId + " error.", err);
          } else {
            log("clearMessages: clear message: " + messageId + " succeed.");
          }
        })
      }
     })
    }
  }
})