Meteor.methods({
  "CreateCheckName": function(options) {
    log("CreateCheckName: Hi I was called.");
    if(!options
      || !options.hasOwnProperty("checkname")
      || !Meteor.userId()
      || Meteor.userId() !== options.userId
      || !options.hasOwnProperty("messageNotify")) {
      log("CreateCheckName: options illegal.", options);
    } else {
      var userId = Meteor.userId();
      var checkname = options.checkname || "";
      var messageNotify = options.messageNotify || false;

      CheckName.update({
        checkname: checkname,
        userId: userId
      }, {
        $set: {
          status: "等待查询",
          messageNotify: messageNotify,
          updateTime: new Date()
        }
      }, {
        upsert: true
      }, function(err) {
        if(err) {
          logError("CreateCheckName: add checkname: " + checkname + " error.", err);
        } else {
          log("CreateCheckName: add checkname: " + checkname + " succeed.");          
        }
      })
    }
  }
})