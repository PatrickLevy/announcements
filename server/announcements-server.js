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

   //This is publishing all user data, not just subscriptions!!
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