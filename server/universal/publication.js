Meteor.publish("searchTimes", function(type) {
  if(!type) {
    type = "credit"
  }
  return SearchTimes.find({type: type});
})

Meteor.publish("creditLists", function(options) {
  var keywords = options.keywords || "";
  log("keywords: " + keywords)
  return Credit.find({companyName: new RegExp(keywords)});
})
 
