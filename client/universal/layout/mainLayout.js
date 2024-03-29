BlazeLayout.setRoot('body');

Session.setDefault("title", "企业自助查询系统");

var ANIMATION_DURATION = 300;

nextInitiator = null;
initiator = null;


FromCenter = null;
isFromCenter = null;

Session.setDefault("isFromCenter",false);

Tracker.autorun(function() {
  FlowRouter.watchPathChange();
  var currentContext = FlowRouter.current();  
  initiator = nextInitiator;
  nextInitiator = null;
  
  FromCenter = isFromCenter;
  isFromCenter = null;
  
  Session.set("isFromCenter",(FromCenter=="isFromCenter")); 
});

mainApp = {}

mainApp.alert=function(object) {
  var object ={title:object};
  var template = Blaze.toHTMLWithData(Template.alertTemplate,object);
  $("#Mount").html(template);
  
  var alertBox=$('#alert');
  alertBox.modal('show');
  alertBox.on('hide.bs.modal',function(event) {
    $(event.currentTarget).detach();
  });
}

mainApp.myPrompt = function(object,text){
  var field = $(object).closest(".field").addClass("error");  
  var tmp = $(field).find(".prompt");
  if ($(tmp).first().text()==text) {
    mainApp.alert(text);
    return false;
  }
  tmp.remove();
  var prompt= $('<div/>')                                                                                  
        .addClass('ui basic red pointing prompt label')                                                         
        .html(text).appendTo(field);   
}

mainApp.removePrompt = function(object){
  //$('[name="' + object +'"]')  
  var field = $(object).closest(".field").addClass("error");  
  field.removeClass("error");
  field.find(".prompt").remove();  
}



Template.mainLayout.confirm=function(object) {
  var template = Blaze.toHTMLWithData(Template.confirmTemplate,object);
  $("#Mount").html(template);
  
  var confirmBox=$('#confirm');
  confirmBox.modal('show');
  confirmBox.on('hide.bs.modal',function(event) {
    $(event.currentTarget).detach();
  });

  return {
      on: function (callback) {
          if (callback && callback instanceof Function) {
              confirmBox.find('#dialogSuccess').click(function () { callback(true);  confirmBox.modal('hide'); });
              confirmBox.find('#dialogCancel').click(function () { callback(false); confirmBox.modal('hide'); });
          }
      }
  }  
}

Template.mainLayout.select= function(object) {
  
  // object = {
  //   title: "标题",
  //   options: [
  //     {name: "name", value="value"}
  //   ]
  // }
  
  var template = Blaze.toHTMLWithData(Template.selectTemplate, object);
  $("#Mount").html(template);
  
  var selectBox=$('#select');
  selectBox.modal('show');
  selectBox.on('hide.bs.modal',function(event) {
    $(event.currentTarget).detach();
  });

  return {
      on: function (callback) {
          if (callback && callback instanceof Function) {          
              selectBox.find('#dialogSuccess').click(function () { 
                var value = selectBox.find("button.tab-link.active").data("value") || null;
                callback(true, value);  
                selectBox.modal('hide');               
              });
              selectBox.find('#dialogCancel').click(function () { 
                callback(false, null); 
                selectBox.modal('hide'); 
              });
          }
      }
  }    
}

$(document).on("click","#select button.tab-link",function(){
  $(this).addClass("active").siblings().removeClass("active");
});

Template.mainLayout.onRendered(function(){
        
  $(document).on("click", ".tab-item", function(e) {
    var $target = $(e.currentTarget);
    if(!$target.hasClass("tab-link")) {
      $target.parent().find(".active").removeClass("active");
      $target.addClass("active");
    }
//    if($target.parent().hasClass("bar-tab")) {
//      nextInitiator ="single";       
//    }
  });
  
  $(document).on("click", ".main-tab .tab-link", function(e) {
    initiator ="single"; 
//      e.stopImmediatePropagation();
//      e.preventDefault();      
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
      if(link=="message") {
        isFromCenter="isFromCenter";
      }
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
  
  this.find('.page')._uihooks = {
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
  
  this.find('.bar-nav')._uihooks = {
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
  };
  
  this.find('.content')._uihooks = {
    insertElement: function(node, next) {
//      console.log(initiator);
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
