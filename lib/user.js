loggedIn.route('/user/history',{
    name: 'history',
    action: function() {
        BlazeLayout.render('mainLayout',{main:"history",top:"history_navbar"});
    }
});