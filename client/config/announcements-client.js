
  // This code only runs on the client
    Meteor.subscribe("announcements");
    Meteor.subscribe("groups");
    Meteor.subscribe("subscriptions");
    Meteor.subscribe("comments");

    Session.set('manageSubscriptions', 'closed');
    Session.set('showAnnouncements', 'open');
    Session.set('selectedGroup', 'liveFeed');
  
    Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });




