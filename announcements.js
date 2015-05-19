Groups = new Mongo.Collection("groups");
Announcements = new Mongo.Collection("announcements");
Comments = new Mongo.Collection("comments");

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
}//end of client code

Meteor.methods({
  addAnnouncement: function (text, group) {
    // Make sure the user is logged in
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Announcements.insert({
      text: text,
      group: group,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },

  deleteAnnouncement: function (announcementId) {
    var announcement = Announcements.findOne(announcementId);
    if (announcement.private && announcement.owner !== Meteor.userId()) {
      // If the announcement is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    Announcements.remove(announcementId);
  },
  
  addGroup: function (newGroup) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Groups.insert({
      group: newGroup,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },

  deleteGroup: function (groupId) {
       Groups.remove(groupId);
  },

  addSubscription: function (group) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Meteor.users.update({_id:Meteor.user()._id}, { $addToSet: {subscriptions: group}}); 
  },

  removeSubscription: function (group) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Meteor.users.update({_id:Meteor.user()._id}, { $pull: {subscriptions: group}});    
  },

  addComment: function (text, announcementId) {
    // Make sure the user is logged in
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Comments.insert({
      text: text,
      announcementId: announcementId,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },

  deleteComment: function (commentId) {
    var comment = Comments.findOne(commentId);
    if (comment.private && comment.owner !== Meteor.userId()) {
      // If the announcement is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    Comments.remove(commentId);
  }

});

if (Meteor.isServer) {
   Meteor.publish("announcements", function () {
    return Announcements.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });

   Meteor.publish("groups", function () {
    return Groups.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });

    Meteor.publish("comments", function () {
    return Comments.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });

   //This is publishing all user data, not just subscriptions
   Meteor.publish("subscriptions", function () {
    if (this.userId) {
      return Meteor.users.find({_id: this.userId})
    }
   });

  Accounts.onCreateUser(function(options, user){
    user.subscriptions = [];
    return user;
  });

}