loggedIn.route('/user/history',{
    name: 'history',
    action: function() {
        BlazeLayout.render('mainLayout',{main:"history",top:"history_navbar"});
    }
});


loggedIn.route('/reset', {
    action: function() {
        BlazeLayout.render('mainLayout',{main:"reset"});
    }
});


loggedIn.route('/checkname/list',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"application"});
    }
});

loggedIn.route('/status',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"application_content"});
    }
});

loggedIn.route('/checkname/create',{
    action: function() {
        BlazeLayout.render('mainLayout',{main:"application_create"});   
    }  
});