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

Template.message_navbar.helpers({
  "isFromCenter":function(){
    return (isFromCenter=="isFromCenter");
  }  
})