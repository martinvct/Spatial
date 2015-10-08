Cartes = new Mongo.Collection('cartes');

Meteor.methods({
  setCarte: function(carte){
  	var user = Meteor.userId;
  	if (!(user && user.admin)) { throw new Meteor.Error(TAPi18n.__("error.privilege_user")); }
  	CheckRegles = Match.Where(function(rules){
  		check(rules, Match.Optional(String));
  		if((rules == null) || (rules == "")) return true;
  		// vérification du format de regle
  		var nbr = -1;
  		try {
        	var cond  = JSON.parse(rules);
       		nbr = Cartes.find(con).count();
      	} catch(e){
        	console.error(TAPi18n.__("error.syntaxe_carte_regles", carte.carteId) , e);
      	} 
      	if(nbr > -1) return true;
  		return false;
  	});
  	check(carte, {
  		carteId: String,
  		nom: String,
  		description: Match.Optional(String),
  		tip: Match.Optional(String),
  		regles: CheckRegles,
  		illustrations: {big:  Match.Optional(String), normal: Match.Optional(String), small: Match.Optional(String) },
  		tags: Match.Optional([String]),
  		caracteristiques: [{nom:  Match.Optional(String), valeur:  Match.Optional(Number), unite:  Match.Optional(String)}],
  		active: Boolean
  	}); 	
	var result = Cartes.upsert({carteId: carte.carteId}, carte, confirmSetCarte);
	if(result){
		if(active) {
			if(result.insertedId){
				carte.insertedId = result.insertedId;
				Meteor.call("throwNotification","CARTE-NEW", "*", {carte: carte});
			} else {
				Meteor.call("throwNotification","CARTE-UPD", "*", {carte: carte});
			}
		}
		console.log(TAPi18n.__("message.carte_enregistree", carte.carteId));
	}
  },

  updActiveCarte: function(_id, active){
  	var user = Meteor.userId;
  	if (!(user && user.admin)) { throw new Meteor.Error(TAPi18n.__("error.privilege_user")); }
  	check(_id, Meteor.Collection.ObjectId);
  	check(active, Boolean);

  	var affectedRow = Cartes.update({_id: _id}, {$set: {active: active}});
  	if(affectedRow){
  		if(active){
  			var carte = Cartes.findOne({_id: _id});
  			Meteor.call("throwNotification","CARTE-ACTIVE", "*", {carte: carte});
  		}
  	}
  },

  removeCarte: function(_id){
  	var user = Meteor.user();
  	if (!(user && user.admin)) { throw new Meteor.Error(TAPi18n.__("error.privilege_user")); }
  	if (Meteor.call("checkCarteUtilisee",_id)) { throw new Meteor.Error(TAPi18n.__("error.carte_utilisee")); }
  	var carte = Cartes.findOne({_id: _id});
  	var affectedRow = Cartes.remove({_id: _id});
  	if(affectedRow){
  		Meteor.call("throwNotification","CARTE-DEL", user.userId, {carte: carte});
  	}
  }
});

function confirmSetCarte(error, result){ // avec call back, les appels à bd sont ininterrompus que faire du callback ?
	//result.numberAffected et result.insertedId si insertion
	//console.log(TAPi18n.__("message.carte_enregistree", carte.carteId));
}