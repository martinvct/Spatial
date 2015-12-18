Notifications = new Mongo.Collection('notifications');


//https://www.discovermeteor.com/blog/template-level-subscriptions/

if(Meteor.isServer){
  Meteor.publish("getLastNotifications", function(){
    var user = this.userId;
    if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
    return Notifications.find({$or: [{userId: user}, {userId: "*"}]},{sort: {datetime: -1}, limit: 10}); 
  });
  Meteor.publish("getNotifications", function(){
    var user = this.userId;
    if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
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
			return throwAlert("error","bad-parameters", "Fonction thrownotification : mauvais arguments");
		}
		Notifications.insert({datetime: new Date(), action: action, userId: target, data: data});
		if(target != "*"){
			Meteor.users.update({_id: target},{$inc: {"profile.nNotifications": 1}});
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
			return throwAlert("error","bad-parameters", "Fonction getNotifications : mauvais arguments");
		}	
		var user      = Meteor.user();
  		if (all) {
  			return Notifications.find({$or: [{userId: user._id}, {userId: "*"}]}).sort({datetime: -1});
  		} else {
  			return Notifications.find({datetime: {$gte: user.profile.lastLogin}, $or: [{userId: user._id}, {userId: "*"}]}).sort({datetime: -1});
  		}
	},

	updateNNotifications: function(){
		console.log("update nNotifications "+ Meteor.userId() );
		Meteor.users.update({_id: Meteor.userId()},{$set: {"profile.nNotifications" : 0}});
	}
});
//TODO : faire un système qui va rechercher les x dernières notifications, + pager pour voir les suivantes

throwAlert = function(alert, error, reason, details){
	var meteorError = new Meteor.Error(error, reason, details);
	if(Meteor.isClient){
		switch(alert){
			case 'success':
				sAlert.success(meteorError.reason);
				break;
			case 'info':
				sAlert.info(meteorError.reason);
				break;
			case 'warning':
				sAlert.warning(meteorError.reason);
				break;
			default:			
				sAlert.error(meteorError.reason);
		}
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
	"PARTIE-DEL",
	"PARTIE-RNM",
	"PC-LANCEUR",
	"PEER-DEL-MSG",
	"PEER-MSG",
	"PLANETE-SET",
	"SCENAR-NEW",
	"SCENAR-UPD",
	"USER-CALL",
	"USER-DEL-MSG",
	"USER-MSG"
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
			result = data.user.firstname+" "+data.user.lastname+" ("+data.user.username+") "+ TAPi18n.__("notification.ilA");
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
			result += TAPi18n.__("notification.deck-rem", { intitule: data.intitule.fr, carteId: data.carteId, partie: data.nom, partieId: data.partieId, scenarioId: data.scenarioId } );
			break;
		case "EVENT-ACTIVE":
			break;
		case "EVENT-DEL":
			break; 
		case "EVENT-NEW":
			break;
		case "EVENT-PUT":
			result += TAPi18n.__("notification.event-put", { intitule: data.intitule.fr, eventId: data.eventId, partie: data.nom, partieId: data.partieId, scenarioId: data.scenarioId } );
			break; 
		case "EVENT-UPD":
			break;
		case "EXPERT-CALL":
			result += TAPi18n.__("notification.expert-call", { partie: data.nom, partieId: data.partieId, scenarioId: data.scenarioId } );
			break;
		case "PARTIE-DEL":
			result += TAPi18n.__("notification.partie-del", { partie: data.partie } );
			break;
		case "PARTIE-RNM":
			result += TAPi18n.__("notification.partie-rnm", { partiePrec: data.partiePrec, partieNew: data.partieNew, partieId: data.partieId, scenarioId: data.scenarioId } );
			break;
		case "PC-LANCEUR":
			result += TAPi18n.__("notification.pc-lanceur", { partie: data.nom, partieId: data.partieId, scenarioId: data.scenarioId } );
			break;
		case "PEER-DEL-MSG":
			result += TAPi18n.__("notification.peer-del-msg", { partie: data.nom, partieId: data.partieId, scenarioId: data.scenarioId } );
			break;
		case "PEER-MSG":
			result += TAPi18n.__("notification.peer-msg", { partie: data.nom, partieId: data.partieId, scenarioId: data.scenarioId } );
			break;		
		case "PLANETE-SET":
			result += TAPi18n.__("notification.planete-set", { planete: TAPi18n.__("planetes." + data.planete.planeteId), partie: data.nom, partieId: data.partieId, scenarioId: data.scenarioId } );
			break;
		case "SCENAR-NEW":
			break;
		case "SCENAR-UPD":
			break;
		case "USER-CALL":
			result += TAPi18n.__("notification.user-call", { partie: data.nom, partieId: data.partieId, scenarioId: data.scenarioId } );
			break;
		case "USER-DEL-MSG":
			result += TAPi18n.__("notification.user-del-msg", { partie: data.nom, partieId: data.partieId, scenarioId: data.scenarioId } );
			break;	
		case "USER-MSG":
			result += TAPi18n.__("notification.user-msg", { partie: data.nom, partieId: data.partieId, scenarioId: data.scenarioId } );
			break;	
	}

	return result;

}