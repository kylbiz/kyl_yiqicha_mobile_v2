Template.application.onCreated(function(){
    Session.set("editor",false);    
});

Template.application.onRendered(function(){
   var object = {
     title: "选择类型",
     options: [{name:"单独增加",value:"1"},{name:"批量增加",value:"2"}]     
   };   
    
  $(document).on("click","#editor",function(){
        Session.set("editor",true);  
  });

  $(document).on("click","#cancel",function(){
        Session.set("editor",false);  
  });
  
  $(document).on("click","#delete",function(){
        //dosomething...
        Session.set("editor",false); 
  });  

});

Template.application.helpers({
  'editor':function(){
    return Session.get("editor");
  }
})