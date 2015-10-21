Parties = new Mongo.Collection('parties');


Meteor.methods({
	/**
	* Vérifie si une carte est utilisée dans au moins une partie
	* @params : _carteId (ObjectID de la carte recherchée)
	* @return : Boolean 
	*/
	checkCarteUtilisee: function(_carteId){
		var used = true;
		try {
			check(_carteId, Meteor.Collection.ObjectID);
		} catch(e){
			return throwError("bad-parameters", "Fonction checkCarteUtilisee : mauvais arguments");
		}	
		try{
			if(Parties.find({"deck.cartes._carteId": _carteId}).count() == 0) used = false;
		} catch(e) {
			return throwError("database_request", TAPi18n.__("error.database_request", "checkCarteUtilisee"));
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
		try {
			check(_eventId, Meteor.Collection.ObjectID);
		} catch(e){
			return throwError("bad-parameters", "Fonction checkEvenementUtilise : mauvais arguments");
		}	
		try{
			if(Parties.find({eventIds: _eventId}).count() == 0) used = false;
		} catch(e) {
			return throwError("database_request", TAPi18n.__("error.database_request", "checkEvenementUtilise"));
			console.error(TAPi18n.__("error.database_request", "checkEvenementUtilise") , e);
		}
		return used;
	},

	/**
	* Vérifie si un scénario est utilisé dans au moins une partie
	* @params : _scenarioId (ObjectID du scénario recherché)
	* @return : Boolean 
	*/
	checkScenarioUtilise: function(_scenarioId){
		var used = true;
		try {
			check(_scenarioId, Meteor.Collection.ObjectID);
		} catch(e){
			return throwError("bad-parameters", "Fonction checkScenarioUtilise : mauvais arguments");
		}	
		try{
			if(Parties.find({scenarioId: _scenarioId}).count() == 0) used = false;
		} catch(e) {
			return throwError("database_request", TAPi18n.__("error.database_request", "checkScenarioUtilise"));
			console.error(TAPi18n.__("error.database_request", "checkScenarioUtilise") , e);
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
  		if (!(userId)) { return throwError("privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
  			check(_scenarioId, Meteor.Collection.ObjectID);
  		} catch(e){
			return throwError("bad-parameters", "Fonction newPartie : mauvais arguments");
		}	
  		var scenario = Meteor.apply("getScenario", [_scenarioId], {returnStubValue: true});
  		try {
  			check(scenario, Object);
  		} catch(e){
			return throwError("bad-parameters", "Fonction getScenario dans checkEvenementUtilise : mauvais arguments");
		}
		var partie = {userId: userId, dateDebut: new Date(), dateModif: new Date(), deck:{cartes:[], energie:0, budget:0, masse:0, volume:0, science:0}, eventIds:[], scenarioId: scenario._id, score: 0, logs:[], peers:[], experts:[], chat:[], finie: false, active: true};	
  		partie     = Meteor.apply("setScenarioToPartie", [partie, scenario], {returnStubValue: true});
  		try {
  			var insertedId = Parties.insert(partie);
  			return Parties.findOne({_id: insertedId});
  		} catch(e) {
  			return throwError("database_request", TAPi18n.__("error.database_request", "newPartie"));
  			console.error(TAPi18n.__("error.database_request", "newPartie") , e);
  		}
	},

	/**
	* Associe un scénario à une nouvelle partie
	* @params: partie (Object Partie)
	*          scenario (Object Scenario)
	*/
	setScenarioToPartie: function(partie, scenario){
		try{
			check(partie, Match.ObjectIncluding({_id: Meteor.Collection.ObjectID, active: Boolean, finie: Boolean, scenarioId: Meteor.Collection.ObjectID}));
			check(scenario, Match.ObjectIncluding({_id: Meteor.Collection.ObjectID, active: Boolean, intitule: String }));
		} catch(e){
			return throwError("bad-parameters", "Fonction setScenarioToPartie : mauvais arguments");
		}
		if((partie.finie == 1) || (partie.active == 0)) { return throwError("partie_close", TAPi18n.__("error.partie_close")); }
		if(scenario.active == 0) { return throwError("scenario_inactif", TAPi18n.__("error.scenario_inactif")); }
		if((partie.deck.cartes.length >0)||(partie.eventIds.length >0)){ return throwError("partie_commencee", TAPi18n.__("error.partie_commencee")); }
		var affectedRow = false;
		try{
			affectedRow = Parties.update({_id: partie._id},{$set:{scenarioId: scenario._id, "deck.budget": scenario.initialisation.budget}});
		} catch(e){
			return throwError("database_request", TAPi18n.__("error.database_request", "setScenarioToPartie"));
  			console.error(TAPi18n.__("error.database_request", "setScenarioToPartie") , e);
		}
	},

	/**
	* Associé une planète pour une nouvelle partie si le scénario le permet
	* @params: partie (Object Partie)
	*          scenario (Object Scenario)
	*          planete (Object Planete)
	*/
	setPlaneteToPartie: function(partie, scenario, planete){
		try{
			check(partie, Match.ObjectIncluding({_id: Meteor.Collection.ObjectID, active: Boolean, finie: Boolean, scenarioId: Meteor.Collection.ObjectID}));
			check(scenario, Match.ObjectIncluding({_id: Meteor.Collection.ObjectID, active: Boolean, intitule: String, initialisation: { cubesat: Boolean, budget: Number, objectif: String, planetes: Match.Optional([Meteor.Collection.ObjectID])  } }));
			check(planete, Match.ObjectIncluding({_id: Meteor.Collection.ObjectID, nom: String, distance: Number, atmosphere: Boolean}));
		} catch(e){
			return throwError("bad-parameters", "Fonction setPlaneteToPartie : mauvais arguments");
		}
		if((partie.finie == 1) || (partie.active == 0)) { return throwError("partie_close", TAPi18n.__("error.partie_close")); }
		if(scenario.active == 0) { return throwError("scenario_inactif", TAPi18n.__("error.scenario_inactif")); }
		if((partie.deck.cartes.length >0)||(partie.eventIds.length >0)){ return throwError("partie_commencee", TAPi18n.__("error.partie_commencee")); }
		if((scenario.initialisation.objectif != "planete") || (!contains(scenario.initialisation.planetes, planete))) { return throwError("partie_planete", TAPi18n.__("error.planete_interdite")); }
		var affectedRow = false;
		try{
			affectedRow = Parties.update({_id: partie._id},{$set:{planete: planete}});
		} catch(e){
			return throwError("database_request", TAPi18n.__("error.database_request", "setPlaneteToPartie"));
  			console.error(TAPi18n.__("error.database_request", "setPlaneteToPartie") , e);
		}
	},
	
	/**
	* Recherche les parties actives et non finies du joueur courant triées par ordre de dernière modification décroissante
	* @params : none
	* @return : liste d'Objets Partie
	*/
	loadParties: function(){
		var userId = this.userId;
  		if (!(userId)) { return throwError("privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		return Parties.find({userId: userId, active: true, finie: false},{_id: 1, nom: 1, dateDebut: 1, scenarioId: 1}).sort({dateModif: -1});
 	},

 	/**
	* Recherche les parties actives (finies ou non)  du joueur courant triées par ordre de dernière modification décroissante
	* @params : none
	* @return : liste d'Objets Partie
	*/
	loadAllParties: function(){
		var userId = this.userId;
  		if (!(userId)) { return throwError("privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		return Parties.find({userId: userId, active: true},{_id: 1, nom: 1, dateDebut: 1, scenarioId: 1, score: 1, dateModif: 1}).sort({finie: 1, dateModif: -1});
	},

	/**
	* Recherche une partie active
	* @params : _partieId (ObjectID de la partie recherchée)
	* @return Object Partie
	*/
	loadPartie: function(_partieId){
		var userId = this.userId;
  		if (!(userId)) { return throwError("privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
  			check(_partieId, Meteor.Collection.ObjectID);
  		} catch(e){
			return throwError("bad-parameters", "Fonction loadPartie : mauvais arguments");
		}	
  		return Parties.findOne({userId: userId, _id: _partieId, active: true});
	},

	/**
	* Supprime une partie en la désactivant ; la rendant inaccessible sauf pour des besoins statistiques
	* @params : partie (Objet Partie à supprimer)
	* @return : none
	*/
	delPartie: function(partie){
		var userId = this.userId;
  		if (!(userId)) { return throwError("privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
  			check(partie, Match.ObjectIncluding({_id: Meteor.Collection.ObjectID, userId: Meteor.Collection.ObjectID}));
  		} catch(e){
			return throwError("bad-parameters", "Fonction delPartie : mauvais arguments");
		}	
  		if(userId != partie.userId){ return throwError("privilege_user", TAPi18n.__("error.privilege_user")); }
		var affectedRow = false;
		try{
			affectedRow = Parties.update({_id: partie._id},{$set: { active: false }});
		} catch(e){
			return throwError("database_request", TAPi18n.__("error.database_request", "delPartie"));
			console.error(TAPi18n.__("error.database_request", "delPartie") , e);
		}
		Meteor.call("trowNotification", "PARTIE-DEL", partie.userId, {nom: partie.nom});
	},

	/**
	* Ajoute une carte dans le deck de la partie
	* @params : partie (Object Partie dans laquelle est ajoutée la carte)
	*           carte  (Object Carte à ajouter)
	*/
	addCarteToDeck: function(partie, carte){
		var user = Meteor.user();
  		if (!(user)) { return throwError("privilege_user", TAPi18n.__("error.privilege_anonyme")); }
		try {
			check(partie, Match.ObjectIncluding({ _id: Meteor.Collection.ObjectID, nom: String, userId: Meteor.Collection.ObjectID }));
			check(carte, Match.ObjectIncluding({ _id: Meteor.Collection.ObjectID, carteId: String }));
		} catch(e){
			return throwError("bad-parameters", "Fonction addCarteToDeck : mauvais arguments");
		}	
		if(user._id != partie.userId){ return throwError("privilege_user", TAPi18n.__("error.privilege_user")); }
		if((partie.finie == 1) || (partie.active == 0)) { return throwError("partie_close", TAPi18n.__("error.partie_close")); }
		if(carte.active == 0) { return throwError("carte_inactive", TAPi18n.__("error.carte_inactive")); }
		var now = new date();

		if(typeof carte.valNrg === 'Number') {
			if(contains(carte.tags, "Energie")) {
				partie.deck.energie += carte.valNrg;
			}  else {
				partie.deck.energie -= carte.valNrg;
			}
		} else {
			try{
				var cond  = JSON.parse(carte.valNrg.condition);
				cond._id  = partie._id
				if(Parties.find(cond).count() == 1){
					if(contains(carte.tags, "Energie")) {
						partie.deck.energie += carte.valNrg.valeur;
					}  else {
						partie.deck.energie -= carte.valNrg.valeur;
					}
				} 
			} catch(e) {
				console.error(TAPi18n.__("error.database_request", "addCarteToDeck_valNrg") , e);
			}
		}
		if(typeof carte.valEur === 'Number') {
			partie.deck.budget -= carte.valEur;
		} else {
			try{
				var cond  = JSON.parse(carte.valEur.condition);
				cond._id  = partie._id
				if(Parties.find(cond).count() == 1) partie.deck.budget -= carte.valEur.valeur;
			} catch(e) {
				console.error(TAPi18n.__("error.database_request", "addCarteToDeck_valEur") , e);
			}
		}
		if(typeof carte.valPds === 'Number') {
			partie.deck.masse -= carte.valPds;
		} else {
			try{
				var cond  = JSON.parse(carte.valPds.condition);
				cond._id  = partie._id
				if(Parties.find(cond).count() == 1) partie.deck.masse -= carte.valPds.valeur;
			} catch(e) {
				console.error(TAPi18n.__("error.database_request", "addCarteToDeck_valPds") , e);
			}
		}
		if(typeof carte.valVol === 'Number') {
			partie.deck.volume -= carte.valVol;
		} else {
			try{
				var cond  = JSON.parse(carte.valVol.condition);
				cond._id  = partie._id
				if(Parties.find(cond).count() == 1) partie.deck.volume -= carte.valVol.valeur;
			} catch(e) {
				console.error(TAPi18n.__("error.database_request", "addCarteToDeck_valVol") , e);
			}
		}
		if(typeof carte.valSci === 'Number') {
			partie.deck.science += carte.valSci;
		} else {
			try{
				var cond  = JSON.parse(carte.valSci.condition);
				cond._id  = partie._id
				if(Parties.find(cond).count() == 1) partie.deck.science += carte.valSci.valeur;
			} catch(e) {
				console.error(TAPi18n.__("error.database_request", "addCarteToDeck_valSci") , e);
			}
		}
		
		
		var log = {dateTime: now, action: "DECK-ADD", data: {carteId: carte.carteId, intitule: carte.intitule, userId: user._id}};
		var affectedRow = false;
		try{
			affectedRow = Parties.update({_id: partie._id}, 
				{$set: { "deck.energie": partie.deck.energie, "deck.budget": partie.deck.budget, "deck.masse": partie.deck.masse, "deck.volume": partie.deck.volume, "deck.science": partie.deck.science, dateModif: partie.dateModif },
			 	 $push: { "deck.cartes": {_carteId: carte._id, active: true}, logs:  log}
				});
		} catch(e){
			return throwError("database_request", TAPi18n.__("error.database_request", "addCarteToDeck"));
			console.error(TAPi18n.__("error.database_request", "addCarte") , e);
		}
		if(affectedRow){
			partie.dateModif = now;
			partie.logs.push(log);
			if(user.userId != partie.userId){
				Meteor.call("trowNotification", "DECK-ADD", partie.userId, {_partieId: partie._id, nom: partie.nom, _carteId: carte._id, intitule: carte.intitule, userId: user._id})
			}
			partie.peers.forEach(function(p){ if((user.userId != p.userId) && (p.dateDebut + p.dureeMax >= now)) Meteor.call("trowNotification", "DECK-ADD", p.userId, {_partieId: partie._id, nom: partie.nom, _carteId: carte._id, intitule: carte.intitule, userId: user._id}) });

		}
	},

	/**
	* Retire une carte du deck de la partie
	* @params : partie (Object Partie dans laquelle est retirée la carte)
	*           carte  (Object Carte à retirer)
	*/
	removeCarteFromDeck: function(partie, carte){
		var user = Meteor.user();
  		if (!(user)) { return throwError("privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
			check(partie, Match.ObjectIncluding({ _id: Meteor.Collection.ObjectID, nom: String, userId: Meteor.Collection.ObjectID }));
			check(carte, Match.ObjectIncluding({ _id: Meteor.Collection.ObjectID, carteId: String }));
		} catch(e){
			return throwError("bad-parameters", "Fonction removeCarteFromDeck : mauvais arguments");
		}	
		if(user._id != partie.userId){ return throwError("privilege_user", TAPi18n.__("error.privilege_user")); }
		if((partie.finie == 1) || (partie.active == 0)) { return throwError("partie_close", TAPi18n.__("error.partie_close")); }
		var now = new date();
		if(typeof carte.valNrg === 'Number') {
			if(contains(carte.tags, "Energie")) {
				partie.deck.energie -= carte.valNrg;
			}  else {
				partie.deck.energie += carte.valNrg;
			}
		} else {
			try{
				var cond  = JSON.parse(carte.valNrg.condition);
				cond._id  = partie._id
				if(Parties.find(cond).count() == 1){
					if(contains(carte.tags, "Energie")) {
						partie.deck.energie -= carte.valNrg.valeur;
					}  else {
						partie.deck.energie += carte.valNrg.valeur;
					}
				} 
			} catch(e) {
				console.error(TAPi18n.__("error.database_request", "addCarteToDeck_valNrg") , e);
			}
		}
		if(typeof carte.valEur === 'Number') {
			partie.deck.budget += carte.valEur;
		} else {
			try{
				var cond  = JSON.parse(carte.valEur.condition);
				cond._id  = partie._id
				if(Parties.find(cond).count() == 1) partie.deck.budget += carte.valEur.valeur;
			} catch(e) {
				console.error(TAPi18n.__("error.database_request", "addCarteToDeck_valEur") , e);
			}
		}
		if(typeof carte.valPds === 'Number') {
			partie.deck.masse += carte.valPds;
		} else {
			try{
				var cond  = JSON.parse(carte.valPds.condition);
				cond._id  = partie._id
				if(Parties.find(cond).count() == 1) partie.deck.masse += carte.valPds.valeur;
			} catch(e) {
				console.error(TAPi18n.__("error.database_request", "addCarteToDeck_valPds") , e);
			}
		}
		if(typeof carte.valVol === 'Number') {
			partie.deck.volume += carte.valVol;
		} else {
			try{
				var cond  = JSON.parse(carte.valVol.condition);
				cond._id  = partie._id
				if(Parties.find(cond).count() == 1) partie.deck.volume += carte.valVol.valeur;
			} catch(e) {
				console.error(TAPi18n.__("error.database_request", "addCarteToDeck_valVol") , e);
			}
		}
		if(typeof carte.valSci === 'Number') {
			partie.deck.science -= carte.valSci;
		} else {
			try{
				var cond  = JSON.parse(carte.valSci.condition);
				cond._id  = partie._id
				if(Parties.find(cond).count() == 1) partie.deck.science -= carte.valSci.valeur;
			} catch(e) {
				console.error(TAPi18n.__("error.database_request", "addCarteToDeck_valSci") , e);
			}
		}
		var log = {dateTime: now, action: "DECK-REM", data: {carteId: carte.carteId, intitule: carte.intitule, userId: user._id}};
		var affectedRow = false;
		try{
			affectedRow = Parties.update({_id: partie._id}, 
				{$set: { "deck.energie": partie.deck.energie, "deck.budget": partie.deck.budget, "deck.masse": partie.deck.masse, "deck.volume": partie.deck.volume, "deck.science": partie.deck.science, dateModif: partie.dateModif },
			 	 $push: { logs:  log },
			 	 $pull: { "deck.cartes._carteId": carte._id }
				});
		} catch(e){
			return throwError("database_request", TAPi18n.__("error.database_request", "removeCarte"));
			console.error(TAPi18n.__("error.database_request", "removeCarte") , e);
		}
		if(affectedRow){
			partie.dateModif = now;
			partie.logs.push(log);
			
			if(user._id != partie.userId){
				Meteor.call("trowNotification", "DECK-REM", partie.userId, {_partieId: partie._id, nom: partie.nom, _carteId: carte._id, intitule: carte.intitule, userId: user._id})
			}
			partie.peers.forEach(function(p){ if((user.userId != p.userId) && (p.dateDebut + p.dureeMax >= now)) Meteor.call("trowNotification", "DECK-REM", p.userId, {_partieId: partie._id, nom: partie.nom, _carteId: carte._id, intitule: carte.intitule, userId: user._id}) });

		}
	},

	/**
	* Appelle un pair pour collaborer à une partie
	* @params : partie (Object Partie concernée)
	*           scenario (Object Scénario de la partie)
	*           peer (Object User appelé)
	*/
	callPeer:function(partie, scenario, peer){
		var user = Meteor.user();
  		if (!(user)) { return throwError("privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
 			check(partie, Match.ObjectIncluding({ _id: Meteor.Collection.ObjectID, nom: String, userId: Meteor.Collection.ObjectID }));
  			check(scenario, Match.ObjectIncluding({ _id: Meteor.Collection.ObjectID, intitule: String, collaboration:{ tpsMaxParAppel: Number, nbrMaxAppels: Number, malusBudget: Number, malusTemps: Number, malusNbrEvenements: Number } }));
  			check(peer, {userId: Meteor.Collection.ObjectID});
  		} catch(e){
			return throwError("bad-parameters", "Fonction callPeer : mauvais arguments");
		}	
  		if(user._id != partie.userId){ return throwError("privilege_user", TAPi18n.__("error.privilege_user")); }
  		if((partie.finie == 1) || (partie.active == 0)) { return throwError("partie_close", TAPi18n.__("error.partie_close")); }
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
  			if(partie.deck.budget - scenario.collaboration.malusBudget  >= 0) {
  				affectedRow = Parties.update({_id: partie._id},{$push: {peers: {dateAppel: now, dateDebut: 0, dureeMax: scenario.collaboration.tpsMaxParAppel, userId: peer._id}} });
  				partie.peers.push({dateAppel: now, dateDebut: 0, dureeMax: scenario.collaboration.tpsMaxParAppel, userId: peer._id});
  				Meteor.call("trowNotification", "PEER-CALL", user._id, {_partieId: partie._id, nom: partie.nom, peerId: peer._id});
  				Meteor.call("trowNotification", "USER-CALL", peer._id, {_partieId: partie._id, nom: partie.nom, userId: user._id});
  			} else {
  				Meteor.call("trowNotification", "PEER-NOCALL-BUDGET", user._id, {_partieId: partie._id, nom: partie.nom, peerId: peer._id, malusBudget: scenario.collaboration.malusBudget});
  			}
  		} catch(e){
  			return throwError("database_request", TAPi18n.__("error.database_request", "callPeer"));
  			console.error(TAPi18n.__("error.database_request", "callPeer") , e);
  			Meteor.call("trowNotification", "PEER-CALL", user._id, {error: 1, _partieId: partie._id, nom: partie.nom, peerId: peer._id});
  		}
	},

	/**
	* Réponse de l'utilisateur courant pour collaborer à une partie
	* @params : _partieId (ObjectID de la partie à rejoindre)
	* @return : Object Partie si conditions respectées, null sinon
	*/
	replyPeer:function(_partieId){
		var user = Meteor.user();
  		if (!(user)) { return throwError("privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
  			check(_partieId, Meteor.Collection.ObjectID);
  		} catch(e){
			return throwError("bad-parameters", "Fonction replyPeer : mauvais arguments");
		}	
  		var partie      = null;
  		var now         = new Date();
  		var affectedRow = false;
  		var nbrAppels   = 0;
  		var scenario    = null;
  		var posPeer     = -1;
  		try {
  			partie       = Parties.findOne({_id: _partieId});
  			if((partie) && (!partie.finie) && (partie.active)) {
  				scenario = Meteor.apply("getScenario", [partie.scenarioId], {returnStubValue: true});
  				if(!scenario) { return throwError("bad-parameters", TAPi18n.__("error.scenario_id")); }
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
  										return;
  									}
  								}
  								if(partie.deck.budget - scenario.collaboration.malusBudget  < 0) {
  									Meteor.call("trowNotification", "USER-NOCALL-BUDGET", user._id, {_partieId: partie._id, nom: partie.nom, userId: partie.userId, malusBudget: scenario.collaboration.malusBudget});
  									Meteor.call("trowNotification", "PEER-NOCALL-BUDGET", partie.userId, {_partieId: partie._id, nom: partie.nom, peerId: user._id, malusBudget: scenario.collaboration.malusBudget});
  									return;
  								}

  								partie.peers[posPeer].dateDebut = now;

								affectedRow  = Parties.update({_id: partie._id}, {$set: { "deck.budget": partie.deck.budget - scenario.collaboration.malusBudget, peers: partie.peers, tempsTotal: (partie.tempsTotal + scenario.collaboration.malusTemps) }} );
								if(affectedRow){
									partie.deck.budget = partie.deck.budget - scenario.collaboration.malusBudget;
									for(var e=0; e < scenario.collaboration.malusNbrEvenements; e++){ Meteor.call("addEvenementToDeck", partie, Meteor.apply("getRandomEvenement", [partie.eventIds, false], {returnStubValue: true})); }
									partie.tempsTotal = partie.tempsTotal + scenario.collaboration.malusTemps;
									return partie;
								} else {
									return throwError("database_request", TAPi18n.__("error.database_request", "replyPeer"));
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
	  				return throwError("bad-parameters", TAPi18n.__("error.partie_id"));
	  			}
	  		}

  		} catch(e){
  			return throwError("database_request", TAPi18n.__("error.database_request", "replyPeer"));
  			console.error(TAPi18n.__("error.database_request", "replyPeer") , e);
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
  		if (!(user)) { return throwError("privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
  			check(partie, Match.ObjectIncluding({userId : Meteor.Collection.ObjectID, chat: Match.Optional([Object]), peers: Match.Optional([{userId: Meteor.Collection.ObjectID, dateDebut: Match.OneOf(Number, Date), dureeMax: Number}]), finie: Boolean, active: Boolean}));
  			check(scenario, Match.ObjectIncluding({collaboration: {tpsMaxParAppel: Number}}));
  			check(message, String);
  		} catch(e){
			return throwError("bad-parameters", "Fonction addMessage : mauvais arguments");
		}	
  		if((partie.finie == 1) || (partie.active == 0)) { return throwError("partie_close", TAPi18n.__("error.partie_close")); }
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

	/**
	* Suppression d'un message dans le chat d'une partie par son auteur
	* @params : partie (Object Partie)
	*           scenario (Object Scenario de la Partie)
	*           message (String texte du message)
	* @result : none
	*/
	delMessage:function(partie, scenario, message){
		var user = Meteor.user();
  		if (!(user)) { return throwError("privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try{
  			check(partie, Match.ObjectIncluding({userId : Meteor.Collection.ObjectID, chat: Match.Optional([Object]), peers: Match.Optional([{userId: Meteor.Collection.ObjectID, dateDebut: Match.OneOf(Number, Date), dureeMax: Number}]), finie: Boolean, active: Boolean}));
  			check(scenario, Match.ObjectIncluding({collaboration: {tpsMaxParAppel: Number}}));
  			check(message, Match.ObjectIncluding({auteurId: Meteor.Collection.ObjectID, dateTime: Date}));
  		} catch(e){
			return throwError("bad-parameters", "Fonction delMessage : mauvais arguments");
		}	
  		if(user._id != message.auteurId) { return throwError("privilege_user", TAPi18n.__("error.privilege_user")); }
  		if((partie.finie == 1) || (partie.active == 0)) { return throwError("partie_close", TAPi18n.__("error.partie_close")); }
  		if(user._id != partie.userId){//suppression du message par un pair
  			for(var c=0; c < partie.peers.length; c++){ 
	  			if((partie.peers[c].dateDebut > 0) && ((partie.peers[c].userId == user._id) && ((scenario.collaboration.tpsMaxParAppel == 0) || (partie.peers[c].dateDebut + scenario.collaboration.tpsMaxParAppel > now)))) {
	  				Parties.update({_id: partie._id},{$pull:{chat: {auteurId: user._id, dateTime: message.dateTime}}});
	  			}
	  		}
  		} else {//envoi d'un message par le joueur
  			Parties.update({_id: partie._id},{$pull:{chat: {auteurId: user._id, dateTime: message.dateTime}}});
  		}
	},

	/**
	* Ajoute un évènement à la partie
	* @params : partie (Object Partie)
	*           evenement (Object Evenement)
	* @return Object Partie
	*/
	addEvenementToDeck: function(partie, evenement){
		var user = Meteor.user();
		try {
			check(partie, Match.ObjectIncluding({userId : Meteor.Collection.ObjectID, chat: Match.Optional([Object]), eventIds: Match.Optional([Meteor.Collection.ObjectID]), peers: Match.Optional([{userId: Meteor.Collection.ObjectID, dateDebut: Match.OneOf(Number, Date), dureeMax: Number}]), finie: Boolean, active: Boolean}));
			check(evenement, Match.ObjectIncluding({eventId: Meteor.Collection.ObjectID, intitule: String, deltaTps: Number, deltaEur: Number, deltaNrg: Number, deltaPds: Number, deltaVol: Number, deltaSci: Number, active: Boolean}));
		} catch(e){
			return throwError("bad-parameters", "Fonction addEvenementToDeck : mauvais arguments");
		}	
		if((partie.finie == 1) || (partie.active == 0)) { return throwError("partie_close", TAPi18n.__("error.partie_close")); }
		if(evenement.active == 0) { return throwError("evenement_inactif", TAPi18n.__("error.evenement_inactif")); }
		var affectedRow = false;
		try {
			affectedRow = Parties.update({_id: partie._id},{$set:{"deck.energie": partie.deck.energie + evenement.deltaNgr, "deck.budget": partie.deck.budget + evenement.deltaEur, "deck.masse": partie.deck.masse + evenement.deltaPds, "deck.volume": partie.deck.volume + evenement.deltaVol, "deck.science": partie.deck.science + evenement.deltaSci }, $push:{eventIds: evenement._id}});
			if(affectedRow){
				Meteor.call("trowNotification", "EVENT-PUT", user._id, {_partieId: partie._id, nom: partie.nom, _eventId: evenement._id, intitule: evenement.intitule});
				partie.peers.forEach(function(p){ if(((p.dateDebut > 0) &&  (p.dureeMax == 0)) || (p.dateDebut + p.dureeMax >= now)) Meteor.call("trowNotification", "EVENT-PUT", p.userId, {_partieId: partie._id, userId: user._id, nom: partie.nom, _eventId: evenement._id, intitule: evenement.intitule}) });
			}
		} catch(e){
			return throwError("database_request", TAPi18n.__("error.database_request", "addEvenementToDeck"));
  			console.error(TAPi18n.__("error.database_request", "addEvenementToDeck") , e);
  		}
	},

	/**
	* Appel à l'expertise par l'ordinateur de la compatibilité des cartes
	* @params partie (Object Partie)
	*         scenario (Object Scénario)
	*/
	callExpert: function(partie, scenario){
		var user = Meteor.user();
  		if (!(user)) { return throwError("privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
 			check(partie, Match.ObjectIncluding({ _id: Meteor.Collection.ObjectID, nom: String, userId: Meteor.Collection.ObjectID }));
  			check(scenario, Match.ObjectIncluding({ _id: Meteor.Collection.ObjectID, intitule: String, expertise:{ nbrMaxExperts: Number, malusBudget: Number, malusTemps: Number, malusNbrEvenements: Number, niveauDetails: Number } }));
  		} catch(e){
			return throwError("bad-parameters", "Fonction callExpert : mauvais arguments");
		}	
  		if(user._id != partie.userId){ return throwError("privilege_user", TAPi18n.__("error.privilege_user")); }
  		if((partie.finie == 1) || (partie.active == 0)) { return throwError("partie_close", TAPi18n.__("error.partie_close")); }
  		if(scenario.expertise.nbrMaxExperts > 0) {
  			if(scenario.collaboration.nbrMaxAppels == partie.experts.length) Meteor.call("trowNotification", "EXPERT-NOMORECALL", user._id, {_partieId: partie._id, nom: partie.nom});
  			return; 
  		}
  		
  		var affectedRow = false;
  		try {
  			if((scenario.expertise.nbrExpertsGratuits > partie.experts.length) || (partie.deck.budget - scenario.expertise.malusBudget  >= 0)) {
  				var rapport = Meteor.apply("validationDeck", [partie, scenario.expertise.niveauDetails, false], {returnStubValue: true});
  				affectedRow = Parties.update({_id: partie._id},{$push: {experts: {dateAppel: now, rapport: rapport}} });
  				
  			} else {
  				Meteor.call("trowNotification", "EXPERT-NOCALL-BUDGET", user._id, {_partieId: partie._id, nom: partie.nom, malusBudget: scenario.expertise.malusBudget});
  			}
  		} catch(e){
  			return throwError("database_request", TAPi18n.__("error.database_request", "callExpert"));
  			console.error(TAPi18n.__("error.database_request", "callExpert") , e);
  			Meteor.call("trowNotification", "EXPERT-CALL", user._id, {error: 1, _partieId: partie._id, nom: partie.nom});
  		}
	},

	//TODO revoir marquage partie finie, + tempsTotal, + lastModif etc...
	lancementProjet: function(partie, scenario){
		var user = Meteor.user();
  		if (!(user)) { return throwError("privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
 			check(partie, Match.ObjectIncluding({ _id: Meteor.Collection.ObjectID, nom: String, userId: Meteor.Collection.ObjectID }));
  			check(scenario, Match.ObjectIncluding({ _id: Meteor.Collection.ObjectID, intitule: String, lancement: {nbrEvenements: Number} }));
  		} catch(e){
			return throwError("bad-parameters", "Fonction lancementProjet : mauvais arguments");
		}	
  		if(user._id != partie.userId){ return throwError("privilege_user", TAPi18n.__("error.privilege_user")); }
  		if((partie.finie == 1) || (partie.active == 0)) { return throwError("partie_close", TAPi18n.__("error.partie_close")); }
  		if(partie.deck.budget < 0) { return throwError("validation_deck", TAPi18n.__("validation.budget")); }
  		if(partie.deck.energie < 0) { return throwError("validation_deck", TAPi18n.__("validation.energie")); }
  		if(partie.deck.masse < 0) { return throwError("validation_deck", TAPi18n.__("validation.masse")); }
  		if(partie.deck.volume < 0) { return throwError("validation_deck", TAPi18n.__("validation.volume")); }
  		if(partie.deck.science < 1) { return throwError("validation_deck", TAPi18n.__("validation.science")); }
  		if(scenario.lancement.nbrEvenements > 0){
  			for(var n=0; n < scenario.lancement.nbrEvenements; n++){
  				var evenement = Meteor.apply("getRandomEvenement", [partie.eventIds, true], {returnStubValue: true});
  				var affectedRow = false;
				try {
					affectedRow = Parties.update({_id: partie._id},{$set:{"deck.energie": partie.deck.energie + evenement.deltaNgr, "deck.budget": partie.deck.budget + evenement.deltaEur, "deck.masse": partie.deck.masse + evenement.deltaPds, "deck.volume": partie.deck.volume + evenement.deltaVol, "deck.science": partie.deck.science + evenement.deltaSci }, $push:{eventIds: evenement._id}});
					if(affectedRow){
						//TODO on désactive du deck les cartes désactivées par l'évènement, on adapte la valeur énergie et science du deck
						//TODO si pas assez d'énergie : fenetre de dialogue pour proposer de désactiver les composants requierant de l'énergie si composant le permet sinon choix aléatoire ?
						Meteor.call("trowNotification", "EVENT-PUT", user._id, {_partieId: partie._id, nom: partie.nom, _eventId: evenement._id, intitule: evenement.intitule});
						partie.peers.forEach(function(p){ if(((p.dateDebut > 0) &&  (p.dureeMax == 0)) || (p.dateDebut + p.dureeMax >= now)) Meteor.call("trowNotification", "EVENT-PUT", p.userId, {_partieId: partie._id, userId: user._id, nom: partie.nom, _eventId: evenement._id, intitule: evenement.intitule}) });
					}
				} catch(e){
					return throwError("database_request", TAPi18n.__("error.database_request", "lancementProjet"));
		  			console.error(TAPi18n.__("error.database_request", "lancementProjet") , e);
		  		}

  			}
  		}
  		var rapport = Meteor.apply("validationDeck", [partie, niveauDetails, true], {returnStubValue: true});
  		var score   = 0;
  		if(rapport.valide) {
  			score = Meteor.apply("scoreDeck", [partie, scenario], {returnStubValue: true});
  		}	

  		try {
			affectedRow = Parties.update({_id: partie._id},{$set:{"deck.energie": partie.deck.energie, "deck.science": partie.deck.science, rapportFinal: rapport, score: score, finie: true }});
			if(affectedRow){
				Meteor.call("trowNotification", "PROJECT-LAUNCHED", user._id, {_partieId: partie._id, nom: partie.nom });
			}
		} catch(e){
			return throwError("database_request", TAPi18n.__("error.database_request", "lancementProjet"));
		  	console.error(TAPi18n.__("error.database_request", "lancementProjet") , e);
		}

	},

	validationDeck: function(partie, niveauDetails, isLancement){
		try {
 			check(partie, Match.ObjectIncluding({ _id: Meteor.Collection.ObjectID, nom: String, userId: Meteor.Collection.ObjectID, deck:{cartes: [], energie: Number, budget: Number, masse: Number, volume: Number, science: Number } }));
  			check(niveauDetails, String);
  			check(isLancement, Boolean);

  		} catch(e){
			return throwError("bad-parameters", "Fonction validationDeck : mauvais arguments");
		}
		//il faut vérifier les confitions globales : 1 énergie , 1 attitude etc.. obligatoire

		//if faut vérifier les constantes d'énergie, masse, poids...poids

		//on parcout chaque carte et on vérifie les conditions en tenant compte des cartes sélectionnées toujouts ACTIVES !!
		//on vérifie une condition à la fois pour pouvoir détailler les erreurs

		

		//TODO
		partie.deck.cartes.forEach(function(carteDeck){
  			//if(!carteDeck.active) continue;
  			var carte = Cartes.find({_id: carteDeck._carteId});
  			//vérification des regles de la carte en fonction des autres cartes du deck toujours actives !
  			
  			
  		}); 
	}
	

});