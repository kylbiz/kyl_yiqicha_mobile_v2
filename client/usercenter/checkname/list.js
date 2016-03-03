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
    return CheckName.find({userId: Meteor.userId(), removed: false}) || [];
  }
})

Template.application.events({
  "click li.item-content.edit":function(e){
    var box = $(e.currentTarget).find("input[type='checkbox']").first();    
    var checked = (!box.prop("checked"));
    $(box).prop("checked",checked);
  },
  "click #delete": function(event) {
    if(!Meteor.userId()) {
      FlowRouter.go("login");
    } else {
      var userId = Meteor.userId();
      var deleteListsObj = $(".deleteCheck :checked");

      var deleteLists = [];

      deleteListsObj.each(function(index, element) {
        var deleteId = $(element).attr("data-checkid");
        deleteLists.push({deleteId: deleteId})
      })

      var options = {
        userId: userId,
        deleteLists: deleteLists
      };

      Meteor.call("RemoveCheckName", options);
    }
  }
})

