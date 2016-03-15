// 获取核名次数，需要提供核名类型
Meteor.publish("searchTimes", function(type) {
  if(!type) {
    type = "credit"
  }
  return SearchTimes.find({type: type});
})

// 获取核名信息列表
// 需要提供当前所需的字段 keywords 
// 或者提供当前需要查询字段的所有公司的装填 companyStatus
Meteor.publish("creditLists", function(options) {
  var keywords = options.keywords || "";
  var companyStatus = /^[\s\S]+$/;
  console.log(options)
  if(options.companyStatus) {
    companyStatus = options.companyStatus;
  }
  console.log("companyStatus: " + companyStatus)

  if(keywords) {
    return Credit.find({
      companyName: new RegExp(keywords), 
      companyStatus: companyStatus
    }, {
      fields: {
        basicDetail: 0,
        annualCheckLists: 0
      }
    });
  } else {
    return Credit.find({companyName: "companyName"})
  }
})
 
// 获取查询当前字段记录，需要提供当前查询的记录 sid
Meteor.publish("creditRecords", function(options) {
  var keywords = options.keywords || "";
  var sid = options.sid;
  return SearchRecords.find({keywords: keywords, sid: sid});
})

// 获取用户查询记录
Meteor.publish("userRecords", function(options) {
  var userId = options.userId || "";
  return SearchRecords.find({userId: userId, removed: false}, {
    fields: {keywords: 1, createTime: 1, userId: userId}, 
    sort: {createTime: -1}
  });
})

// 获取当前字段或公司的详细信息 
Meteor.publish("creditDetail", function(cid) {
  return Credit.find({companyId: cid});
})

// 获取查询核名信息的列表  
Meteor.publish("getCheckLists", function(userId) {
  return CheckName.find({userId: userId, removed: false});
})

// 获取具体查询的记录信息
Meteor.publish("getCheckName", function(options) {
  var userId = options.userId || "";
  var cid = options.cid || "";  
  return CheckName.find({_id: cid, userId: userId, removed: false});
})

// 获取用户未删除的系统信息
// 需提供当前用户的 userId
Meteor.publish("getMessageLists", function(userId) {
  return Messages.find({
    toUserId: userId,
    removed: false
  }, {
    fields: {
      detail: 0
    },
    sort: {
      createTime: -1
    }
  });
})
