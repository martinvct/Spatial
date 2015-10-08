Notifications = new Mongo.Collection('notifications');



Meteor.methods({
	throwNotification: function(action, target, data){
		console.log(action + " (" + ListActions.length + ", " + ListActions.indexOf(action) +")");
		IsAction = Match.Where(function(a){
			return (ListActions.indexOf(a) != -1);
		});
		check(action, IsAction);
		check(target, Match.OneOf(String, Meteor.Collection.ObjectId));
		check(data, Match.Optional(Object));

		Notifications.insert({datetime: new Date(), action: action, userId: target, data: data});

	},
	getNotifications: function(all){
		check(all, Match.Optional(Boolean));
		var user      = Meteor.user();
  		if (all) {
  			return Notifications.find({$or: [{userId: user.userId}, {userId: "*"}]}).sort({datetime: -1});
  		} else {
  			return Notifications.find({datetime: {$gte: user.profile.lastLogin}, $or: [{userId: user.userId}, {userId: "*"}]}).sort({datetime: -1});
  		}
	}
});
//TODO : faire un pager pour les notifications quand on les affiche 