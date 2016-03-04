Template.home.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var type = "credit";
    self.subscribe("searchTimes", type);
  })
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


$.fn.form.settings.rules.verifyKeywords = function (value) {
    return verifyKeywords(value);
}

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
      if(Meteor.userId()) {
        options.userId = Meteor.userId();
      }
      Meteor.call("searchCredit", options);
      FlowRouter.go("/credit/lists", {}, { key: keywords, sid: sid});
    }
  }
})


Template.home.onRendered(function(){
  $("#searchForm")
    .form({
      inline: true,
      onSuccess: function (event, fields) {
        var keywords = fields.keywords+"";
        if (!verifyKeywords(keywords)) {
          Template.mainLayout.alert({
            title: "企业名称字位数必须大于2位"
          });
        } else {
          var sid = Meteor.uuid();
          var options = {
            sid: sid,
            keywords: keywords
          };
          Meteor.call("searchCredit", options);

          FlowRouter.go("/credit/lists", {}, {
            key: keywords,
            sid: sid
          })
        }
      },
      fields: {
        keywords: {
          rules: [
            {
              type:'verifyKeywords',
              prompt : '企业名称字位数必须大于2位'
            }                    
          ]        
        }
      }
    
    });
});

