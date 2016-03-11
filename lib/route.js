
FlowRouter.route("/analysis",{
    action: function() {
       BlazeLayout.render("mainLayout",{main:"analysis",top:"navbar"})
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

FlowRouter.route('/analysis_result',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"analysis_result"});        
    }
});

