
Meteor.methods({
  "clearSearchItems": function(options) {
    log("clearSearchItems: Hi, I am calling!")
    if(!options
      || !options.hasOwnProperty("userId")
      || Meteor.userId() !== options.userId
      || !options.hasOwnProperty("recordsIds")) {
      log("clearSearchItems: options illegal.");
    } else {
      var recordsIds = options.recordsIds;
      var userId = options.userId;

      recordsIds.forEach(function(record) {
        if(record.hasOwnProperty("recordId")) {
          recordId = record.recordId;

          SearchRecords.update({
            _id: recordId,
            userId: userId
          }, {
            $set: {
              valid: false
            }
          },function(err) {
            if(err) {
              logError("clearSearchItems: clear search record: " + recordId + " error.", err);
            } else {
              log("clearSearchItems: clear search record: " + recordId + " succeed.");
            }
          })
        }
      })
    }
  }
})