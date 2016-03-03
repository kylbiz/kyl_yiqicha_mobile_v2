Template.application.onCreated(function(){
    Session.set("editor",false);    
});

Template.application.onRendered(function(){
   var object = {
     title: "选择类型",
     options: [{name:"单独增加",value:"1"},{name:"批量增加",value:"2"}]     
   };   
  
  $("#create").click(function(){
      FlowRouter.go('/create');   
//      Template.mainLayout.select(object).on(function (e,value) {
//          if(e){
//            if(value==1) {        
//               //单独增加
//               FlowRouter.go('/create');   
//            }
//            else if(value==2) {
//               //批量增加
//               FlowRouter.go('/factory');         
//            }
//          }
//      });  
    
  });
  
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