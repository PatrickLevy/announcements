  //This code only runs on the client
  Template.announcement.helpers({
    displayGroup: function () {
      return true;
    },

  });

  Template.comment.helpers({
    //put helpers here
  });

  Template.announcement.events({
    "submit .new-comment": function (event) {
      var text = event.target.text.value;
      var announcementId = this._id;
      var announcementGroup = this.group;
      Meteor.call("addComment", text, announcementId, announcementGroup);

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    }

  });

  Template.group.helpers({
    // put helpers here

  });

  Template.body.helpers({
    isAdmin: function () {
      return (Meteor.user().username === "admin");           
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
    },

    groupSelect: function () {
      if (Session.get('selectedGroup') === this.group){
        return true;
      }
      else {
        return false;
      }
    },

    liveFeed: function () {
      if (Session.get('selectedGroup') === 'liveFeed'){
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
    },

    "click .group-select": function () {
      Session.set('selectedGroup', this.group);
    },

    "click .live-feed": function () {
      Session.set('selectedGroup', 'liveFeed');
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