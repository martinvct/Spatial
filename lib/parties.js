Parties = new Mongo.Collection('parties');


Meteor.methods({
	/**
	* Vérifie si une carte est utilisée dans au moins une partie
	* @params : _carteId (ObjectID de la carte recherchée)
	* @return : Boolean 
	*/
	checkCarteUtilisee: function(_carteId){
		var used = true;
		check(_carteId, Meteor.Collection.ObjectID);
		try{
			if(Parties.find({deck:{carteIds: _carteId}}).count() == 0) used = false;
		} catch(e) {
			console.error(TAPi18n.__("error.database_request", "checkCarteUtilisee") , e);
		}
		return used;
	},

	/**
	* Vérifie si un évènement est utilisé dans au moins une partie
	* @params : _eventId (ObjectID de l'évènement recherché)
	* @return : Boolean 
	*/
	checkEvenementUtilise: function(_eventId){
		var used = true;
		check(_eventId, Meteor.Collection.ObjectID);
		try{
			if(Parties.find({eventIds: _eventId}).count() == 0) used = false;
		} catch(e) {
			console.error(TAPi18n.__("error.database_request", "checkEvenementUtilise") , e);
		}
		return used;
	},

	/**
	* Crée une nouvelle partie en fonction d'un scénario
	* @params : _scenarioId (ObjectID du scénario utilisé)
	* @return : Objet Partie
	*/
	newPartie: function(_scenarioId){
		var userId = this.userId;
  		if (!(userId)) { throw new Meteor.Error(TAPi18n.__("error.privilege_anonyme")); }
  		check(_scenarioId, Meteor.Collection.ObjectID);
  		var scenario = Meteor.call("getScenario", _scenarioId);
  		check(scenario, Object);
  		// TODO : ajouter impact du scénario sur énergie, budget, masse, volume ?
  		try {
  			var insertedId = Parties.insert({userId: userId, dateDebut: new Date(), dateModif: new Date(), deck:{}, eventIds:[], scenarioId: scenario._id, score: 0, logs:[], chat:[], finie: false, active: true});
  			return Parties.findOne({_id: insertedId});
  		} catch(e) {
  			console.error(TAPi18n.__("error.database_request", "newPartie") , e);
  		}
	},

	/**
	* Recherche les parties actives et non finies du joueur courant triées par ordre de dernière modification décroissante
	* @params : none
	* @return : liste d'Objets Partie
	*/
	loadParties: function(){
		var userId = this.userId;
  		if (!(userId)) { throw new Meteor.Error(TAPi18n.__("error.privilege_anonyme")); }
  		return Parties.find({userId: userId, active: true, finie: false},{_id: 1, nom: 1, dateDebut: 1, scenarioId: 1}).sort({dateModif: -1});
 	},

 	/**
	* Recherche les parties actives (finies ou non)  du joueur courant triées par ordre de dernière modification décroissante
	* @params : none
	* @return : liste d'Objets Partie
	*/
	loadAllParties: function(){
		var userId = this.userId;
  		if (!(userId)) { throw new Meteor.Error(TAPi18n.__("error.privilege_anonyme")); }
  		return Parties.find({userId: userId, active: true},{_id: 1, nom: 1, dateDebut: 1, scenarioId: 1, score: 1, dateModif: 1}).sort({finie: 1, dateModif: -1});
	},

	/**
	* Recherche une partie active
	* @params : _partieId (ObjectID de la partie recherchée)
	* @return Object Partie
	*/
	loadPartie: function(_partieId){
		var userId = this.userId;
  		if (!(userId)) { throw new Meteor.Error(TAPi18n.__("error.privilege_anonyme")); }
  		check(_partieId, Meteor.Collection.ObjectID);
  		return Parties.findOne({userId: userId, _id: _partieId, active: true});
	},

	/**
	* Supprime une partie en la désactivant ; la rendant inaccessible sauf pour des besoins statistiques
	* @params : partie (Objet Partie à supprimer)
	* @return : none
	*/
	delPartie: function(partie){
		var userId = this.userId;
  		if (!(userId)) { throw new Meteor.Error(TAPi18n.__("error.privilege_anonyme")); }
  		check(partie, {_id: Meteor.Collection.ObjectID, userId: Meteor.Collection.ObjectID});
  		if(userId != partie.userId){ throw new Meteor.Error(TAPi18n.__("error.privilege_user")); }
		var affectedRow = false;
		try{
			affectedRow = Parties.update({_id: partie._id},{$set: { active: false }});
		} catch(e){
			console.error(TAPi18n.__("error.database_request", "delPartie") , e);
		}
		Meteor.call("trowNotification", "PARTIE-DEL", partie.userId, {nom: partie.nom});
	},

	/**
	* Ajoute une carte dans le deck de la partie
	* @params : partie (Object Partie dans laquelle est ajoutée la carte)
	*           carte  (Object Carte à ajouter)
	* @return : Object Partie
	*/
	addCarteToDeck: function(partie, carte){
		var user = Meteor.user();
  		if (!(user)) { throw new Meteor.Error(TAPi18n.__("error.privilege_anonyme")); }
		check(partie, { _id: Meteor.Collection.ObjectID, nom: String, userId: Meteor.Collection.ObjectID });
		check(carte, { _id: Meteor.Collection.ObjectID, carteId: String });
		if(user._id != partie.userId){ throw new Meteor.Error(TAPi18n.__("error.privilege_user")); }
		if((partie.finie == 1) || (partie.active == 0)) { throw new Meteor.Error(TAPi18n.__("error.partie_close")); }
		var now = new date();
		partie.deck.energie -= carte.valNrg;
		partie.deck.budget  -= carte.valEur;
		partie.deck.masse   -= carte.valPds;
		partie.deck.volume  -= carte.valVol;
		partie.deck.science += carte.valSci;
		var log = {dateTime: now, action: "DECK-ADD", data: {carteId: carte.carteId, intitule: carte.intitule, userId: user._id}};
		var affectedRow = false;
		try{
			affectedRow = Parties.update({_id: partie._id}, 
				{$set: { deck: {energie: partie.deck.energie, budget: partie.deck.budget, masse: partie.deck.masse, volume: partie.deck.volume, science: partie.deck.science}, dateModif: partie.dateModif },
			 	 $push: { deck: {_carteIds: carte._id}, logs:  log}
				});
		} catch(e){
			console.error(TAPi18n.__("error.database_request", "addCarte") , e);
		}
		if(affectedRow){
			partie.dateModif = now;
			partie.logs.push(log);
			if(user.userId != partie.userId){
				Meteor.call("trowNotification", "DECK-ADD", partie.userId, {_partieId: partie._id, nom: partie.nom, _carteId: carte._id, intitule: carte.intitule, userId: user._id})
			}
			partie.peers.forEach(function(p){ if((user.userId != p.userId) && (p.dateDebut + p.dureeMax >= now)) Meteor.call("trowNotification", "DECK-ADD", p.userId, {_partieId: partie._id, nom: partie.nom, _carteId: carte._id, intitule: carte.intitule, userId: user._id}) });

		} else {
			partie.deck.energie += carte.valNrg;
			partie.deck.budget  += carte.valEur;
			partie.deck.masse   += carte.valPds;
			partie.deck.volume  += carte.valVol;
			partie.deck.science -= carte.valSci;
		}
		return partie;
	},

	/**
	* Retite une carte du deck de la partie
	* @params : partie (Object Partie dans laquelle est retirée la carte)
	*           carte  (Object Carte à retirer)
	* @return : Object Partie
	*/
	removeCarteFromDeck: function(partie, carte){
		var user = Meteor.user();
  		if (!(user)) { throw new Meteor.Error(TAPi18n.__("error.privilege_anonyme")); }
		check(partie, { _id: Meteor.Collection.ObjectID, nom: String, userId: Meteor.Collection.ObjectID });
		check(carte, { _id: Meteor.Collection.ObjectID, carteId: String });
		if(user._id != partie.userId){ throw new Meteor.Error(TAPi18n.__("error.privilege_user")); }
		if((partie.finie == 1) || (partie.active == 0)) { throw new Meteor.Error(TAPi18n.__("error.partie_close")); }
		var now = new date();
		partie.deck.energie += carte.valNrg;
		partie.deck.budget  += carte.valEur;
		partie.deck.masse   += carte.valPds;
		partie.deck.volume  += carte.valVol;
		partie.deck.science -= carte.valSci;
		var log = {dateTime: now, action: "DECK-REM", data: {carteId: carte.carteId, intitule: carte.intitule, userId: user._id}};
		var affectedRow = false;
		try{
			affectedRow = Parties.update({_id: partie._id}, 
				{$set: { deck: {energie: partie.deck.energie, budget: partie.deck.budget, masse: partie.deck.masse, volume: partie.deck.volume, science: partie.deck.science}, dateModif: partie.dateModif },
			 	 $push: { logs:  log },
			 	 $pull: { deck: {_carteIds: carte._id }}
				});
		} catch(e){
			console.error(TAPi18n.__("error.database_request", "removeCarte") , e);
		}
		if(affectedRow){
			partie.dateModif = now;
			partie.logs.push(log);
			if(user._id != partie.userId){
				Meteor.call("trowNotification", "DECK-REM", partie.userId, {_partieId: partie._id, nom: partie.nom, _carteId: carte._id, intitule: carte.intitule, userId: user._id})
			}
			partie.peers.forEach(function(p){ if((user.userId != p.userId) && (p.dateDebut + p.dureeMax >= now)) Meteor.call("trowNotification", "DECK-REM", p.userId, {_partieId: partie._id, nom: partie.nom, _carteId: carte._id, intitule: carte.intitule, userId: user._id}) });

		} else {
			partie.deck.energie -= carte.valNrg;
			partie.deck.budget  -= carte.valEur;
			partie.deck.masse   -= carte.valPds;
			partie.deck.volume  -= carte.valVol;
			partie.deck.science += carte.valSci;
		}
		return partie;
	},

	/**
	* Appelle un pair pour collaborer à une partie
	* @params : partie (Object Partie concernée)
	*           scenario (Object Scénario de la partie)
	*           peer (Object User appelé)
	* @return : Object Partie
	*/
	callPeer:function(partie, scenario, peer){
		var user = Meteor.user();
  		if (!(user)) { throw new Meteor.Error(TAPi18n.__("error.privilege_anonyme")); }
  		check(partie, { _id: Meteor.Collection.ObjectID, nom: String, userId: Meteor.Collection.ObjectID });
  		check(scenario, { _id: Meteor.Collection.ObjectID, intitule: String, collaboration:{ tpsMaxParAppel: Number, nbrMaxAppels: Number, malusBudget: Number, malusTemps: Number, malusNbrEvenements: Number } });
  		check(peer, {userId: Meteor.Collection.ObjectID});
  		if(user._id != partie.userId){ throw new Meteor.Error(TAPi18n.__("error.privilege_user")); }
  		if((partie.finie == 1) || (partie.active == 0)) { throw new Meteor.Error(TAPi18n.__("error.partie_close")); }
  		var nbrAppels = 0;
  		if(scenario.collaboration.nbrMaxAppels > 0) {
  			for(var c=0; c < partie.peers.length; c++){ 
  				if(partie.peers[c].dateDebut > 0) nbrAppels++;
  			} 
  			if(scenario.collaboration.nbrMaxAppels == nbrAppels) Meteor.call("trowNotification", "PEER-NOMORECALL", user._id, {_partieId: partie._id, nom: partie.nom});
  			return partie; 
  		}
  		var now = new Date();
  		var affectedRow = false;
  		try {
  			for(var c=0; c < partie.peers.length; c++){ 
  				if((partie.peers[c].userId == peer._id) && ((scenario.collaboration.tpsMaxParAppel == 0) || (partie.peers[c].dateDebut + scenario.collaboration.tpsMaxParAppel < now))) {
  					Meteor.call("trowNotification", "PEER-STILLCALL", user._id, {_partieId: partie._id, nom: partie.nom, peerId: partie.peers[c].userId, dateAppel: partie.peers[c].dateAppel});
  					return partie;
  				}  
  			} 
  			if(partie.deck.budget - scenario.collaboration.malusBudget  > 0) {
  				affectedRow = Parties.update({_id: partie._id},{$push: {peers: {dateAppel: now, dateDebut: 0, dureeMax: scenario.collaboration.tpsMaxParAppel, userId: peer._id}} });
  				partie.peers.push({dateAppel: now, dateDebut: 0, dureeMax: scenario.collaboration.tpsMaxParAppel, userId: peer._id});
  				Meteor.call("trowNotification", "PEER-CALL", user._id, {_partieId: partie._id, nom: partie.nom, peerId: peer._id});
  				Meteor.call("trowNotification", "USER-CALL", peer._id, {_partieId: partie._id, nom: partie.nom, userId: user._id});
  			} else {
  				Meteor.call("trowNotification", "PEER-NOCALL-BUDGET", user._id, {_partieId: partie._id, nom: partie.nom, peerId: peer._id, malusBudget: scenario.collaboration.malusBudget});
  			}
  		} catch(e){
  			console.error(TAPi18n.__("error.database_request", "callPeer") , e);
  			Meteor.call("trowNotification", "PEER-CALL", user._id, {error: 1, _partieId: partie._id, nom: partie.nom, peerId: peer._id});
  		}
  		return partie;
	},

	/**
	* Réponse de l'utilisateur courant pour collaborer à une partie
	* @params : _partieId (ObjectID de la partie à rejoindre)
	* @return : Object Partie si conditions respectées, null sinon
	*/
	replyPeer:function(_partieId){
		var user = Meteor.user();
  		if (!(user)) { throw new Meteor.Error(TAPi18n.__("error.privilege_anonyme")); }
  		check(_partieId, Meteor.Collection.ObjectID);
  		var partie      = null;
  		var now         = new Date();
  		var affectedRow = false;
  		var nbrAppels   = 0;
  		var scenario    = null;
  		var posPeer     = -1;
  		try {
  			partie       = Parties.findOne({_id: _partieId});
  			if((partie) && (!partie.finie) && (partie.active)) {
  				scenario = Meteor.call("getScenario", partie.scenarioId);
  				if(!scenario) { throw new Meteor.Error(TAPi18n.__("error.scenario_id")); }
  				for(var c=0; c < partie.peers.length; c++){ 
	  				if(partie.peers[c].userId == user._id){
	  					if ((scenario.collaboration.tpsMaxParAppel == 0) || (partie.peers[c].dateDebut + scenario.collaboration.tpsMaxParAppel > now)) {
							if(partie.peers[c].dateDebut == 0){ //première réponse du pair à l'appel
								posPeer = c;
								if(scenario.collaboration.nbrMaxAppels > 0) {
  									for(var c=0; c < partie.peers.length; c++){ 
  										if(partie.peers[c].dateDebut > 0) nbrAppels++;
  									} 
  									if(scenario.collaboration.nbrMaxAppels == nbrAppels) {
  										Meteor.call("trowNotification", "PEER-NOMORECALL", user._id, {_partieId: partie._id, nom: partie.nom});
  										return null;
  									}
  								}
  								if(partie.deck.budget - scenario.collaboration.malusBudget  < 0) {
  									Meteor.call("trowNotification", "USER-NOCALL-BUDGET", user._id, {_partieId: partie._id, nom: partie.nom, userId: partie.userId, malusBudget: scenario.collaboration.malusBudget});
  									Meteor.call("trowNotification", "PEER-NOCALL-BUDGET", partie.userId, {_partieId: partie._id, nom: partie.nom, peerId: user._id, malusBudget: scenario.collaboration.malusBudget});
  									return null;
  								}

  								partie.peers[posPeer].dateDebut = now;

								affectedRow  = Parties.update({_id: partie._id}, {$set: { deck:{budget: partie.deck.budget - scenario.collaboration.malusBudget }, peers: partie.peers, tempsTotal: (partie.tempsTotal + scenario.collaboration.malusTemps) }} );
								if(affectedRow){
									partie.deck.budget = partie.deck.budget - scenario.collaboration.malusBudget;
									for(var e=0; e < scenario.collaboration.malusNbrEvenements; e++){ Meteor.call("addEvenementToDeck", partie, Meteor.call("getRandomEvenement", partie.eventIds)); }
									partie.tempsTotal = partie.tempsTotal + scenario.collaboration.malusTemps;
									return partie;
								} else {
									console.error(TAPi18n.__("error.database_request", "replyPeer") , e);
									return null;
								}
							} else { //le pair reprend un appel auquel il avait déjà répondu
								return partie;
							}
						} else {
							Meteor.call("trowNotification", "PEER-TOOLATE", user._id, {alert: 1, _partieId: partie._id, nom: partie.nom, userId: partie.userId});
						}
	  				}  
	  			}
	  		} else {
	  			if(partie){
	  				Meteor.call("trowNotification", "PEER-TOOLATE", user._id, {alert: 1, _partieId: partie._id, nom: partie.nom, userId: partie.userId});
	  			} else {
	  				throw new Meteor.Error(TAPi18n.__("error.partie_id"));
	  			}
	  		}

  		} catch(e){
  			console.error(TAPi18n.__("error.database_request", "callPeer") , e);
  			Meteor.call("trowNotification", "PEER-CALL", user._id, {error: 1, _partieId: partie._id, nom: partie.nom, peerId: peer.userId});
  		}
	},

	/**
	* Envoi d'un message dans le chat d'une partie par le joueur ou un pair
	* @params : partie (Object Partie)
	*           scenario (Object Scenario de la Partie)
	*           message (String texte du message)
	* @result : none
	*/
	addMessage:function(partie, scenario, message){
		var user = Meteor.user();
  		if (!(user)) { throw new Meteor.Error(TAPi18n.__("error.privilege_anonyme")); }
  		check(partie, {userId : Meteor.Collection.ObjectID, chat: Match.Optional([Object]), peers: Match.Optional([{userId: Meteor.Collection.ObjectID, dureeMax: Number}]), finie: Boolean, active: Boolean});
  		check(message, String);
  		if((partie.finie == 1) || (partie.active == 0)) { throw new Meteor.Error(TAPi18n.__("error.partie_close")); }
  		if(user._id != partie.userId){//envoi message par un pair
	  		for(var c=0; c < partie.peers.length; c++){ 
	  			if((partie.peers[c].dateDebut > 0) && ((partie.peers[c].userId == user._id) && ((scenario.collaboration.tpsMaxParAppel == 0) || (partie.peers[c].dateDebut + scenario.collaboration.tpsMaxParAppel > now)))) {
	  				Parties.update({_id: partie._id},{$push: {chat: { auteurId: user._id, dateTime: now, message: message} } } );
	  				for(var c=0; c < partie.peers.length; c++){ 
	  					if((user._id != partie.peers[c].userId) && (((scenario.collaboration.tpsMaxParAppel == 0) || (partie.peers[c].dateDebut + scenario.collaboration.tpsMaxParAppel > now)))) Meteor.call("trowNotification", "PEER-MSG", partie.peers[c].userId, {_partieId: partie._id, nom: partie.nom, userId: user._id});
	  				}
	  				Meteor.call("trowNotification", "PEER-MSG", partie.userId, {_partieId: partie._id, nom: partie.nom, userId: user._id});
	  			} 
	  		}
	  	} else {//envoi d'un message par le joueur
	  		Parties.update({_id: partie._id},{$push: {chat: { auteurId: user._id, dateTime: now, message: message} } } );
	  		for(var c=0; c < partie.peers.length; c++){ 
	  			if((scenario.collaboration.tpsMaxParAppel == 0) || (partie.peers[c].dateDebut + scenario.collaboration.tpsMaxParAppel > now)) Meteor.call("trowNotification", "USER-MSG", partie.peers[c].userId, {_partieId: partie._id, nom: partie.nom, userId: user._id});
	  		}
	  	}
	},

	delMessage:function(partie){

	},
	addEvenementToDeck: function(partie, evenement){

	}
	

});