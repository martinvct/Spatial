Notifications = new Mongo.Collection('notifications');



Meteor.methods({
	/**
	* Ajoute une notification
	* @params : action (String identifiant l'action notifiée qui doit exister dans list-actions.js)
	*          target (Soit "*" pour cibler tous les utilisateurs, soit ObjectID de l'utilisateur ciblé)
	*          data (Object variable contenant différents informations nécessaires à la rédaction de la notification)
	* @return : none 
	*/
	throwNotification: function(action, target, data){
		/*console.log(action + " (" + ListActions.length + ", " + ListActions.indexOf(action) +")");
		
		IsAction = Match.Where(function(a){
			return (ListActions.indexOf(a) != -1);
		});
		try {
			check(action, IsAction);
			check(target, String);
			check(data, Match.Optional(Object));
		} catch(e){
			return throwError("bad-parameters", "Fonction thrownotification : mauvais arguments");
		}
		*/
		console.log("notification-d");
		//Notifications.insert({datetime: new Date(), action: action, userId: target, data: data});
		console.log("notification-f");
	
	},

	/**
	* Recherche les notifications destinées à l'utilisateur courant
	* @params : all (Boolean indiquant s'il faut également aller chercher les notifications antérieures à la dernière authentification)
	* @return : Objects Notification
	*/
	getNotifications: function(all){
		try {
			check(all, Match.Optional(Boolean));
		} catch(e){
			return throwError("bad-parameters", "Fonction getNotifications : mauvais arguments");
		}	
		var user      = Meteor.user();
  		if (all) {
  			return Notifications.find({$or: [{userId: user._id}, {userId: "*"}]}).sort({datetime: -1});
  		} else {
  			return Notifications.find({datetime: {$gte: user.profile.lastLogin}, $or: [{userId: user._id}, {userId: "*"}]}).sort({datetime: -1});
  		}
	}
});
//TODO : faire un système qui va rechercher les x dernières notifications, + pager pour voir les suivantes


