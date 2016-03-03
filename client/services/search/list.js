Template.search_list.onRendered(function(){
  var count = 0;
  var max = 80;
  setInterval(function () {
    if(count<max) {
      count++;
      $("#uipickerview").val(count).trigger("change");   
    }
    else {
      clearInterval();
    }
  }, 20);
      
  var flag = true;
  
  $("#uipickerview").knob({   
    min:0,
    max:100,
    readOnly:true,
    fgColor:'#d81918',
    format: function (value) {
     return value+"%";
    },
    width:100,
    height:100,
    release:function(){
      if(flag){
        $("canvas").addClass("border");
        flag=false;
      }
    }
  });   
});

Template.search_list.onRendered(function() {
  var self = this;
  // self.autorun(function() {
    var sid = FlowRouter.getQueryParam("sid") || "";
    var keywords = FlowRouter.getQueryParam("key") || "";

    self.subscribe("creditLists", {keywords: keywords});
    self.subscribe("creditRecords", {keywords: keywords, sid:sid});
  // })

});



Template.search_list.helpers({
  'count':function(){
      return Session.get("count");    
  },
  "creditLists": function() {
    var sid = FlowRouter.getQueryParam("sid") || "";
    var keywords = FlowRouter.getQueryParam("key") || "";    
    var creditLists =  Credit.find({companyName: new RegExp(keywords)});
    Session.set("currentListsNum", creditLists.count());
    return creditLists || [];
  },
  "keywords": function() {
    var keywords = FlowRouter.getQueryParam("key") || "";
    return keywords;
  },
  "creditRecords": function() {
    var sid = FlowRouter.getQueryParam("sid") || "";
    var keywords = FlowRouter.getQueryParam("key") || "";   
    var creditRecords = SearchRecords.findOne({keywords: keywords, sid: sid}) || {};   
    Session.set("allpageNum", creditRecords.allpageNum);
    Session.set("creditNum", creditRecords.creditNum);
    return creditRecords; 
  },
  "hasNext": function() {
    var currentListsNum = Session.get("currentListsNum") || 0;
    var allpageNum = Session.get("allpageNum") || 0;
    var creditNum = Session.get("creditNum") || 0;

    // 允许出现错误，原因是不同名称公司个数不对称
    var hasNext = false;

    var currentPage = Math.floor(currentListsNum / 5) + 1;

    if(currentListsNum >= 0 
      && currentListsNum <= creditNum
      && allpageNum >=0
      && currentListsNum <= (Math.floor(creditNum / 5)) * 5) {
      hasNext = true;
    }
    return hasNext;
  }
});


Template.search_list.events({
  "click li.creditItem": function(event) {
    var companyId = $(event.currentTarget).attr("data-credit") || "";

    FlowRouter.go("/credit/detail", {}, {cid: companyId});
  }
})

Template.search_list.onRendered(function(){
  $(".filter-content li.item-content").click(function(){
      var text = $(this).find(".item-title").text();
      alert(text);
      $(".filter-content").fadeOut();
  });
})


Template.search_list.events({
  "click .moreCredit": function(event) {
    var currentListsNum = Session.get("currentListsNum") || 0;
    var allpageNum = Session.get("allpageNum") || 0;
    var creditNum = Session.get("creditNum") || 0;

    // 允许出现错误，原因是不同名称公司个数不对称
    var hasNext = false;
    var nextPage = 1;

    var currentPage = Math.floor(currentListsNum / 5) + 1;

    log(typeof(currentListsNum), currentListsNum >=0)
    if(!(currentListsNum >= 0)) {
      log("当前显示公司条数错误：" + currentListsNum);
    }  else if(!(currentListsNum <= creditNum)) {
      log("错误： 当前公司条数大于总公司条数", "总条数：" + creditNum, "当前已存在条数：" + currentListsNum);
    } else if(!(allpageNum >=0)) {
      log("错误：所有页数小于零") 
    } else {
      if(currentListsNum <= (Math.floor(creditNum / 5)) * 5) {
        hasNext = true;
        nextPage = Math.floor(currentListsNum / 5) + 1;
      } else {
        hasNext = false;
      }      
    }

    if(hasNext) {
      var keywords = FlowRouter.getQueryParam("key");
      var sid = FlowRouter.getQueryParam("sid");

      var options = {
        keywords: keywords,
        sid: sid,
        hasNext: true,
        nextPage: nextPage
      }

      Meteor.call("getMoreCredit", options);
    }
  }
})





















