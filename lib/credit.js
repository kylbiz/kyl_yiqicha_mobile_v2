FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render('mainLayout',{main:"home",top:"navbar"});
    }
});


FlowRouter.route('/credit/lists',{
    
    action: function() {
        BlazeLayout.render('mainLayout',{main:"search_list",top:"filter_navbar"});        
    }
});

FlowRouter.route('/credit/detail',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"search_result"});        
    }
});