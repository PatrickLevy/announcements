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
      lastModified: new Date(),
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

  addComment: function (text, announcementId, announcementGroup) {
    // Make sure the user is logged in
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Comments.insert({
      text: text,
      announcementId: announcementId,
      group: announcementGroup,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
    //update announcement's lastModified field to when the comment was made
    Announcements.update({_id: announcementId}, {$set: {lastModified: new Date()}});

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