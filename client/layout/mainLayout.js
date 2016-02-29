Session.setDefault("title", "企业自助查询系统");

var ANIMATION_DURATION = 300;

nextInitiator = null;
initiator = null;

Tracker.autorun(function() {
  FlowRouter.watchPathChange();
  var currentContext = FlowRouter.current();  
  initiator = nextInitiator;
  nextInitiator = null;
});

Template.mainLayout.onRendered(function(){
        
  $(document).on("click", ".tab-item", function(e) {
    var $target = $(e.currentTarget);
    if(!$target.hasClass("tab-link")) {
      $target.parent().find(".active").removeClass("active");
      $target.addClass("active");
    }
  });
  
  $(document).on("click", ".main-tab .tab-link", function(e) {
    initiator ="single";    
      e.stopImmediatePropagation();
      e.preventDefault();      
    var $target = $(e.currentTarget);
    $target.addClass("active").siblings().removeClass("active");    
  });   
  
  var path = FlowRouter.current().route.path;  
  if(path=='/') {
    $(".bar-tab .tab-item").eq(0).addClass("active").siblings().removeClass("active");    
  }    
  else if(path=='/message') {
    $(".bar-tab .tab-item").eq(1).addClass("active").siblings().removeClass("active");  
  }  
  else if(path='/usercenter') {
    $(".bar-tab .tab-item").eq(2).addClass("active").siblings().removeClass("active");  
  }
    
  $(document).on("click",".item-link",function(e) { 
      var link = $(this).data("path"); 
      var content = $(this).data("mounter");      
      if(link) {
         link = "/" + link;
         FlowRouter.go(link);    
         return false;
      }
      else if(content) {
         var home =$(this).data("home");
         BlazeLayout.render('mainLayout',{main:content,top:"render_back_navbar"});
         return false;  
      }
  });
  
  $(document).on("click",".item-path",function(e) { 
      var link = $(this).data("path"); 
      var content = $(this).data("mounter");      
      if(link) {
         link = "/" + link;
         FlowRouter.go(link);    
         return false;
      }
      else if(content) {
         var home =$(this).data("home");
         BlazeLayout.render('mainLayout',{main:content,top:"render_back_navbar"});
         return false;  
      }
  }); 
  
  this.find('.content')._uihooks = {
    insertElement: function(node, next) {

      if (initiator === 'single') {
        return $(node).insertBefore(next);  
      }
  
      var start = (initiator === 'back') ? '-100%' : '100%';

      $.Velocity.hook(node, 'translateX', start);
      $(node)
      .insertBefore(next)
      .velocity({translateX: [0, start]}, {
        duration: ANIMATION_DURATION,
        easing: 'ease-in-out',
        queue: false
      });      
    },
    removeElement: function(node) {
      
      if (initiator === 'single') {
        return $(node).remove();
      }
      
      var end = (initiator === 'back') ? '100%' : '-100%';

      $(node)
      .velocity({translateX: end}, {
        duration: ANIMATION_DURATION,
        easing: 'ease-in-out',
        queue: false,
        complete: function() {
          $(node).remove();
        }
      });
    }  
  }
  
});
