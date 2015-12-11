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
		},
		'click .lienPartie': function(){
			//console.log(this);
			Router.go('Partie', {_scenarioId: this.data.scenarioId, _id: this.data.partieId});
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
		getAvatar: function(action, data){
			//console.log(action);
			//console.log(data);
			return getNotificationAvatar(action, data);
		},
		getNotificationTexte: function(action, data){
			return getNotificationString(action, data);
		}
	});
}