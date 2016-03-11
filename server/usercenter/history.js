/**
 * 清除当前查询历史item
 * @param {json} options 用户需提供当前操作的参数
 * @attribute userId
 * @attribute recordsIds Array 需要清楚查询记录的 record id
 */
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
              removed: true
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