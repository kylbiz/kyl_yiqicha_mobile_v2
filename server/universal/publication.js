Meteor.publish("searchTimes", function(type) {
  if(!type) {
    type = "credit"
  }
  return SearchTimes.find({type: type});
})

Meteor.publish("creditLists", function(options) {
  var keywords = options.keywords || "";
  console.log("keywords: " + keywords)
  if(keywords) {
    return Credit.find({companyName: new RegExp(keywords)});
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
