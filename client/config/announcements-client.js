//This code only runs on the client
    Meteor.subscribe("announcements");
    Meteor.subscribe("groups");
    Meteor.subscribe("comments");
    Meteor.subscribe("userData");
    Meteor.subscribe("roles");

    //all user data is published in server file, not just subscriptions
    Meteor.subscribe("subscriptions");
    
    Session.set('manageSubscriptions', 'closed');
    Session.set('manageUsers', 'closed');
    Session.set('showAnnouncements', 'open');
    Session.set('selectedGroup', 'liveFeed');
  
    Accounts.ui.config({
      passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
    });




