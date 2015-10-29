Cartes = new Mongo.Collection('cartes');

Meteor.methods({
  /**
  * Crée ou met à jour une carte
  * @params : carte (Object Carte à créer ou mettre à jour)
  * @return : none
  */
  setCarte: function(carte){
  	var user = Meteor.user();
  	if (!(user && user.admin)) { return throwError("privilege_user", TAPi18n.__("error.privilege_user")); }
    try {
    	CheckRegles = Match.Where(function(rules){
    		check(rules, Match.Optional(String));
    		if((rules == null) || (rules == "")) return true;
    		// vérification du format de regle
    		var nbr = -1;
    		try {
          	var cond  = JSON.parse(rules);
         		nbr = Cartes.find(cond).count();
        	} catch(e){
          	console.error(TAPi18n.__("error.syntaxe_carte_regles", carte.carteId + " " + carte.intitule) , e);
        	} 
        	if(nbr > -1) return true;
    		return false;
    	});
    	check(carte, Match.ObjectIncluding({
        _id: Match.Optional(Meteor.Collection.ObjectID),
    		carteId: String,
    		intitule: String,
    		description: Match.Optional(String),
    		tip: Match.Optional(String),
    		regles: { necessite: [CheckRegles], incompatible: [CheckRegles]},
    		illustrations: {big:  Match.Optional(String), normal: Match.Optional(String), small: Match.Optional(String) },
    		tags: Match.Optional([String]),
    		valEur: Match.OneOf(Number, [{condition: CheckRegles, valeur: Number}]),
        valNrg: Match.OneOf(Number, [{condition: CheckRegles, valeur: Number}]),
        valPds: Match.OneOf(Number, [{condition: CheckRegles, valeur: Number}]),
        valVol: Match.OneOf(Number, [{condition: CheckRegles, valeur: Number}]),
        valSci: Match.OneOf(Number, [{condition: CheckRegles, valeur: Number}]),
        fiabilite: Number,
        cubesat: Boolean,
    		active: Boolean
    	})); 	
    } catch(e){
      return throwError("bad-parameters", "Fonction setCarte : mauvais arguments");
    }
  	var result = Cartes.upsert({_id: carte._id}, carte, confirmSetCarte);
  	if(result){
  		if(active) {
  			if(result.insertedId){
  				carte._id = result.insertedId;
  				Meteor.call("throwNotification","CARTE-NEW", "*", {carte: carte});
  			} else {
  				Meteor.call("throwNotification","CARTE-UPD", "*", {carte: carte});
  			}
  		}
  		sAlert.success(TAPi18n.__("message.carte_enregistree", carte.carteId + " " + carte.intitule ));
  	}
  },

  /**
  * Modifie le statut actif ou inactif d'une carte.
  * @params : _carteId (ObjectId de la carte à modifier)
  *           active (Boolean)
  * @return : none
  */
  updActiveCarte: function(_carteId, active){
  	var user = Meteor.user();
  	if (!(user && user.admin)) { return throwError("privilege_user", TAPi18n.__("error.privilege_user")); }
    try {
    	check(_carteId, Meteor.Collection.ObjectID);
    	check(active, Boolean);
    } catch(e){
      return throwError("bad-parameters", "Fonction upActiveCarte : mauvais arguments");
    }  
  	var affectedRow = Cartes.update({_id: _carteId}, {$set: {active: active}});
  	if(affectedRow){
  		if(active){
  			var carte = Cartes.findOne({_id: _carteId});
  			Meteor.call("throwNotification","CARTE-ACTIVE", "*", {carte: carte});
  		} else {
        //TODO retirer la carte des parties non terminées et actives !!!
      }
  	}
  },

  /**
  * Supprime une carte de la base de données si elle n'est pas déjà utilisée dans une partie
  * @params : _carteId (ObjectId de la carte à supprimer)
  * @return : none 
  */
  removeCarte: function(_carteId){
  	var user = Meteor.user();
  	if (!(user && user.admin)) { return throwError("privilege_user", TAPi18n.__("error.privilege_user")); }
  	try {
      check(_carteId, Meteor.Collection.ObjectID);
    } catch(e){
      return throwError("bad-parameters", "Fonction removeCarte: mauvais arguments");
    }
  	if (Meteor.apply("checkCarteUtilisee",[_carteId],{returnStubValue: true})) { return throwError("carte_utilisee", TAPi18n.__("error.carte_utilisee")); }
  	var carte = Cartes.findOne({_id: _carteId});
  	var affectedRow = Cartes.remove({_id: _carteId});
  	if(affectedRow){
  		Meteor.call("throwNotification","CARTE-DEL", user._id, {carte: carte});
  	}
  }
});

function confirmSetCarte(error, result){ // avec call back, les appels à bd sont ininterrompus que faire du callback ?
	//result.numberAffected et result.insertedId si insertion
	//console.log(TAPi18n.__("message.carte_enregistree", carte.carteId));
}