Template.navbar_title.helpers({
  "title": function () {
    return Session.get('title');
  }
});

Template.back_navbar.onCreated(function(){
    initiator = 'back';
});

Template.back_navbar.onRendered(function(){
  
  $(document).on("click",".icon-back.router",function(event) {  
    nextInitiator = 'back';
    var source = $(event.target).attr("href");
    if(source==undefined||source=="#") {   
      history.back();   
      event.stopImmediatePropagation();
      event.preventDefault();           
    }      
  });
  
});

Template.render_back_navbar.onCreated(function(){
    initiator = 'back';
});

Template.render_back_navbar.onRendered(function(){
  
  $(document).on("click",".icon-back.reload",function(event) {  
    nextInitiator = 'back';
    FlowRouter.reload();
    return false;
  });    
   
});

Template.filter_navbar.onRendered(function(){
  $(".filter-btn").click(function(){
     $(".filter-content").fadeToggle();
  });                                  
});
Template.filter_navbar.helpers({
  "status":function(){
    return (Session.get("companyStatus")?Session.get("companyStatus"):"筛选");
  }                                 
});



Template.message_navbar.helpers({
  "isFromCenter":function(){
    return Session.get("isFromCenter");
  }  
})


Template.filter_navbar.events({
  "submit .keywordsForm": function(event) {
    var keywords = $(".searchKeywords").val();
    event.preventDefault()  ;

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
