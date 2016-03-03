Template.history.onCreated(function() {
  var self = this;
  self.autorun(function() {
    if(Meteor.userId()) {
      var userId = Meteor.userId();
      self.subscribe("userRecords", {userId: userId});
    }
  })
})


Template.history.helpers({
  "historyLists": function() {
    if(Meteor.userId()) {
      var records = SearchRecords.find({userId: Meteor.userId()}).fetch();
      records.map(function(record) {
        var createTime = moment(record.createTime).format("YYYY-MM-DD hh:mm")
        record.createTime = createTime
        return record
      })
      return records;
    } else {
      return [];
    }
  }
})

Template.history.onRendered(function() {
  $(".bar-nav button").click(function() {
    Template.mainLayout.confirm({
      title: "是否全部清除"
    }).on(function(confirm) {
      if (confirm) {
        if(!Meteor.userId()) {
          alert("当前未登录，禁止清空！");
        } else {
          var recordIdsObj = $(".historyitem");
          var recordsIds = [];

          recordIdsObj.each(function(index, element) {
            var recordId = $(element).attr("data-id");
            recordsIds.push({recordId: recordId});
          })

          var options = {
            userId: Meteor.userId(),
            recordsIds: recordsIds
          }
          Meteor.call("clearSearchItems", options);
        }
      } 
    })
  })
});
