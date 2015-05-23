
Template.registerHelper('isOwner', function() {
	return this.owner === Meteor.userId();
});

Template.registerHelper('hasRights', function() {
	if (this.owner === Meteor.userId() || Meteor.user().username === "admin"){
         return true;
    }
});

Template.registerHelper('subscribed', function() {
	if (Meteor.users.find({_id: Meteor.user()._id, subscriptions: this.group}).count() === 1){
        return true;
      }
      else {
        return false;
      }
});

Template.registerHelper('groups', function() {
	return Groups.find({}, {sort: {createdAt: -1}});
});

Template.registerHelper('comments', function() {
	return Comments.find({announcementId: this._id}, {sort: {createdAt: 1}});
});

Template.registerHelper('announcementsByGroup', function() {
	var displayGroup = this.group;
    return Announcements.find({group: displayGroup}, {sort: {createdAt: -1}});
});

Template.registerHelper('announcementsAll', function() {
	//var currentUser = Meteor.users.find({_id: Meteor.user()._id});
	//var displayGroups = this.user.subscriptions;
	
	//var displayGroups = Meteor.user()._id.subscriptions; //doesn't work
	//var displayGroups = Meteor.users.profile.subscriptions;
	//console.log(displayGroups);
	//var displayGroups = ['Robotics Team', 'Earth Club'];
    return Announcements.find({}, {sort: {createdAt: -1}});
});