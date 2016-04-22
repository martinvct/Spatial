if (Meteor.isClient) {
	Template.NotificationsMenu.onCreated(function(){
		var userId = Meteor.userId();
		Template.instance().notifications = function(){
			var notifications = Notifications.find({$or: [{userId: userId},{userId: "*"}]}).fetch();
			return (_.sortBy(notifications, "datetime")).reverse();
		}
	});
	Template.NotificationsMenu.helpers({
		notifications : function(){ 
			return Template.instance().notifications(); 
		}
	});
	Template.NotificationsMenu.events({
		'click #notificationsToPage':function(){
			Modal.hide("NotificationsMenu");
			Router.go('Notifications');

		},
		'click .lienPartie': function(){
			//console.log(this);
			Modal.hide("NotificationsMenu");
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
		'click .lienPartie': function(){
			//console.log(this);
			Router.go('Partie', {_scenarioId: this.data.scenarioId, _id: this.data.partieId});
		}
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