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
    var recordIdsObj = $(".historyitem");
    var recordsIds = [];

    recordIdsObj.each(function(index, element) {
      var recordId = $(element).attr("data-id");
      recordsIds.push({recordId: recordId});
    })

    if(recordsIds.length !== 0) {
      Template.mainLayout.confirm({
        title: "是否全部清除"
      }).on(function(confirm) {
        if (confirm) {
          if(!Meteor.userId()) {
            alert("当前未登录，禁止清空！");
          } else {

            var options = {
              userId: Meteor.userId(),
              recordsIds: recordsIds
            }
            Meteor.call("clearSearchItems", options);
          }
        } 
      })
    }
  })
});


Template.history.events({
  "click .historyitem": function(event) {
    var keywords = $(event.currentTarget).attr("data-keywords") || "";
    if(!verifyKeywords(keywords)) {
      alert("企业名称字位数必须大于2位！");
    } else {
      var sid = Meteor.uuid();
      var options = {
        sid: sid,
        keywords: keywords
      };
      if(Meteor.userId()) {
        options.userId = Meteor.userId();
      }
      Meteor.call("searchCredit", options);
      FlowRouter.go("/credit/lists", {}, { key: keywords, sid: sid});
    }   
  }
})

