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
     manageGroupUsers: function () {
      if (Session.get('manageUsers') === this.group){
        return true;
      }
      else {
        return false;
      }

    },

  });

  Template.settings.helpers({
    // put helpers here
     showAllUsers: function () {
      if (Session.get('manageUsers') === 'all'){
        return true;
      }
      else {
        return false;
      }

    },

  });

  Template.settings.events({
    "click .showAllUsers": function () {
      if (Session.get('manageUsers') === 'all') {
        Session.set('manageUsers', 'closed');
      }
      else {
        Session.set('manageUsers', 'all');
      }
    },
  });

  Template.body.helpers({
    

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
      var privateAnnouncement = !(document.getElementById("publicCheckbox").checked);
      Meteor.call("addAnnouncement", text, group, privateAnnouncement);

      // Clear checkbox
      document.getElementById("publicCheckbox").checked = false;

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
        Session.set('manageUsers', 'closed');
      }
    },

    "click .group-select": function () {
      Session.set('selectedGroup', this.group);
    },

    "click .manage-users": function () {
      if (Session.get('manageUsers') === this.group) {
        Session.set('manageUsers', 'closed');
      }
      else {
        Session.set('manageUsers', this.group);
      }
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
    },

    "click .request-membership": function () {
      if (Meteor.users.find({username: Meteor.user().username, memberships: this.group}).count() === 0){
        Meteor.call("addMembershipRequest", Meteor.user().username, this.group);
        //automatically subscribe them too
        Meteor.call("addSubscription", this.group);
      }
      else {
        Meteor.call("removeMembership", Meteor.user().username, this.group);
        Meteor.call("removeSubscription", this.group);
      }
    }

  });

  Template.showUserList.events({
    "click .membership": function () {
      if (Meteor.users.find({username: this.username, memberships: Session.get('manageUsers')}).count() === 0){
        Meteor.call("addMembership", this.username, Session.get('manageUsers'));
      }
      else {
        Meteor.call("removeMembership", this.username, Session.get('manageUsers'));
      }
    }


  });

Template.showAllUsersList.events({
    "click .admin-button": function () {
      Meteor.call("addAdmin", this.username);
      console.log(this.username);
    }


  });
  Template.comment.events({
    "click .delete-comment": function () {
      Meteor.call("deleteComment", this._id);
    }
  });
