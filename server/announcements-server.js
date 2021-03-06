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

    Meteor.publish(null, function (){ 
      return Meteor.roles.find({})
    });

   //This is publishing all user data, not just subscriptions!!
   Meteor.publish("subscriptions", function () {
    if (this.userId) {
      return Meteor.users.find({_id: this.userId})
    }
   });

   //Publish all user data
   Meteor.publish("userData", function () {
    if (this.userId) {
      return Meteor.users.find({})
    }
   });

  //Check publishing of this data!
  Accounts.onCreateUser(function(options, user){
    
    //automatically subscribe new users to school
    user.subscriptions = ['School'];
    user.memberships = [];
    user.groupAdmins = [];
    user.membershipRequests = [];
    return user;
  });

  //Automatically create a group called 'School'
  //Groups.insert({
  //    group: 'School',
  //    createdAt: new Date(),
  //    owner: 'admin',
  //    username: 'admin'
  //  });

}