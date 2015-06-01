
Template.registerHelper('isOwner', function() {
	return this.owner === Meteor.userId();
});

Template.registerHelper('isAdmin', function() {
if (Meteor.user().username === "admin") {
  return true;
 }
 else if (Meteor.users.find({_id: Meteor.user()._id, groupAdmins: 'siteAdmin'}).count() === 1) {
  console.log("siteAdmin");
  return true;
 }

 else {
  return false;
 }
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

Template.registerHelper('manageUserSubscribed', function() {
  if (Meteor.users.find({username: this.username, subscriptions: Session.get('manageUsers')}).count() === 1)  {
         return true;
  }
  else {
        return false;
      }
});

Template.registerHelper('manageUserMembership', function() {
  if (Meteor.users.find({username: this.username, memberships: Session.get('manageUsers')}).count() === 1) {
    return true;
  }
  else {
    return false;
  }
});

Template.registerHelper('isMember', function() {
  if (Meteor.users.find({_id: Meteor.user()._id, memberships: this.group}).count() === 1){
        return true;
      }
      else {
        return false;
      }
});

Template.registerHelper('privateAnnouncement', function() {
  if (Announcements.find({_id: this._id, privateAnnouncement: true}).count() === 1){
        return true;
      }
      else {
        return false;
      }
});

Template.registerHelper('publicAnnouncement', function() {
  if (Announcements.find({_id: this._id, privateAnnouncement: false}).count() === 1){
        return true;
      }
      else {
        return false;
      }
});

Template.registerHelper('membershipRequested', function() {
  if (Meteor.users.find({username: this.username, membershipRequests: Session.get('manageUsers')}).count() === 1){
        return true;
      }
      else {
        return false;
      }
});

Template.registerHelper('isGroupAdmin', function() {
  if (Meteor.users.find({_id: Meteor.user()._id, groupAdmins: this.group}).count() === 1){
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
    return Announcements.find({group: displayGroup}, {sort: {lastModified: -1}});
});

Template.registerHelper('announcementsAll', function() {
    return Announcements.find({}, {sort: {lastModified: -1}});
});

Template.registerHelper('commentsAll', function() {
	return Comments.find({}, {sort: {createdAt: -1}});
});

Template.registerHelper('userData', function() {
  return Meteor.users.find({})
});