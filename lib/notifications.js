Notifications = new Mongo.Collection('notifications');


//https://www.discovermeteor.com/blog/template-level-subscriptions/

if(Meteor.isServer){
  Meteor.publish("getLastNotifications", function(){
    var user = this.userId;
    if (!(user)) { return throwError("privilege_user", TAPi18n.__("error.privilege_user")); }
    return Notifications.find({$or: [{userId: user}, {userId: "*"}]},{sort: {datetime: -1}, limit: 10}); 
  });
  Meteor.publish("getNotifications", function(){
    var user = this.userId;
    if (!(user)) { return throwError("privilege_user", TAPi18n.__("error.privilege_user")); }
    return Notifications.find({$or: [{userId: user}, {userId: "*"}]},{sort: {datetime: -1}}); 
  });
}

Meteor.methods({
	/**
	* Ajoute une notification
	* @params : action (String identifiant l'action notifiée qui doit exister dans list-actions.js)
	*          target (Soit "*" pour cibler tous les utilisateurs, soit ObjectID de l'utilisateur ciblé)
	*          data (Object variable contenant différents informations nécessaires à la rédaction de la notification)
	* @return : none 
	*/
	throwNotification: function(action, target, data){
		//console.log(action + " (" + ListActions.length + ", " + ListActions.indexOf(action) +")");
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
		Notifications.insert({datetime: new Date(), action: action, userId: target, data: data});
		if(userId != "*"){
			Meteor.users.update({_id: userId},{$inc: {"profile.nNotifications": 1}});
		} else {
			Meteor.users.update({},{$inc: {"profile.nNotifications": 1}},{multi: true});
		}
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

throwError = function(error, reason, details){
	var meteorError = new Meteor.Error(error, reason, details);
	if(Meteor.isClient){
		sAlert.error(meteorError.reason);
		return meteorError;
	} else if (Meteor.isServer){
		throw meteorError;
	}
}

ListActions = [
	"CARTE-ACTIVE",
	"CARTE-DEL", 
	"CARTE-NEW", 
	"CARTE-UPD",
	"DECK-ADD",
	"DECK-REM",
	"EVENT-ACTIVE",
	"EVENT-DEL", 
	"EVENT-NEW",
	"EVENT-PUT", 
	"EVENT-UPD",
	"EXPERT-CALL",
	"EXPERT-NOCALL-BUDGET",
	"EXPERT-NOMORECALL",
	"PARTIE-DEL",
	"PEER-CALL",
	"PEER-NOCALL-BUDGET",
	"PEER-NOMORECALL",
	"PEER-STILLCALL",
	"PEER-TOOLATE",
	"SCENAR-NEW",
	"SCENAR-UPD",
	"USER-CALL",
	"USER-MSG",
	"USER-NOCALL-BUDGET"
];
getNotificationAvatar = function(action, data){
	var result ="";
	if(data.user && data.user.avatar){
		result = data.user.avatar;
	} else {
		result = "/defaultAvatar.png";
	}
	return result;
}
getNotificationString = function(action, data){
	var result = "";
	console.log(data);
	if(data.user){
		if(Meteor.userId() && (Meteor.userId() == data.user.userId)) {
			result += TAPi18n.__("notification.vousAvez");
		} else {
			result = data.user.firstname+" "+data.user.lastname+" ("+data.username+") "+ TAPi18n.__("notification.ilA");
		}	
	}
	switch(action){
		case "CARTE-ACTIVE":
			if(data.carte.active){
				result += TAPi18n.__("notification.carte-active", { intitule: data.carte.intitule.fr, carteId: data.carte.carteId } );
			} else {
				result += TAPi18n.__("notification.carte-unactive", { intitule: data.carte.intitule.fr, carteId: data.carte.carteId } );
			}
			break;
		case "CARTE-DEL":
			result += TAPi18n.__("notification.carte-del", { intitule: data.carte.intitule.fr, carteId: data.carte.carteId } );
			break; 
		case "CARTE-NEW":
			result += TAPi18n.__("notification.carte-new", { intitule: data.carte.intitule.fr, carteId: data.carte.carteId } );
			break; 
		case "CARTE-UPD":
			result += TAPi18n.__("notification.carte-upd", { intitule: data.carte.intitule.fr, carteId: data.carte.carteId } );
			break;
		case "DECK-ADD":

			result += TAPi18n.__("notification.deck-add", { intitule: data.intitule.fr, carteId: data.carteId, partie: data.nom, partieId: data.partieId, scenarioId: data.scenarioId } );
			break;
		case "DECK-REM":

			break;
		case "EVENT-ACTIVE":
			break;
		case "EVENT-DEL":
			break; 
		case "EVENT-NEW":
			break;
		case "EVENT-PUT":
			break; 
		case "EVENT-UPD":
			break;
		case "EXPERT-CALL":
			break;
		case "EXPERT-NOCALL-BUDGET":
			break;
		case "EXPERT-NOMORECALL":
			break;
		case "PARTIE-DEL":
			break;
		case "PEER-CALL":
			break;
		case "PEER-NOCALL-BUDGET":
			break;
		case "PEER-NOMORECALL":
			break;
		case "PEER-STILLCALL":
			break;
		case "PEER-TOOLATE":
			break;
		case "SCENAR-NEW":
			break;
		case "SCENAR-UPD":
			break;
		case "USER-CALL":
			break;
		case "USER-MSG":
			break;
		case "USER-NOCALL-BUDGET":
			break;	
	}

	return result;

}