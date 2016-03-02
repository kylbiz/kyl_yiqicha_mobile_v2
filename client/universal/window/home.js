Template.home.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var type = "credit";
    self.subscribe("searchTimes", type);
  })
});

Template.home.onRendered(function(){
  Template.mainLayout.alert({title:"哈哈"});
});

Template.home.helpers({
  "searchTimes": function() {
    var searchObj =  SearchTimes.findOne({type: "credit"})
    if(searchObj && searchObj.hasOwnProperty("times")) {
      return searchObj.times || 0;
    } else {
      return 0;
    }
  }
});

function verifyKeywords(keywords) {
  if(!typeof(keywords) === "string" 
    || keywords.length < 2) {
    return false;
  } else {
    return true;
  }
};


Template.home.events({
  "click .searchCredit": function(event) {
    var keywords = $(".keywords").val();

    if(!verifyKeywords(keywords)) {
      alert("企业名称字位数必须大于2位！");
    } else {
      var sid = Meteor.uuid();
      var options = {
        sid: sid,
        keywords: keywords
      };
      Meteor.call("searchCredit", options);

      FlowRouter.go("/credit/lists", {}, { key: keywords, sid: sid})
    }
  }
})

