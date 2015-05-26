
  // This code only runs on the client
    Meteor.subscribe("announcements");
    Meteor.subscribe("groups");
    
    //all user data is published in server file, not just subscriptions
    Meteor.subscribe("subscriptions");
    
    Meteor.subscribe("comments");

    Meteor.subscribe("userData");

    Session.set('manageSubscriptions', 'closed');
    Session.set('manageUsers', 'closed');
    Session.set('showAnnouncements', 'open');
    Session.set('selectedGroup', 'liveFeed');
  
    Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
  });




