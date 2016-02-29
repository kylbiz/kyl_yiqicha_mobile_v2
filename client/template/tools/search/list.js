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

Template.search_list.helpers({
  'count':function(){
      return Session.get("count");    
  }
});