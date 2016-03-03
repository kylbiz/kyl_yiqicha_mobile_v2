Template.application.onCreated(function(){
    Session.set("editor",false);  
    var self = this;
    self.autorun(function() {
      var userId = Meteor.userId();
      self.subscribe("getCheckLists", userId);
    })
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
  },
  "checkLists": function() {
    return CheckName.find({userId: Meteor.userId()}) || [];
  }
})

Template.application.events({
  "click li.item-content.edit":function(e){
    var box = $(e.currentTarget).find("input[type='checkbox']").first();    
    var checked = (!box.prop("checked"));
    $(box).prop("checked",checked);
  }
})