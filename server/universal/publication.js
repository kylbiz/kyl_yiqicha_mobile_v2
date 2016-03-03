Meteor.publish("searchTimes", function(type) {
  if(!type) {
    type = "credit"
  }
  return SearchTimes.find({type: type});
})

Meteor.publish("creditLists", function(options) {
  var keywords = options.keywords || "";
  var companyStatus = /^[\s\S]+$/;
  console.log(options)
  if(options.companyStatus) {
    companyStatus = options.companyStatus;
  }
  console.log("companyStatus: " + companyStatus)

  if(keywords) {
    return Credit.find({companyName: new RegExp(keywords), companyStatus: companyStatus}, {fields: {basicDetail: 0, annualCheckLists: 0}});
  } else {
    return Credit.find({companyName: "companyName"})
  }
})
 
Meteor.publish("creditRecords", function(options) {
  var keywords = options.keywords || "";
  var sid = options.sid;
  return SearchRecords.find({keywords: keywords, sid: sid});
})

Meteor.publish("userRecords", function(options) {
  var userId = options.userId || "";
  return SearchRecords.find({userId: userId, valid: true}, {
    fields: {keywords: 1, createTime: 1, userId: userId}, 
    sort: {createTime: -1}
  });
})


Meteor.publish("creditDetail", function(cid) {
  return Credit.find({companyId: cid});
})


Meteor.publish("getCheckLists", function(userId) {
  return CheckName.find({userId: userId});
})

