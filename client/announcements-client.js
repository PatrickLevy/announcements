

if (Meteor.isClient) {
  // This code only runs on the client
    Meteor.subscribe("announcements");
    Meteor.subscribe("groups");
    Meteor.subscribe("subscriptions");
    Meteor.subscribe("comments");

    Session.set('manageSubscriptions', 'closed');
    Session.set('showAnnouncements', 'open')
  
  Template.announcement.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    },

    hasRights: function () {
      if (this.owner === Meteor.userId() || Meteor.user().username === "admin"){
        return true;
      }
    },

    subscribed: function () {
      if (Meteor.users.find({_id: Meteor.user()._id, subscriptions: this.group}).count() === 1){
        return true;
      }
      else {
        return false;
      }
    },

    displayGroup: function () {
      return true;
    },

    comments: function () {
      console.log("function called");
      var displayAnnouncement = this.announcement;
      console.log(displayAnnouncement);
      return Comments.find({announcementId: this._id}, {sort: {createdAt: 1}}); 
    },

  });

  Template.comment.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    },

    hasRights: function () {
      if (this.owner === Meteor.userId() || Meteor.user().username === "admin"){
        return true;
      }
    }
  });

  Template.announcement.events({
    "submit .new-comment": function (event) {
      var text = event.target.text.value;
      var announcementId = this._id;
      Meteor.call("addComment", text, announcementId);

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    }


  });

  Template.group.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    },

    hasRights: function () {
      if (this.owner === Meteor.userId() || Meteor.user().username === "admin"){
        return true;
      }
    },

    subscribed: function () {
      if (Meteor.users.find({_id: Meteor.user()._id, subscriptions: this.group}).count() === 1){
        return true;
      }
      else {
        return false;
      }
    }
  });

  Template.body.helpers({
    announcements: function () {
      var displayGroup = this.group;
      return Announcements.find({group: displayGroup}, {sort: {createdAt: -1}});  
    },

    groups: function () {
        return Groups.find({}, {sort: {createdAt: -1}});
    },


    isAdmin: function () {
      return (Meteor.user().username === "admin");           
    },

    subscribed: function () {
      if (Meteor.users.find({_id: Meteor.user()._id, subscriptions: this.group}).count() === 1){
        return true;
      }
      else {
        return false;
      }
    },

    showManageSubscriptions: function () {
      if (Session.get('manageSubscriptions') === 'open'){
        return true;
      }
      else {
        return false;
      }
    },

    showAnnouncements: function () {
      if (Session.get('showAnnouncements') === 'open'){
        return true;
      }
      else {
        return false;
      }
    }

  });

  Template.body.events({
    "submit .new-announcement": function (event) {
      var text = event.target.text.value;
      var group = this.group;
      Meteor.call("addAnnouncement", text, group);

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },

    "submit .new-group": function (event) {
      var newGroup = event.target.text.value;
      Meteor.call("addGroup", newGroup);

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },

    "click .manage-subscriptions": function () {
      if (Session.get('manageSubscriptions') === 'closed') {
        Session.set('manageSubscriptions', 'open');
        Session.set('showAnnouncements', 'closed');
      }
      else {
        Session.set('manageSubscriptions', 'closed');
        Session.set('showAnnouncements', 'open');
      }
    }

  });

  Template.announcement.events({
    "click .delete": function () {
      Meteor.call("deleteAnnouncement", this._id);
    }

  });

  Template.group.events({
    "click .delete-group": function () {
      Meteor.call("deleteGroup", this._id);
    },

    "click .toggle-subscribe": function () {
      if (Meteor.users.find({_id: Meteor.user()._id, subscriptions: this.group}).count() === 0){
        Meteor.call("addSubscription", this.group);
      }
      else {
        Meteor.call("removeSubscription", this.group);
      }
    }

  });

  Template.comment.events({
    "click .delete-comment": function () {
      Meteor.call("deleteComment", this._id);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
} //end of client code



