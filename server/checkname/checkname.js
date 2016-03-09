Meteor.methods({
  "CreateCheckName": function(options) {
    log("CreateCheckName: Hi I was called.");
    if(!options
      || !options.hasOwnProperty("checkname")
      || !CheckUtil.verifyCheckName(options.checkname)
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
          nameStatus: "等待查询",
          removed: false,
          messageNotify: messageNotify,
          searchedTimes: 0,
          checkPoint: 0, //0提交——1审核——2领证
          checkStatus: 0, //0当前为不确定--1成功--2失败--3提交时已存在名字的情况
          beginSearchTime: new Date(),
          latestSearchTime: new Date(),
          searchFinished: false
        }
      }, {
        upsert: true
      }, function(err) {
        if(err) {
          logError("CreateCheckName: add checkname: " + checkname + " error.", err);
        } else {
          log("CreateCheckName: add checkname: " + checkname + " succeed.");    

        var checkOptions = {
          userId: userId,
          checkname: checkname
        };

        // 初始化核名信息
        CheckUtil.InitCreditName(checkOptions, function(err, result) {
            if(err) {
              log("CreateCheckName: init checkname " + checkname + " error.", err);
            } else {
              log("CreateCheckName: init checkname " + checkname + " succeed.");
            }
        })
        }
      })
    }
  }
})

// -------------------------------------------------------

Meteor.methods({
  "RemoveCheckName": function(options) {
    log("RemoveCheckName: Hi I was called.");
    if(!options
      || !Meteor.userId()
      || Meteor.userId() !== options.userId
      || !options.hasOwnProperty("deleteLists")
      || !(options.deleteLists instanceof Array)) {
      log("CreateCheckName: options illegal.", options);
    } else {
      var userId = Meteor.userId();    
      var deleteLists = options.deleteLists || [];

      deleteLists.forEach(function(check) {
        if(!check.hasOwnProperty("deleteId")) {
          log("RemoveCheckName: remove checkname failed, for checkname id not provided.");
        } else {
          var deleteId = check.deleteId;

          CheckName.update({
            userId: userId,
            _id: deleteId
          }, {
            $set: {
              removed: true
            }
          }, function(err) {
            if(err) {
              logError("RemoveCheckName: remove checkname :" + deleteId + " error.", err);
            } else {
              log("RemoveCheckName: remove checkname :" + deleteId + " succeed.")
            }
          })
        }
      })
    }
  }
})







