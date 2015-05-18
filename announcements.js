Groups = new Mongo.Collection("groups");
Announcements = new Mongo.Collection("announcements");

if (Meteor.isClient) {
  // This code only runs on the client
    Meteor.subscribe("announcements");
    Meteor.subscribe("groups");
    Meteor.subscribe("subscriptions");

    //Add some hard coded subscriptions
    //var newSub = "Hmong Club";
    //Meteor.call("addSubscription", newSub);


  Template.announcement.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    },

    hasRights: function () {
      if (this.owner === Meteor.userId() || Meteor.user().username === "admin"){
        return true;
      }
    },

    //Not used:
    subscribed: function () {
      //console.log (Meteor.users.find({_id: Meteor.user()._id, subscriptions: this.group}).count());
      if (Meteor.users.find({_id: Meteor.user()._id, subscriptions: this.group}).count() === 1){
        return true;
      }
      else {
        return false;
      }
    },

    //remove this?
    displayGroup: function () {
      return true;
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
      //console.log (Meteor.users.find({_id: Meteor.user()._id, subscriptions: this.group}).count());
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
      //console.log(displayGroup);
      //var displayGroup = "robotics";
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter announcements
        return Announcements.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the announcements
        return Announcements.find({group: displayGroup}, {sort: {createdAt: -1}});
      }
    },
    groups: function () {
        return Groups.find({}, {sort: {createdAt: -1}});
      
    },

    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return Announcements.find({checked: {$ne: true}}).count();
    },
    isAdmin: function () {
      //console.log (Meteor.user().username);
      //to avoid errors in the console see: https://github.com/mizzao/meteor-user-status/issues/58

      //var user = Meteor.users.findOne({_id: this.userId});
      //if (user.username === "admin" && user.status.online){
      //  return true;
      //}
      return (Meteor.user().username === "admin");           
    },
    subscribed: function () {
      //console.log (Meteor.users.find({_id: Meteor.user()._id, subscriptions: this.group}).count());
      if (Meteor.users.find({_id: Meteor.user()._id, subscriptions: this.group}).count() === 1){
        return true;
      }
      else {
        return false;
      }
    }


  });

  Template.body.events({
    "submit .new-announcement": function (event) {
      // This function is called when the new task form is submitted
      var text = event.target.text.value;
      var group = this.group;

      Meteor.call("addAnnouncement", text, group);

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },

    "submit .new-group": function (event) {
      // This function is called when the new task form is submitted
      var newGroup = event.target.text.value;

      Meteor.call("addGroup", newGroup);

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;

    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.announcement.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call("setChecked", this._id, ! this.checked);
    },
    "click .delete": function () {
      Meteor.call("deleteAnnouncement", this._id);
    }

    //"click .toggle-private": function () {
    //  Meteor.call("setPrivate", this._id, ! this.private);
    //}

    

  });

  Template.group.events({
    "click .delete-group": function () {
      Meteor.call("deleteGroup", this._id);
    },

    "click .toggle-subscribe": function () {
      //console.log(this.group);
      Meteor.call("addSubscription", this.group);
    }

  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}//end of client code

Meteor.methods({
  addAnnouncement: function (text, group) {
    // Make sure the user is logged in before inserting a task
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
  
  setChecked: function (announcementId, setChecked) {
    var announcement = Announcements.findOne(announcementId);
    if (announcement.private && announcement.owner !== Meteor.userId()) {
      // If the announcement is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }
    Announcements.update(announcementId, { $set: { checked: setChecked} });
  },

  setPrivate: function (announcementId, setToPrivate) {
  var announcement = Announcements.findOne(announcementId);

    // Make sure only the announcement owner can make an announcement private
    if (announcement.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Announcements.update(announcementId, { $set: { private: setToPrivate } });
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
    //var group = Groups.findOne(groupId);
    //if (group.private && group.owner !== Meteor.userId()) {
      // If the group is private, make sure only the owner can delete it
    //  throw new Meteor.Error("not-authorized");
    //}
    Groups.remove(groupId);
  },

  addSubscription: function (group) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    //console.log("Trying to add new subscription");
    
    //this might be right?
    Meteor.users.update({_id:Meteor.user()._id}, { $addToSet: {subscriptions: group}});
    


    //console.log(Meteor.user().subscriptions);
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