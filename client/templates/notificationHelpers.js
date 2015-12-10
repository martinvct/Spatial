if (Meteor.isClient) {
	Template.NotificationsMenu.onCreated(function(){
		var userId = Meteor.userId();
		Template.instance().notifications = function(){
			return Notifications.find({$or: [{userId: userId},{userId: "*"}]});
		}
	});
	Template.NotificationsMenu.helpers({
		/*notifications: function(){
			console.log("recherche notifications");
			
			var notifications = Notifications.find({$or: [{userId: userId},{userId: "*"}]}).fetch();
			console.log("total not :" + Notifications.find({}).count());
			console.log("nbr notifications" + notifications.length);
			//return (_.sortBy(notifications, "datetime")).reverse();
			return notifications;
		}*/
		notifications : function(){ 
			return Template.instance().notifications(); 
		}
	});
	Template.NotificationsMenu.events({
		'click #notificationsToPage':function(){
			Router.go('Notifications');
		}
	});
	Template.NotificationsPage.helpers({
		notifications: function(){
			var userId = Meteor.userId();
			var notifications = Notifications.find({$or: [{userId: userId},{userId: "*"}]}).fetch();
			return (_.sortBy(notifications, "datetime")).reverse();
		}
	});
	Template.NotificationsPage.events({
	});
	Template.Notification.helpers({
		getAvatar: function(userId){
			/*var user = Meteor.user.findOne({_id: userId},{"profile.avatar": 1});
			return user.profile.avatar;*/
			return "avatar";
		},
		getNotificationTexte: function(action, data){
			return action;
		}
	});
}