Cartes = new Mongo.Collection('cartes');
Tags   = new Mongo.Collection('tags');

if(Meteor.isServer){
  Meteor.publish("getTags", function(){
    return Tags.find({});
  });
  Meteor.publish("getCarte", function(_id, isAdmin){
    var user = this.userId;
      if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
      if(isAdmin){
        return Cartes.find({_id: _id});
      } else {
        return Cartes.find({_id: _id, active: true});
      }
  });
  Meteor.publish("getCartes", function(active){
    var user = this.userId;
    if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
    user = Meteor.users.findOne({_id: user});
    //console.log(user.profile);
    if ((user.profile) && (user.profile.admin) && (!active)) {
      return Cartes.find({});
    } else {
      return Cartes.find({active: active});
    } 
  });
}

Meteor.startup(function(){
  if (Meteor.isServer && (Cartes.find().count() === 0)) {
    var result;
    for(var c=0; c < CartesTXT.length; c++){
      CartesTXT[c].reglesTXT = {};
      CartesTXT[c].reglesTXT.necessite = CartesTXT[c].regles.necessite;
      CartesTXT[c].reglesTXT.incompatible = CartesTXT[c].regles.incompatible;
      result = interprete(CartesTXT[c].regles.necessite, 0, false);
      if(result){
        if(result.erreurPos > 0){
          console.log('ERREUR IMPORTATION CARTE '+CartesTXT[c].carteId+' necessite :' + result.erreur + ' (' + result.erreurPos + ')');
        } else {
          CartesTXT[c].regles.necessite = result.mongo;
        }
      }
      result = interprete(CartesTXT[c].regles.incompatible, 0, false);
      if(result){
        if(result.erreurPos > 0){
          console.log('ERREUR IMPORTATION CARTE '+CartesTXT[c].carteId+' incompatible :' + result.erreur + ' (' + result.erreurPos + ')');
        } else {
          CartesTXT[c].regles.incompatible = result.mongo;
        }
      }
      Cartes.insert(CartesTXT[c]);
      for(var t=0; t < CartesTXT[c].tags.length; t++){
        if(Tags.find({tag: CartesTXT[c].tags[t]}).count() == 0){
          Tags.insert({tag: CartesTXT[c].tags[t]});
        }
      }
    }

  }
  delete CartesTXT;
});

Meteor.methods({

  setTags: function(tags){
    var user = Meteor.user();
    if (!(user && user.profile.admin)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
    for(var t=0; t < tags.length; t++){
      if(Tags.find({tag: tags[t]}).count() == 0){
        Tags.insert({tag: tags[t]});
      }
    }
  },

  setIllustration: function(_carteId, illustration){
    var user = Meteor.user();
    if (!(user && user.profile.admin)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
    try {
      check(_carteId, String);
      check(illustration, String);
      if(illustration.length > 0) illustration = "/cfs/files/illustrations/"+illustration;
    } catch(e){
      return throwAlert("error","bad-parameters", "Fonction setIllustration : mauvais arguments");
    }  
    var affectedRow = Cartes.update({_id: _carteId}, {$set: {illustration: illustration}});
    if(affectedRow){
    }
  },

  /**
  * Crée ou met à jour une carte
  * @params : carte (Object Carte à créer ou mettre à jour)
  * @return : none
  */
  setCarte: function(carte){
  	var user = Meteor.user();
  	if (!(user && user.profile.admin)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
    
    try {
    	/*CheckRegles = Match.Where(function(rules){
    		check(rules, Match.Optional(String));
    		if((rules == null) || (rules == "")) return true;
    		// vérification du format de regle
    		var nbr = -1;
    		try {
          	var cond  = JSON.parse(rules);
         		nbr = Cartes.find(cond).count();
        	} catch(e){
          	console.error(TAPi18n.__("error.syntaxe_carte_regles", carte.carteId + " " + carte.intitule.fr) , e);
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
    	})); 	*/
    } catch(e){
      return throwAlert("error","bad-parameters", "Fonction setCarte : mauvais arguments");
    }


    if(carte.hasOwnProperty("_id")){
      /*if (Meteor.apply("checkCarteUtilise",[carte._id], {returnStubValue: true})) { 
        console.log("carte utilisée");
        return throwAlert("error","carte_utilise", TAPi18n.__("error.carte_utilise")); 
      }*/
      result = Cartes.upsert({_id: carte._id}, carte);
    } else {
      //console.log("AJOUT CARTE");
      carte.carteId = carte.categorie + (Cartes.find({categorie: carte.categorie, cubesat: carte.cubesat},{_id: 1}).count() +1);
      if(!carte.ordre){
        if(Meteor.isServer){
          var objResult = Cartes.aggregate([{$match: {categorie: carte.categorie, cubesat: carte.cubesat}}, {$group: {"_id":"$item", "max":{$max: "$ordre"}}} ]);
          carte.ordre = objResult[0].max+1;
        }
      }
      //console.log(carte.carteId);
      result = Cartes.insert(carte);
    } 
    if(result){
      if(carte.active) {
        if(result.insertedId){
          carte._id = result.insertedId;
          //console.log("COOL carte ajoutee");
          Meteor.call("throwNotification","CARTE-NEW", "*", {carte: carte, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }});
        } else {
          Meteor.call("throwNotification","CARTE-UPD", "*", {carte: carte, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }});
        }
      }
      //if(Meteor.isClient) sAlert.success(TAPi18n.__("message.scenario_enregistre", scenario.scenarioId + " " + scenario.intitule ));
      throwAlert("success", "carte-set", TAPi18n.__("message.carte_enregistree", carte.carteId + " " + carte.intitule[TAPi18n.getLanguage()] ));
      //console.log(carte);
      return carte._id;
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
  	if (!(user && user.profile.admin)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
    try {
    	check(_carteId, Meteor.Collection.ObjectID);
    	check(active, Boolean);
    } catch(e){
      return throwAlert("error","bad-parameters", "Fonction upActiveCarte : mauvais arguments");
    }  
  	var affectedRow = Cartes.update({_id: _carteId}, {$set: {active: active}});
  	if(affectedRow){
  		if(active){
  			var carte = Cartes.findOne({_id: _carteId});
  			Meteor.call("throwNotification","CARTE-ACTIVE", "*", {carte: carte, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar } });
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
  removeCarte: function(carte, securite){
  	var user = Meteor.user();
  	if (!(user && user.profile.admin)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
  	try {
      check(_carteId, String);
    } catch(e){
      return throwAlert("error","bad-parameters", "Fonction removeCarte: mauvais arguments");
    }
  	//if ((!securite) && (Meteor.apply("checkCarteUtilisee",[_carteId],{returnStubValue: true}))) { return throwAlert("error","carte_utilisee", TAPi18n.__("error.carte_utilisee")); }
  	//var carte = Cartes.findOne({_id: carte._id});
  	var affectedRow = Cartes.remove({_id: carte._id});
  	if(affectedRow){
  		Meteor.call("throwNotification","CARTE-DEL", user._id, {carte: carte, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }});
  	}
  }
});

function confirmSetCarte(error, result){ // avec call back, les appels à bd sont ininterrompus que faire du callback ?
	//result.numberAffected et result.insertedId si insertion
	//console.log(TAPi18n.__("message.carte_enregistree", carte.carteId));
}