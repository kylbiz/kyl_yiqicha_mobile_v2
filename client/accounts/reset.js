Template.reset.onCreated(function(){
  Session.set('codeTime', 0);
});

Template.reset.helpers({
  'codeTime': function(){
   return Session.get('codeTime');
  }
});

Template.reset.events({
  "click #send":function(){    
		Session.set('codeTime', 60);     
  }
})

Template.reset.onRendered(function(){
  clearInterval();   
  setInterval(function() {     
    if (Session.get('codeTime') > 0) {
      Session.set('codeTime', Session.get('codeTime') - 1);
    }
  }, 1000);   
})