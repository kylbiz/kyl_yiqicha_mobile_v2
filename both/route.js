FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render('mainLayout',{main:"home",top:"navbar"});
    }
});

FlowRouter.route("/analysis",{
    action: function() {
       BlazeLayout.render("mainLayout",{main:"analysis",top:"navbar"})
    }
});

FlowRouter.route('/message', {
    action: function() {
        BlazeLayout.render('mainLayout',{main:"message",top:"message_navbar"});
    }
});

FlowRouter.route('/usercenter', {
    action: function() {
        BlazeLayout.render('mainLayout',{main:"usercenter",top:"navbar"});
    }
});

FlowRouter.route('/account',{
    action: function() {
        BlazeLayout.render("mainLayout",{main:"account",top:"navbar"});
    }
});

FlowRouter.route('/login', {
    action: function() {
        BlazeLayout.render('mainLayout',{main:"login"});
    }
});

FlowRouter.route('/register', {
    action: function() {
        BlazeLayout.render('mainLayout',{main:"register"});
    }
});

FlowRouter.route('/reset', {
    action: function() {
        BlazeLayout.render('mainLayout',{main:"reset"});
    }
});

FlowRouter.route('/modify', {
    action: function() {
        BlazeLayout.render('mainLayout',{main:"modify"});
    }
});

FlowRouter.route('/about',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"about",back:"usercenter"});
    }
});

FlowRouter.route('/userinfo',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"userinfo",back:"usercenter"});
    }
});

FlowRouter.route('/history',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"history",top:"history_navbar"});
    }
});

FlowRouter.route('/nomatch',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"nomatch",top:"filter_navbar"});
    }
});

FlowRouter.route('/analysis_list',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"analysis_list",top:"search_navbar"});        
    }
});

FlowRouter.route('/search_list',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"search_list",top:"filter_navbar"});        
    }
});

FlowRouter.route('/search_result',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"search_result"});        
    }
});

FlowRouter.route('/analysis_result',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"analysis_result"});        
    }
});

FlowRouter.route('/application',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"application"});
    }
});

FlowRouter.route('/status',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"application_content"});
    }
});

FlowRouter.route('/empty',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"application_empty",noToolbar:"true"});
    }
});

FlowRouter.route('/create',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"application_create"});   
    }  
});

FlowRouter.route('/factory',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"application_create_group"});     
    }  
});

FlowRouter.triggers.exit([
      function(context) {
         Session.set('fromWhere', context.path);
      }
   ]
);