Parties = new Mongo.Collection('parties');

if(Meteor.isServer){
	Meteor.publish("getPartie", function(_id){
		var user = this.userId;
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
  		return Parties.find({_id: _id});
	});
	Meteor.publish("getParties", function(active){
		var user = this.userId;
		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
		return Parties.find({active: active, $or: [{userId: user},{"peers.userId": user}]}); //R4C2Znn52kXmPCLb5
	});
	Meteor.publish("getPartiesCartes", function(){
		return Parties.find({},{"deck.cartes":1});
	});
	Meteor.publish("getPartiesEvenements", function(){
		return Parties.find({},{"eventIds":1});
	});
}

Meteor.methods({
	/**
	* Vérifie si une carte est utilisée dans au moins une partie
	* @params : _carteId (ObjectID de la carte recherchée)
	* @return : Boolean 
	*/
	checkCarteUtilisee: function(_carteId){
		var used = true;
		try {
			check(_carteId, String);
		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction checkCarteUtilisee : mauvais arguments");
		}	
		try{
			//db.parties.find({"deck.cartes._carteId": "oELLENbJm4EpTYSyJ"}).count()
			console.log("nbr parties subscribe :" + Parties.find({}).count());
			if(Parties.find({"deck.cartes._carteId": _carteId}).count() == 0) used = false;
		} catch(e) {
			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "checkCarteUtilisee"));
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
			check(_eventId, String);
		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction checkEvenementUtilise : mauvais arguments");
		}	
		try{
			if(Parties.find({eventIds: _eventId}).count() == 0) used = false;
		} catch(e) {
			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "checkEvenementUtilise"));
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
			check(_scenarioId, String);
		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction checkScenarioUtilise : mauvais arguments");
		}	
		try{
			if(Parties.find({scenarioId: _scenarioId}).count() == 0) used = false;
		} catch(e) {
			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "checkScenarioUtilise"));
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
		var scenario;
  		if (!(userId)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
  			check(_scenarioId, String);
  			scenario = Scenarios.findOne({_id : _scenarioId});
  			check(scenario, Match.ObjectIncluding({_id: String, active: Boolean, intitule: String }));
  		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction newPartie : mauvais arguments");
		}	
  		if(scenario.active == 0) { return throwAlert("error","scenario_inactif", TAPi18n.__("error.scenario_inactif")); }

		var partie = {userId: userId, nom: TAPi18n.__("partie.nouvelle"), dateDebut: new Date(), dateModif: new Date(), deck:{cartes:[], structures:{n:0, ids:[]}, energieMax:0, budgetMax:0, masseMax:0, volumeMax:0, energie:0, budget:0, masse:0, volume:0, science:0}, budgetLanceur: 1, eventIds:[], scenarioId: scenario._id, score: 0, logs:[], peers:[], experts:[], chat:[], finie: false, active: true};	
  		try{
			partie.deck.masse     =  0;
			partie.deck.masseMax  =  0;
			partie.deck.volume    =  0;
			partie.deck.volumeMax =  0;
			partie.objectif       = scenario.initialisation.objectif;
			partie.cubesat        = scenario.initialisation.cubesat; 
			if(!partie.cubesat) partie.budgetLanceur = 1;
			partie.deck.budget    = scenario.initialisation.budget;
			partie.deck.budgetMax = scenario.initialisation.budget;
			if(scenario.initialisation.objectif != "planete"){
				partie.planete = _.find(Planetes, function(planete){ return planete.planeteId == "TERRE"; });
			}
		} catch(e){
			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "setScenarioToPartie"));
  			//console.error(TAPi18n.__("error.database_request", "setScenarioToPartie") , e);
		}  		
  		try {
  			var insertedId = Parties.insert(partie);
  			return Parties.findOne({_id: insertedId});
  		} catch(e) {
  			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "newPartie"));
  			//console.error(TAPi18n.__("error.database_request", "newPartie") , e);
  		}
	},

	/**
	* Associé une planète pour une nouvelle partie si le scénario le permet
	* @params: partie (Object Partie)
	*          scenario (Object Scenario)
	*          planete (Object Planete)
	*/
	setPlaneteToPartie: function(partie, scenario, planete){
		var user = Meteor.user();
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
		try{
			//check(partie, Match.ObjectIncluding({_id: String, active: Boolean, finie: Boolean, scenarioId: String}));
			//check(scenario, Match.ObjectIncluding({_id: Meteor.Collection.ObjectID, active: Boolean, intitule: String, initialisation: { cubesat: Boolean, budget: Number, objectif: String, planetes: Match.Optional([Meteor.Collection.ObjectID])  } }));
			check(planete, Match.ObjectIncluding({planeteId: String, nom: String, distance: Number, atmosphere: Boolean}));
		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction setPlaneteToPartie : mauvais arguments");
		}
		if(user._id != partie.userId){ return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
		if((partie.finie == 1) || (partie.active == 0)) { return throwAlert("error","partie_close", TAPi18n.__("error.partie_close")); }
		if(scenario.active == 0) { return throwAlert("error","scenario_inactif", TAPi18n.__("error.scenario_inactif")); }
		//if((partie.deck.cartes.length >0)||(partie.eventIds.length >0)){ return throwAlert("error","partie_commencee", TAPi18n.__("error.partie_commencee")); }
		
		console.log(planete);
		console.log(scenario.initialisation.planetes);
		if((scenario.initialisation.objectif != "planete") || (!contains(scenario.initialisation.planetes, planete.planeteId))) { return throwAlert("error","partie_planete", TAPi18n.__("error.planete_interdite")); }
		var affectedRow = false;
		try{
			affectedRow = Parties.update({_id: partie._id},{$set:{planete: planete}});
			partie.peers.forEach(function(p){ if((user._id != p.userId) && ((p.dureeMax == 0) || (p.dateDebut.getTime() + p.dureeMax >= now.getTime()))) Meteor.call("throwNotification", "PLANETE-SET", p.userId, { planete: planete, partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }}) });

		} catch(e){
			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "setPlaneteToPartie"));
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
  		if (!(userId)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		return Parties.find({userId: userId, active: true, finie: false},{_id: 1, nom: 1, dateDebut: 1, scenarioId: 1}, {sort: {dateModif: -1}});
 	},

 	/**
	* Recherche les parties actives (finies ou non)  du joueur courant triées par ordre de dernière modification décroissante
	* @params : none
	* @return : liste d'Objets Partie
	*/
	loadAllParties: function(){
		var userId = this.userId;
  		if (!(userId)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		return Parties.find({userId: userId, active: true},{_id: 1, nom: 1, dateDebut: 1, scenarioId: 1, score: 1, dateModif: 1}, {sort: {finie: 1, dateModif: -1}});
	},

	/**
	* Recherche une partie active
	* @params : _partieId (ObjectID de la partie recherchée)
	* @return Object Partie
	*/
	/*
	loadPartie: function(_partieId){
		var userId = this.userId;
  		if (!(userId)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
  			check(_partieId, Meteor.Collection.ObjectID);
  		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction loadPartie : mauvais arguments");
		}	
		Session.set("dateModif", (new Date()).getTime());
		//var partie   = Parties.findOne({_id: _partieId , active: true, {$or:[{userId: userId}, {peers.userId: userId}]}});
  		var partie   = Parties.findOne({_id: _partieId, active: true, $or:[{userId: userId}, {"peers.userId": userId}]});
  		var scenario = Scenario.findOne({_id: partie.scenarioId}); 
  		if((Session.get("partieId") !== partie._id) && (Session.get("eventInterval"))){
  			Meteor.clearInterval(Session.get("eventInterval"));
  		}
  		Session.set("partieId", partie._id);
  		if((scenario.evenement.intervalleTps > 0) && ((scenario.evenement.nbrMax == 0) || (scenario.evenement.nbrMax < partie.nbrEventsFromTimer))){
  			var eventInterval = Meteor.setInterval(Meteor.call("launchEvent",partie, scenario), 1000);
  			Session.set("eventInterval", eventInterval);
  		}
  		return partie;
	},*/

	/**
	* Supprime une partie en la désactivant ; la rendant inaccessible sauf pour des besoins statistiques
	* @params : partie (Objet Partie à supprimer)
	* @return : none
	*/
	delPartie: function(partie){
		var userId = this.userId;
  		if (!(userId)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
  			check(partie, Match.ObjectIncluding({_id: String, userId: String}));
  		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction delPartie : mauvais arguments");
		}	
  		if(userId != partie.userId){ return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
		var affectedRow = false;
		try{
			affectedRow = Parties.update({_id: partie._id},{$set: { active: false }});
			partie.peers.forEach(function(p){ if((user._id != p.userId) && ((p.dureeMax == 0) || (p.dateDebut.getTime() + p.dureeMax >= now.getTime()))) Meteor.call("throwNotification", "PARTIE-DEL", p.userId, {partie: partie.nom, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }}) });
			throwAlert("success","PARTIE-DEL", TAPi18n.__("notification.partie-del", { partie: partie.nom } ));
		} catch(e){
			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "delPartie"));
			console.error(TAPi18n.__("error.database_request", "delPartie") , e);
		}
	},
	
	/**
	* Change le nom de la partie
	* @params : partieId (Object Partie)
	*           nom (String)
	*/
	updateNomPartie: function(partieId, nom){
		var user = Meteor.user();
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		var partie = Parties.findOne({_id: partieId});
  		try {
			check(partie, Match.ObjectIncluding({ _id: String, nom: String, userId: String }));
			check(nom, String);
		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction updateNomPartie : mauvais arguments");
		}	
		if(user._id != partie.userId){ return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
		if((partie.finie == 1) || (partie.active == 0)) { return throwAlert("error","partie_close", TAPi18n.__("error.partie_close")); }
		try{
			Parties.update({_id: partie._id},{$set: { nom: nom }});
			partie.peers.forEach(function(p){ if((user._id != p.userId) && ((p.dureeMax == 0) || (p.dateDebut.getTime() + p.dureeMax >= now.getTime()))) Meteor.call("throwNotification", "PARTIE-RNM", p.userId, { partieId: partie._id, scenarioId: partie.scenarioId, partiePrec: partie.nom, partieNew: nom, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }}) });
			
		} catch(e){
			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "updateNomPartie"));
			console.error(TAPi18n.__("error.database_request", "updateNomPartie") , e);
		}
	},

	/**
	* Change le tempsTotal de la partie
	* @params : partieId (Object Partie)
	*           tps (Integer) temps en seconde
	*/
	updateTpsPartie: function(partieId, tps){
		var user = Meteor.user();
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		var partie = Parties.findOne({_id: partieId});
  		console.log("partieId:"+partieId);
		console.log("tps:"+tps);
		//console.log(partie);
		if(Meteor.isClient) { //car sinon en client Parties contient la premiere partie chargée et pas forcément la courante!
			Session.set('sCountTimer', 0);
			return;
		}
  		try {
			//check(partie, Match.ObjectIncluding({ _id: String, nom: String, userId: String }));
			check(tps, Number);
		} catch(e){
			
			return throwAlert("error","bad-parameters", "Fonction updateTpsPartie : mauvais arguments");
		}	
		if(user._id != partie.userId){ return; }
		if((partie.finie == 1) || (partie.active == 0)) { return; }
		try{
			Parties.update({_id: partie._id},{$inc: { tempsTotal: tps }});
			
		} catch(e){
			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "updateTpsPartie"));
			console.error(TAPi18n.__("error.database_request", "updateTpsPartie") , e);
		}
	},


	/**
	* Change le pourcentage du lanceur utilisé
	* @params : partie (Object Partie dans laquelle est retirée la carte)
	*           scenario (Object Scenario)
	*           percent  (float entre 0 et 1) 
	*/
	updatePercentLanceur: function(partieId, scenario, percent, dateModif){
		var user = Meteor.user();
		var partie;
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
		try {
			check(partieId, String);
			partie = Parties.findOne({_id: partieId});
			check(partie, Match.ObjectIncluding({ _id: String, nom: String, userId: String }));
			//check(scenario, Match.ObjectIncluding({_id: String, initialisation:{ cubesat: Boolean }}));
			check(percent, Number);
		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction updatePercentLanceur : mauvais arguments");
		}
		if(percent > 10) percent = percent / 100;	
		if(!hasPrivilege(partie, scenario, user._id)){ return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
		if((partie.finie == 1) || (partie.active == 0)) { return throwAlert("error","partie_close", TAPi18n.__("error.partie_close")); }
		if(percent < 0) percent = 0;
		if(percent > 1) percent = 1;
		var affectedRow = false;
		try{
			affectedRow = Parties.update({_id: partie._id},{$set: { budgetLanceur: percent }});
			if(affectedRow) {
				Meteor.call("updateConstantes",partie, scenario, dateModif);
				if(user._id != partie.userId){
					Meteor.call("throwNotification", "PC-LANCEUR", partie.userId, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, carteId: carte.carteId, intitule: carte.intitule, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }})
				}
				partie.peers.forEach(function(p){ if((user._id != p.userId) && ((p.dureeMax == 0) || (p.dateDebut.getTime() + p.dureeMax >= now.getTime()))) Meteor.call("throwNotification", "PC-LANCEUR", p.userId, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, carteId: carte.carteId, intitule: carte.intitule, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }}) });

			}	
		} catch(e){
			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "updatePercentLanceur"));
			console.error(TAPi18n.__("error.database_request", "updatePercentLanceur") , e);
		}
	},

	/**
	* Ajoute une carte dans le deck de la partie
	* @params : partieId (String Partie dans laquelle est ajoutée la carte)
	*           carte  (Object Carte à ajouter)
	*/

	addCarteToDeck: function(partieId, scenario, carte, nStructure, dateModif){
		var user = Meteor.user();
		var partie;

		
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
		try {
			//nStructure = parseInt(nStructure);
			console.log("nStructure", nStructure);
			check(partieId, String);
			//console.log("structure");
			//console.log(nStructure);
			check(nStructure, Number);
			partie = Parties.findOne({_id: partieId});
			//console.log("partie");
			//console.log(partie);
			check(partie, Match.ObjectIncluding({ _id: String, nom: String, userId: String }));
			//console.log(carte);
		  //  console.log("carte");
			//console.log(carte);
			check(carte, Match.ObjectIncluding({ _id: String, carteId: String }));
		//console.log(scenario);
			//check(scenario, Match.ObjectIncluding({_id: String, "initialisation.cubesat": Boolean }));
			//console.log(partie.deck.structures.ids);
			//console.log(nStructure);
			//console.log(partie.deck.structures.ids.indexOf(nStructure));
		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction addCarteToDeck : mauvais arguments");
		}
		if(!hasPrivilege(partie, scenario, user._id)){ return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
		if((carte.categorie == "Z")  && (user._id != partie.userId)){ return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
		if((partie.finie == 1) || (partie.active == 0)) { return throwAlert("error","partie_close", TAPi18n.__("error.partie_close")); }
		if(carte.active == 0) { return throwAlert("error","carte_inactive", TAPi18n.__("error.carte_inactive")); }
		if(carte.cubesat != scenario.initialisation.cubesat) { return throwAlert("error","carte_incompatible", TAPi18n.__("error.carte_incompatible")); }
		if((nStructure > 0) &&(partie.deck.structures.ids.indexOf(nStructure) == -1)) { return throwAlert("error","structure_retiree", TAPi18n.__("error.structure_retiree")); }
		
		var now = new Date();
		var log = {dateTime: now, action: "DECK-ADD", data: {carteId: carte.carteId, intitule: carte.intitule.fr, userId: user._id}};
		var affectedRow = false;
		try{
			if(partie.deck.budget < getValeurDeRegle(partie._id, carte.valEur)) { return throwAlert("error","budget_insuffisant", TAPi18n.__("error.budget_insuffisant")); }
			if(carte.categorie == "Z"){ //carte Structure
				partie.deck.structures.n = partie.deck.structures.n +1;
				nStructure               = partie.deck.structures.n;
				//console.log(nStructure);
				//console.log(carte);
				//console.log(partie.deck.structures);
				partie.deck.structures.ids.push(nStructure);
				partie.deck.structures.masses.push(0);
				//console.log(partie._id);
				//console.log(carte._id);
				//console.log(carte.carteId);
				//console.log(carte.tags);
				//console.log(partie.deck.structures);
				//console.log('Parties.update({_id: '+partie._id+'},{$push: { "deck.cartes": {_carteId: '+carte._id+', active: true,  carteId: '+carte.carteId+', tags: '+carte.tags+', categorie: '+carte.categorie+', fiabilite: '+carte.fiabilite+', nStructure: '+nStructure+'}}, $set: {"deck.structures" : '+partie.deck.structures+'}});');
				//console.log(partie.deck.structures);



				affectedRow = Parties.update({_id: partie._id}, 
					{$push: { "deck.cartes": {_carteId: carte._id, active: true,  carteId: carte.carteId, tags: carte.tags, categorie: carte.categorie, fiabilite: carte.fiabilite, nStructure: nStructure}, logs:  log},
					 $set: {"deck.structures" : partie.deck.structures}
					});
			} else {
				affectedRow = Parties.update({_id: partie._id}, 
					{$push: { "deck.cartes": {_carteId: carte._id, active: true,  carteId: carte.carteId, tags: carte.tags, categorie: carte.categorie, fiabilite: carte.fiabilite, nStructure: nStructure}, logs:  log}
					});
			}
			if(affectedRow) {
				partie.deck.cartes.push({_carteId: carte._id, active: true,  carteId: carte.carteId, tags: carte.tags, fiabilite: carte.fiabilite, nStructure: nStructure});
			} 
			
		} catch(e){
			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "addCarteToDeck"));
			console.error(TAPi18n.__("error.database_request", "addCarte") , e);
			console.log(e);
		}
		if(affectedRow){
			//console.log(partie.deck.cartes);
			Meteor.call("updateConstantes",partie, scenario, dateModif);
			if(user._id != partie.userId){
				Meteor.call("throwNotification", "DECK-ADD", partie.userId, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, carteId: carte.carteId, intitule: carte.intitule, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }})
			}
			partie.peers.forEach(function(p){ if((user._id != p.userId) && ((p.dureeMax == 0) || (p.dateDebut.getTime() + p.dureeMax >= now.getTime()))) Meteor.call("throwNotification", "DECK-ADD", p.userId, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, carteId: carte.carteId, intitule: carte.intitule, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }}) });

		}
	},

	/**
	* Retire une carte du deck de la partie
	* @params : partieId (String Partie dans laquelle est retirée la carte)
	*           scenario (Object Scenario)
	*           carte  (Object Carte à retirer)
	*/
	removeCarteFromDeck: function(partieId, scenario, carte, nStructure, dateModif){
		var user = Meteor.user();
		var partie;
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
  			check(partieId, String);
  			check(nStructure, Number);
			partie = Parties.findOne({_id: partieId});
			check(partie, Match.ObjectIncluding({ _id: String, nom: String, userId: String }));
			check(carte, Match.ObjectIncluding({ _id: String, carteId: String }));
		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction removeCarteFromDeck : mauvais arguments");
		}	
		if(!hasPrivilege(partie, scenario, user._id)){ return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
		if((carte.categorie == "Z")  && (user._id != partie.userId)){ return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
		if((partie.finie == 1) || (partie.active == 0)) { return throwAlert("error","partie_close", TAPi18n.__("error.partie_close")); }
		if((nStructure > 0) &&(partie.deck.structures.ids.indexOf(nStructure) == -1)) { return throwAlert("error","structure_retiree", TAPi18n.__("error.structure_retiree")); }
		var now = new Date();
		var log = {dateTime: now, action: "DECK-REM", data: {carteId: carte.carteId, intitule: carte.intitule, userId: user._id}};
		var affectedRow = false;
		try{

			if(carte.categorie == "Z"){ //carte Structure
				partie.deck.structures.masses.splice(partie.deck.structures.ids.indexOf(nStructure), 1);
				partie.deck.structures.ids.splice(partie.deck.structures.ids.indexOf(nStructure), 1);
				affectedRow = Parties.update({_id: partie._id}, 
					{$push: { logs:  log },
					 $set: { "deck.structures" : partie.deck.structures },
				 	 $pull: { "deck.cartes": {nStructure: nStructure }}
					});
			} else {
				affectedRow = Parties.update({_id: partie._id}, 
					{$push: { logs:  log },
				 	 $pull: { "deck.cartes": {_carteId: carte._id, nStructure: nStructure }}
					});
			}
		} catch(e){
			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "removeCarte"));
			console.error(TAPi18n.__("error.database_request", "removeCarte") , e);
		}
		if(affectedRow){
			//console.log(partie.deck.cartes);
			if(carte.categorie == "Z"){ //carte Structure
				partie.deck.cartes = partie.deck.cartes.filter(function(obj){ return obj.nStructure !== nStructure });
			} else {
				partie.deck.cartes = partie.deck.cartes.filter(function(obj){ return ((obj._carteId !== carte._id) || (obj.nStructure !== nStructure) ) });
			}
			//console.log(partie.deck.cartes);
			Meteor.call("updateConstantes",partie, scenario, dateModif);
			if(user._id != partie.userId){
				Meteor.call("throwNotification", "DECK-REM", partie.userId, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, carteId: carte.carteId, intitule: carte.intitule, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }})
			}
			partie.peers.forEach(function(p){ if((user._id != p.userId) && ((p.dureeMax == 0) || (p.dateDebut.getTime() + p.dureeMax >= now.getTime()))) Meteor.call("throwNotification", "DECK-REM", p.userId, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, carteId: carte.carteId, intitule: carte.intitule, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }}) });

		}
	},

	/**
	* Appelle un pair pour collaborer à une partie
	* @params : partie (Object Partie concernée)
	*           scenario (Object Scénario de la partie)
	*           peer (Object User appelé)
	*/
	callPeer:function(partieId, scenario, peerUsername, dateModif){
		var user = Meteor.user();
		var partie, peer;
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
  			check(partieId, String);
			partie = Parties.findOne({_id: partieId});
			check(peerUsername, String);
			peer = Meteor.users.findOne({username: peerUsername});
 			check(partie, Match.ObjectIncluding({ _id: String, nom: String, userId: String }));
  			//check(scenario, Match.ObjectIncluding({ _id: Meteor.Collection.ObjectID, intitule: String, collaboration:{ tpsMaxParAppel: Number, nbrMaxAppels: Number, malusBudget: Number, malusTemps: Number, malusNbrEvenements: Number } }));
  		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction callPeer : mauvais arguments");
		}
		if(user._id != partie.userId){ return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
  		if((partie.finie == 1) || (partie.active == 0)) { return throwAlert("error","partie_close", TAPi18n.__("error.partie_close")); }
  		var nbrAppels = 0;
  		if(scenario.collaboration.nbrMaxAppels > 0) {
  			for(var c=0; c < partie.peers.length; c++){ 
  				if(partie.peers[c].dateDebut > 0) nbrAppels++;
  			} 
  			if(scenario.collaboration.nbrMaxAppels == nbrAppels) {
  				//Meteor.call("throwNotification", "PEER-NOMORECALL", user._id, {_partieId: partie._id, nom: partie.nom});
  				return throwAlert("error","PEER-NOMORECALL", TAPi18n.__("notification.peer-nomorecall"));
  			}	
  			return partie; 
  		}
  		var now = new Date();
  		var affectedRow = false;
  		try {
  			
  			for(var c=0; c < partie.peers.length; c++){ 
  				if((partie.peers[c].userId == peer._id) && ((scenario.collaboration.tpsMaxParAppel == 0) || (partie.peers[c].dateDebut.getTime() + scenario.collaboration.tpsMaxParAppel < now.getTime()))) {
  					/*console.log(user._id);
  					console.log(partie._id);
  					console.log(partie.nom);
  					console.log(partie.peers[c].userId);
  					console.log(partie.peers[c].dateAppel);*/
  					

  					//Meteor.call("throwNotification", "PEER-STILLCALL", user._id, {_partieId: partie._id, nom: partie.nom, peerId: partie.peers[c].userId, dateAppel: partie.peers[c].dateAppel});
  					return throwAlert("error","PEER-STILLCALL", TAPi18n.__("notification.peer-stillcall", { username: peer.username, firstname: peer.profile.firstname, lastname: peer.profile.lastname, dateAppel: moment(partie.peers[c].dateAppel).format("DD/MM/YYYY HH:mm:ss") }));
  				}  
  			} 
  			if(partie.deck.budget - scenario.collaboration.malusBudget  >= 0) {
  				affectedRow = Parties.update({_id: partie._id},{$push: {peers: {dateAppel: now, dateDebut: 0, dureeMax: scenario.collaboration.tpsMaxParAppel, userId: peer._id}} });
  				
  				partie.peers.push({dateAppel: now, dateDebut: 0, dureeMax: scenario.collaboration.tpsMaxParAppel, userId: peer._id});
  				//Meteor.call("throwNotification", "PEER-CALL", user._id, {_partieId: partie._id, nom: partie.nom, peerId: peer._id});
  				Meteor.call("throwNotification", "USER-CALL", peer._id, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }});
  				throwAlert("message","PEER-CALL", TAPi18n.__("notification.peer-call", { username: peer.profile.username, firstname: peer.profile.firstname, lastname: peer.profile.lastname }));
  			} else {
  				return throwAlert("error","PEER-NOCALL-BUDGET", TAPi18n.__("notification.peer-nocall-budget", { malusBudget: scenario.collaboration.malusBudget }));
  				//Meteor.call("throwNotification", "PEER-NOCALL-BUDGET", user._id, {_partieId: partie._id, nom: partie.nom, peerId: peer._id, malusBudget: scenario.collaboration.malusBudget});
  			}
  			
  		} catch(e){
  			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "callPeer"));
  			/*console.error(TAPi18n.__("error.database_request", "callPeer") , e);
  			Meteor.call("throwNotification", "PEER-CALL", user._id, {error: 1, _partieId: partie._id, nom: partie.nom, peerId: peer._id});*/
  		}
	},

	/**
	* Réponse de l'utilisateur courant pour collaborer à une partie
	* @params : _partieId (ObjectID de la partie à rejoindre)
	* @return : Object Partie si conditions respectées, null sinon
	*/
	replyPeer:function(_partieId){
		var user = Meteor.user();
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
  			check(_partieId, String);
  		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction replyPeer : mauvais arguments");
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
  				if(!scenario) { return throwAlert("error","bad-parameters", TAPi18n.__("error.scenario_id")); }
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
  										return throwAlert("error","PEER-NOMORECALL", TAPi18n.__("notification.peer-nomorecall"));
  									}
  								}
  								if(partie.deck.budget - scenario.collaboration.malusBudget  < 0) {
  									/*Meteor.call("throwNotification", "USER-NOCALL-BUDGET", user._id, {_partieId: partie._id, nom: partie.nom, userId: partie.userId, malusBudget: scenario.collaboration.malusBudget});
  									Meteor.call("throwNotification", "PEER-NOCALL-BUDGET", partie.userId, {_partieId: partie._id, nom: partie.nom, peerId: user._id, malusBudget: scenario.collaboration.malusBudget});
  									*/
  									return throwAlert("error","USER-NOCALL-BUDGET", TAPi18n.__("notification.peer-nocall-budget", { malusBudget: scenario.collaboration.malusBudget }));
  								}
  								partie.peers[posPeer].dateDebut = now;
 								if(Meteor.isClient) Session.set("dateModif", now.getTime());
 								affectedRow  = Parties.update({_id: partie._id}, {$set: { "deck.budget": partie.deck.budget - scenario.collaboration.malusBudget, peers: partie.peers, tempsTotal: (partie.tempsTotal + scenario.collaboration.malusTemps) }} );
								if(affectedRow){
									partie.deck.budget = partie.deck.budget - scenario.collaboration.malusBudget;
									for(var e=0; e < scenario.collaboration.malusNbrEvenements; e++){ Meteor.call("addEvenementToDeck", partie, Meteor.apply("getRandomEvenement", [partie.eventIds, false, scenario.initialisation.cubesat], {returnStubValue: true})); }
									partie.tempsTotal = partie.tempsTotal + scenario.collaboration.malusTemps;
									if(Meteor.isClient) { if((Session.get("partieId") !== partie._id) && (Session.get("eventInterval"))){ //on termine le lanceur d'évenement sur timer s'il existe pour le pair
  										Meteor.clearInterval(Session.get("eventInterval"));
  									}}
									return partie;
								} else {
									return throwAlert("error","database_request", TAPi18n.__("error.database_request", "replyPeer"));
									console.error(TAPi18n.__("error.database_request", "replyPeer") , e);
									return null;
								}
							} else { //le pair reprend un appel auquel il avait déjà répondu
								if(Meteor.isClient){ if((Session.get("partieId") !== partie._id) && (Session.get("eventInterval"))){ //on termine le lanceur d'évenement sur timer s'il existe pour le pair
  									Meteor.clearInterval(Session.get("eventInterval"));
  								}}
								return partie;
							}
						} else {
							//Meteor.call("throwNotification", "PEER-TOOLATE", user._id, {alert: 1, _partieId: partie._id, nom: partie.nom, userId: partie.userId});
							return throwAlert("error","PEER-TOOLATE", TAPi18n.__("notification.peer-toolate"));
						}
	  				}  
	  			}
	  		} else {
	  			if(partie){
	  				//Meteor.call("throwNotification", "PEER-TOOLATE", user._id, {alert: 1, _partieId: partie._id, nom: partie.nom, userId: partie.userId});
	  				return throwAlert("error","PEER-TOOLATE", TAPi18n.__("notification.peer-toolate"));
	  			} else {
	  				return throwAlert("error","bad-parameters", TAPi18n.__("error.partie_id"));
	  			}
	  		}

  		} catch(e){
  			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "replyPeer"));
  			console.error(TAPi18n.__("error.database_request", "replyPeer") , e);
  		}
	},

	/**
	* Envoi d'un message dans le chat d'une partie par le joueur ou un pair
	* @params : partie (Object Partie)
	*           scenario (Object Scenario de la Partie)
	*           message (String texte du message)
	* @result : none
	*/
	addMessage:function(partieId, scenario, message, dateModif){
		var user = Meteor.user();
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
  			check(partieId, String);
  			partie = Parties.findOne({_id: partieId});
 			check(partie, Match.ObjectIncluding({ _id: String, nom: String, userId: String }));
 			//check(scenario, Match.ObjectIncluding({collaboration: {tpsMaxParAppel: Number}}));
  			check(message, String);
  		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction addMessage : mauvais arguments");
		}	
  		if((partie.finie == 1) || (partie.active == 0)) { return throwAlert("error","partie_close", TAPi18n.__("error.partie_close")); }
  		var now = new Date();
  		var tps = partie.tempsTotal + (now.getTime() - dateModif) / 1000;
  		if(user._id != partie.userId){//envoi message par un pair
	  		for(var c=0; c < partie.peers.length; c++){ 
	  			if((partie.peers[c].dateDebut > 0) && ((partie.peers[c].userId == user._id) && ((scenario.collaboration.tpsMaxParAppel == 0) || (partie.peers[c].dateDebut.getTime() + scenario.collaboration.tpsMaxParAppel > now.getTime())))) {
	  				var affectedRow = Parties.update({_id: partie._id},{$set:{ tempsTotal: tps, dateModif: now}, $push: {chat: { auteurId: user._id, dateTime: now, message: message} } } );
	  				if(Meteor.isClient){ if(affectedRow)  Session.set("dateModif", now.getTime()); }
	  				/*
	  				for(var c=0; c < partie.peers.length; c++){ 
	  					if((user._id != partie.peers[c].userId) && (((scenario.collaboration.tpsMaxParAppel == 0) || (partie.peers[c].dateDebut + scenario.collaboration.tpsMaxParAppel > now)))) Meteor.call("throwNotification", "PEER-MSG", partie.peers[c].userId, {_partieId: partie._id, nom: partie.nom, userId: user._id});
	  				}
	  				Meteor.call("throwNotification", "PEER-MSG", partie.userId, {_partieId: partie._id, nom: partie.nom, userId: user._id});
	  				*/
	  				if(user._id != partie.userId){
						Meteor.call("throwNotification", "PEER-MSG", partie.userId, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }})
					}
					partie.peers.forEach(function(p){ if((user._id != p.userId) && ((p.dureeMax == 0) || (p.dateDebut.getTime() + p.dureeMax >= now.getTime()))) Meteor.call("throwNotification", "PEER-MSG", p.userId, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }}) });

	  			} 
	  		}
	  	} else {//envoi d'un message par le joueur
	  		Parties.update({_id: partie._id},{$set:{ tempsTotal: tps, dateModif: now}, $push: {chat: { auteurId: user._id, dateTime: now, message: message} } } );
	  		for(var c=0; c < partie.peers.length; c++){ 
	  			if((scenario.collaboration.tpsMaxParAppel == 0) || (partie.peers[c].dateDebut.getTime() + scenario.collaboration.tpsMaxParAppel > now.getTime())) Meteor.call("throwNotification", "USER-MSG", partie.peers[c].userId, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }});
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
	delMessage:function(partie, scenario, message, dateModif){
		var user = Meteor.user();
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try{
  			//check(partie, Match.ObjectIncluding({userId : String, chat: Match.Optional([Object]), peers: Match.Optional([{userId: String, dateDebut: Match.OneOf(Number, Date), dureeMax: Number}]), finie: Boolean, active: Boolean}));
  			//check(scenario, Match.ObjectIncluding({collaboration: {tpsMaxParAppel: Number}}));
  			check(message, Match.ObjectIncluding({auteurId: String, dateTime: Date}));
  		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction delMessage : mauvais arguments");
		}	
  		if(user._id != message.auteurId) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
  		if((partie.finie == 1) || (partie.active == 0)) { return throwAlert("error","partie_close", TAPi18n.__("error.partie_close")); }
  		var now = new Date();
  		var tps = partie.tempsTotal + (now.getTime() - dateModif) / 1000;
  		if(user._id != partie.userId){//suppression du message par un pair
  			for(var c=0; c < partie.peers.length; c++){ 
	  			if((partie.peers[c].dateDebut > 0) && ((partie.peers[c].userId == user._id) && ((scenario.collaboration.tpsMaxParAppel == 0) || (partie.peers[c].dateDebut.getTime() + scenario.collaboration.tpsMaxParAppel > now.getTime())))) {
	  				var affectedRow = Parties.update({_id: partie._id},{$set:{ tempsTotal: tps, dateModif: now}, $pull:{chat: {auteurId: user._id, dateTime: message.dateTime}}});
	  				if(Meteor.isClient){ if(affectedRow)  Session.set("dateModif", now.getTime()); }
	  				if(user._id != partie.userId){
						Meteor.call("throwNotification", "PEER-DEL-MSG", partie.userId, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }})
					}
					partie.peers.forEach(function(p){ if((user._id != p.userId) && ((p.dureeMax == 0) || (p.dateDebut.getTime() + p.dureeMax >= now.getTime()))) Meteor.call("throwNotification", "PEER-DEL-MSG", p.userId, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }}) });

	  			}
	  		}
  		} else {//envoi d'un message par le joueur
  			Parties.update({_id: partie._id},{$set:{ tempsTotal: tps, dateModif: now}, $pull:{chat: {auteurId: user._id, dateTime: message.dateTime}}});
  			for(var c=0; c < partie.peers.length; c++){ 
	  			if((scenario.collaboration.tpsMaxParAppel == 0) || (partie.peers[c].dateDebut.getTime() + scenario.collaboration.tpsMaxParAppel > now.getTime())) Meteor.call("throwNotification", "USER-DEL-MSG", partie.peers[c].userId, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }});
	  		}
  		}
	},

	/**
	* Appel à l'expertise par l'ordinateur de la compatibilité des cartes
	* @params partieId (Object Partie)
	*         scenario (Object Scénario)
	*/
	callExpert: function(partieId, scenario, dateModif){
		var user = Meteor.user();
		var partie;
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
  			check(partieId, String);
  			partie = Parties.findOne({_id: partieId});
 			check(partie, Match.ObjectIncluding({ _id: String, nom: String, userId: String }));
  			//check(scenario, Match.ObjectIncluding({ _id: String, intitule: String, expertise:{ nbrMaxExperts: Number, malusBudget: Number, malusTemps: Number, malusNbrEvenements: Number, niveauDetails: Number } }));
  		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction callExpert : mauvais arguments");
		}	
  		if(user._id != partie.userId){ return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
  		if((partie.finie == 1) || (partie.active == 0)) { return throwAlert("error","partie_close", TAPi18n.__("error.partie_close")); }
  		if(scenario.expertise.nbrMaxExperts > 0) {
  			if(scenario.collaboration.nbrMaxAppels == partie.experts.length) throwAlert("error", "EXPERT-NOMORECALL", TAPi18n.__("notification.expert-nomorecall"));
  			return; 
  		}
  		
  		var affectedRow = false;
  		var now = new Date();
		var tps = partie.tempsTotal + (now.getTime() - dateModif) / 1000;
  		try {
  			//console.log("passe ici");
  			//console.log(scenario);
  			//console.log(partie);
  			if((scenario.expertise.nbrExpertsGratuits > partie.experts.length) || (partie.deck.budget - scenario.expertise.malusBudget  >= 0)) {
  				console.log("appel expert");
  				var rapport = Meteor.apply("validationDeck", [partie, scenario, scenario.expertise.niveauDetails, false], {returnStubValue: true});
  				console.log("affichae rapport..."); console.log(rapport);
  				affectedRow = Parties.update({_id: partie._id},{$set:{ tempsTotal: tps, dateModif: now }, $push: {experts: {dateAppel: now, rapport: rapport}} });
  				partie.experts.push({experts: {dateAppel: now, rapport: rapport}});
  				if(Meteor.isClient){ if(affectedRow)  Session.set("dateModif", now.getTime()); }
  				Meteor.call("updateConstantes",partie, scenario, dateModif);

  				partie.peers.forEach(function(p){ if((user._id != p.userId) && ((p.dureeMax == 0) || (p.dateDebut.getTime() + p.dureeMax >= now.getTime()))) Meteor.call("throwNotification", "EXPERT-CALL", p.userId, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, user: { userId: user._id, username: user.profile.username, firstname: user.profile.firstname, lastname: user.profile.lastname, avatar: user.profile.avatar }}) });

  			} else {
  				throwAlert("error", "EXPERT-NOCALL-BUDGET", TAPi18n.__("notification.expert-nocall-budget"));
  			}
  		} catch(e){
  			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "callExpert"));
  			console.error(TAPi18n.__("error.database_request", "callExpert") , e);
  		}
	},

	/**
	* Ajoute un évènement à la partie
	* @params : partie (Object Partie)
	*           scenario (Object Scenario)
	*           evenement (Object Evenement)
	* @return Object Partie
	*/
	addEvenementToDeck: function(partie, scenario,  evenement, dateModif){
		var user = Meteor.user();
		try {
			//check(partie, Match.ObjectIncluding({userId : Meteor.Collection.ObjectID, chat: Match.Optional([Object]), eventIds: Match.Optional([Meteor.Collection.ObjectID]), peers: Match.Optional([{userId: Meteor.Collection.ObjectID, dateDebut: Match.OneOf(Number, Date), dureeMax: Number}]), finie: Boolean, active: Boolean}));
			check(evenement, Match.ObjectIncluding({eventId: String, intitule: String, deltaTps: Number, deltaEur: Number, deltaNrg: Number, deltaPds: Number, deltaVol: Number, deltaSci: Number, cubesat: Boolean, active: Boolean}));
			//check(scenario, Match.ObjectIncluding({_id: String, initialisation: {cubesat: Boolean} }))
		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction addEvenementToDeck : mauvais arguments");
		}	
		if((partie.finie == 1) || (partie.active == 0)) { return throwAlert("error","partie_close", TAPi18n.__("error.partie_close")); }
		if(evenement.active == 0) { return throwAlert("error","evenement_inactif", TAPi18n.__("error.evenement_inactif")); }
		if(evenement.cubesat != scenario.initialisation.cubesat) { return throwAlert("error","evenement_incompatible", TAPi18n.__("error.evenement_incompatible")); }
		var affectedRow = false;
		var now = new Date();
		try {
			affectedRow = Parties.update({_id: partie._id},{$push:{eventIds: evenement._id}});
			if(affectedRow){
				//on désactive du deck les cartes désactivées par l'évènement
				for(var i=0; i < evenement.targetCarteIds.length; i++){
					for(var c=0; c < partie.deck.cartes.length; c++){
						if(partie.deck.cartes[c]._carteId === evenement.targetCarteIds[i]) partie.deck.cartes[c].active = false;
					}
				}
				for(var i=0; i < evenement.targetCarteTags.length; i++){
					for(var c=0; c < partie.deck.cartes.length; c++){
						if(contains(partie.deck.cartes[c].tags, evenement.targetCarteTags[i])) partie.deck.cartes[c].active = false;
					}
				}
				partie.eventIds.push(evenement._id);
				Parties.update({_id: partie._id},{$set:{ "deck.cartes": partie.deck.cartes }});
				Meteor.call("updateConstantes",partie, scenario, dateModif);
				Meteor.call("throwNotification", "EVENT-PUT", user._id, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, eventId: evenement.eventId, intitule: evenement.intitule});
				partie.peers.forEach(function(p){ if(((p.dateDebut > 0) &&  (p.dureeMax == 0)) || (p.dateDebut.getTime() + p.dureeMax >= now.getTime())) Meteor.call("throwNotification", "EVENT-PUT", p.userId, {partieId: partie._id, scenarioId: partie.scenarioId, nom: partie.nom, eventId: evenement.eventId, intitule: evenement.intitule}) });
			}
		} catch(e){
			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "addEvenementToDeck"));
  			console.error(TAPi18n.__("error.database_request", "addEvenementToDeck") , e);
  		}
	},

	

	//TODO  + tempsTotal, + lastModif etc...
	lancementProjet: function(partieId, scenario, dateModif){
		var user = Meteor.user();
		var erreurs = {cartes: [], evenementsFinaux: []};
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_anonyme")); }
  		try {
  			check(partieId, String);
  			partie = Parties.findOne({_id: partieId});
 			//check(partie, Match.ObjectIncluding({ _id: Meteor.Collection.ObjectID, nom: String, userId: Meteor.Collection.ObjectID }));
  			//check(scenario, Match.ObjectIncluding({ _id: Meteor.Collection.ObjectID, intitule: String, lancement: {nbrEvenements: Number}, initialisation: {cubsat: Boolean} }));
  		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction lancementProjet : mauvais arguments");
		}	
  		if(user._id != partie.userId){ return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
  		if((partie.finie == 1) || (partie.active == 0)) { return; }
  		if(partie.deck.budget < 0) { return throwAlert("error","validation_deck", TAPi18n.__("validation.budget")); }
  		if(partie.deck.energie < 0) { return throwAlert("error","validation_deck", TAPi18n.__("validation.energie")); }
  		if(partie.deck.masse < 0) { return throwAlert("error","validation_deck", TAPi18n.__("validation.masse")); }
  		if(partie.deck.volume < 0) { return throwAlert("error","validation_deck", TAPi18n.__("validation.volume")); }
  		if(partie.deck.science < 1) { return throwAlert("error","validation_deck", TAPi18n.__("validation.science")); }
  		if(scenario.lancement.nbrEvenements > 0){
  			for(var n=0; n < scenario.lancement.nbrEvenements; n++){
  				var evenement = Meteor.apply("getRandomEvenement", [partie.eventIds, true, scenario.initialisation.cubesat], {returnStubValue: true});
  				erreurs.evenementsFinaux.push({_id: evenement._id, intitule: evenement.intitule, description: evenement.description });
  				var affectedRow = false;
  				var now = new Date();
				Meteor.call("addEvenementToDeck",partie, scenario,  evenement, dateModif);
  			}
  			
  		}
  		//on effectue le test de fiabilité
  		for(var c=0; c < partie.deck.cartes.length; c++){
  			if(partie.deck.cartes[c].fiabilite < 1){
  				var random = Math.floor(Math.random());
  				if(random > partie.deck.cartes[c].fiabilite){
  					partie.deck.cartes[c].active = false;
  					var carte = Cartes.findOne({_id: partie.deck.cartes[c]._carteId});
  					erreurs.cartes.push({carte: {_id: carte._id, carteId: carte.carteId, intitule: carte.intitule, categorie: carte.categorie }, fiabilite: true});
  					Meteor.call("throwNotification", "CARTE-DESTROY", user._id, {_partieId: partie._id, nom: partie.nom, _carteId: partie.deck.cartes[c], carteId: carte.carteId, intitule: carte.intitule});
  				}
  			}
  			if(contains(partie.deck.cartes[c].tags,"absurde")){
  				partie.deck.cartes[c].active = false;
  				var carte = Cartes.findOne({_id: partie.deck.cartes[c]._carteId});
  				erreurs.cartes.push({carte: {_id: carte._id, carteId: carte.carteId, intitule: carte.intitule, categorie: carte.categorie }, absurde: true});
  				Meteor.call("throwNotification", "CARTE-DESTROY", user._id, {_partieId: partie._id, nom: partie.nom, _carteId: partie.deck.cartes[c], carteId: carte.carteId, intitule: carte.intitule});
  			}
  		}
  		try {
			affectedRow = Parties.update({_id: partie._id},{$set:{ "deck.cartes": partie.deck.cartes }});
		} catch(e){
			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "lancementProjet"));
		  	console.error(TAPi18n.__("error.database_request", "lancementProjet") , e);
		}
  		Meteor.call("updateConstantes",partie, scenario, dateModif);
  		/*if(partie.deck.energie < 0){ //pas assez d'énergie, des composants qui en consomment vont devoir être désactivés aléatoirement
  			var deltaEnergie = partie.deck.energie;
  			var carte;
  			var valeur = 0;
  			var listeCartesNrg = [];
  			//recherche des cartes actives consommant de l'énergie
  			for(var c=0; c < partie.deck.cartes.length; c++){
				carte = Cartes.findOne({_id: partie.deck.cartes[c]._carteId});
				if(!carte.active) { continue; }
				if(carte.cubesat != scenario.initialisation.cubesat) { continue; }
				if(partie.deck.cartes[c].active){
					valeur = getValeurDeRegle(partie._id, carte.valNrg);
					if(valeur == 0) continue;
					listeCartesNrg.push({ _carteId: carte._carteId, carteId: carte.carteId, intitule: carte.intitule, valNrg: valeur });
				}
			}

  			while ((listeCartesNrg.length > 0) && (partie.deck.energie > -1)) {
  				
  				var carte = listeCartesNrg[0];
  				listeCartesNrg.shift();
  				//désactivation de la carte
  				for(var c=0; c < partie.deck.cartes.length; c++){
					if(partie.deck.cartes[c]._carteId === carte._carteId) partie.deck.cartes[c].active = false;
				}
				try {
					Parties.update({_id: partie._id},{$set:{ "deck.cartes": partie.deck.cartes }});
				} catch(e){
					return throwAlert("error","database_request", TAPi18n.__("error.database_request", "lancementProjet - désactivation carte"));
		  			console.error(TAPi18n.__("error.database_request", "lancementProjet - désactivation carte") , e);
				}

				partie.deck.energie += carte.valNrg;
  				if(deltaEnergie > -1) {
  					partie.deck.energie += deltaEnergie; 
  					Meteor.call("updateConstantes",partie, scenario, dateModif);
  				}
  			} 
  		}*/

  		var rapport = Meteor.apply("validationDeck", [partie, scenario, scenario.validation.niveauDetails, true], {returnStubValue: true});
  		rapport.cartes = rapport.cartes.concat(erreurs.cartes);
  		rapport.evenementsFinaux = erreurs.evenementsFinaux;
  		var score   = 0;
  		score = Meteor.apply("scoreDeck", [partie, scenario], {returnStubValue: true});
  			

  		try {
			affectedRow = Parties.update({_id: partie._id},{$set:{rapportFinal: rapport, score: score, finie: true }});
			if(affectedRow){
				Meteor.call("throwNotification", "PROJECT-LAUNCHED", user._id, {_partieId: partie._id, nom: partie.nom });
			}
		} catch(e){
			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "lancementProjet"));
		  	console.error(TAPi18n.__("error.database_request", "lancementProjet") , e);
		}

	},

	validationDeck: function(partie, scenario, niveauDetails, isLancement) {
		
		/*console.log(partie);
		console.log(scenario);
		console.log(niveauDetails);
		console.log(isLancement);*/
		try {
 			//check(partie, Match.ObjectIncluding({ _id: String, nom: String, userId: String, deck:{cartes: [], energie: Number, budget: Number, masse: Number, volume: Number, science: Number }, planete: {distance: Number} }));
  			//check(scenario, Match.ObjectIncluding({initialisation: {objectif: String}}));
  			//check(niveauDetails, String);
  			//check(isLancement, Boolean);

  		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction validationDeck : mauvais arguments");
		}
		var objResult = null;
		var erreurs = {_: [], categories: [], cartes: [], evenementsFinaux: [], isOK: true, isValid: true };
		var eCats = [];
		var carte  = null;
		var valeur = 0;
		if(Meteor.isClient) return;
		niveauDetails = Number(niveauDetails);

		var debug_n = 0;
		var hasError = false;

		var reg = new RegExp("(§nS)","g");
		do {
			do{
				console.log('debug - ' + (debug_n++));
				hasError = false;
				for(var d=0; d < partie.deck.cartes.length; d++){
					console.log("carte " + d + " sur " + partie.deck.cartes.length);
					var carteDeck = partie.deck.cartes[d];
					console.log("carte_id :" + carteDeck._carteId);
		  			if(carteDeck.active) {
		  				carte = Cartes.findOne({_id: carteDeck._carteId});
		  				if(!carte) { console.log("carte non trouvee :" + carteDeck._carteId);  continue;}
		  				console.log("carte active :" + carte.intitule.fr);
		  				if(contains(carteDeck.tags,"absurde")){
  							carteDeck.active = false;
  							erreurs.isOK = false;
							switch(niveauDetails){
								case 1:
									eCats[carte.categorie] = 1;
									break;
								case 2: 
									erreurs.cartes.push({carte: {_id: carte._id, carteId: carte.carteId, intitule: carte.intitule, categorie: carte.categorie }, absurde: true});
									break;		
							}
							hasError = true;
  						}

		  				var cond  = null;
		  				if(carte.regles.necessite.length > 0){
		  						console.log(carte.regles.necessite);
		  						console.log(carte.regles.necessite.replace(reg, carteDeck.nStructure));
		  						try {
		  							cond = JSON.parse(carte.regles.necessite.replace(reg, carteDeck.nStructure));

			  						console.log('regle parsee');
			  						objResult = Parties.aggregate([{$match: {_id: partie._id}}, {$match: cond}, {$unwind: "$deck.cartes"}, {$unwind: "$deck.cartes.tags"}, {$match: {"deck.cartes.active": true}}, {$group: {"_id":"$_id", "nbr":{$sum: 1}}} ]);
			  						if(!objResult || objResult.length == 0 || objResult.nbr == 0){
			  							console.log('erreur detectee');
			  							erreurs.isOK = false;
			  							console.log('erreur check');
										switch(niveauDetails){
											case 1:
												eCats[carte.categorie] = 1;
												break;
											case 2: 
												erreurs.cartes.push({carte: {_id: carte._id, carteId: carte.carteId, intitule: carte.intitule, categorie: carte.categorie }, necessite: true});
												break;		
										}
										hasError = true;
									} else { console.log('regle respectee'); }
		  						} catch(e){
		  							console.log("SYNTAXE INCORRECTE CARTE "+ carte.carteId + " NECESSITE " + carte.regles.necessite.replace(reg, carteDeck.nStructure));
		  						}
		  				}
		  				if(carte.regles.incompatible.length > 0){
		  						try {
			  						cond = JSON.parse(carte.regles.incompatible.replace(reg, carteDeck.nStructure));
			  						console.log('inc regle parsee');
			  						objResult = Parties.aggregate([{$match: {_id: partie._id}}, {$match: cond}, {$unwind: "$deck.cartes"}, {$unwind: "$deck.cartes.tags"}, {$match: {"deck.cartes.active": true}}, {$group: {"_id":"$_id", "nbr":{$sum: 1}}} ]);
			  						if(objResult && objResult.length > 0  && objResult.nbr > 0){
										console.log('inc erreur detectee');
										erreurs.isOK = false;
										console.log('inc erreur check');
										switch(niveauDetails){
											case 1:
												eCats[carte.categorie] = 1;
												break;
											case 2: 
												erreurs.cartes.push({carte: {_id: carte._id, carteId: carte.carteId, intitule: carte.intitule, categorie: carte.categorie }, incompatible: true});
												break;		
										}
										hasError = true;
									} else { console.log('inc regle respectee'); }
								} catch(e){
		  							console.log("SYNTAXE INCORRECTE CARTE "+ carte.carteId + " INCOMPATIBLE " + carte.regles.necessite.replace(reg, carteDeck.nStructure));
		  						}		  					
		  				}
		  				console.log('hasError' + hasError);
		  				if(hasError) {
		  					partie.deck.cartes[d].active = false;
		  					//réévaluer la constante d'énergie
		  					valeur = getValeurDeRegle(partie._id, carte.valNrg);
							if(contains(carte.tags, "energieGenerateur")) {
								partie.deck.energie -= valeur;
							}  else {
								partie.deck.energie += valeur;
							}
		  				}
		  			}
		  		};
		  		
			} while(hasError);
			console.log("passe 995");
			if(isLancement && hasError) { 
				try {
					Parties.update({_id: partie._id},{$set:{ "deck.cartes": partie.deck.cartes }});
				} catch(e){
					return throwAlert("error","database_request", TAPi18n.__("error.database_request", "lancementProjet - validation deck"));
	  				console.error(TAPi18n.__("error.database_request", "lancementProjet - validation deck") , e);
				}
			} else { 
				hasError = false; //pour sortir de la boucle en dehors du lancement 
			}
			if((partie.deck.energie < 0) && (isLancement)){
				//pas assez d'énergie, des composants qui en consomment vont devoir être désactivés aléatoirement
	  			var deltaEnergie = partie.deck.energie;
	  			var listeCartesNrg = [];
	  			//recherche des cartes actives consommant de l'énergie
	  			for(var c=0; c < partie.deck.cartes.length; c++){
					carte = Cartes.findOne({_id: partie.deck.cartes[c]._carteId});
					if(!carte.active) { continue; }
					if(carte.cubesat != scenario.initialisation.cubesat) { continue; }
					if(partie.deck.cartes[c].active){
						valeur = getValeurDeRegle(partie._id, carte.valNrg);
						if(valeur == 0) continue;
						listeCartesNrg.push({ _carteId: carte._carteId, carteId: carte.carteId, intitule: carte.intitule, valNrg: valeur, categorie: carte.categorie });
					}
				}

	  			while ((listeCartesNrg.length > 0) && (partie.deck.energie < 0)) {
	  				
	  				carte = listeCartesNrg[0];
	  				listeCartesNrg.shift();
	  				//désactivation de la carte
	  				for(var c=0; c < partie.deck.cartes.length; c++){
						if(partie.deck.cartes[c]._carteId === carte._carteId){
							partie.deck.cartes[c].active = false;
							switch(niveauDetails){
								case 1:
									eCats[carte.categorie] = 1;
									break;
								case 2: 
									erreurs.cartes.push({carte: {_id: carte._id, carteId: carte.carteId, intitule: carte.intitule, categorie: carte.categorie }, energie: true});
									break;		
							}
						}
					}
					partie.deck.energie += carte.valNrg;
					deltaEnergie += carte.valNrg;
	  				if(deltaEnergie > -1) {
	  					try {
							Parties.update({_id: partie._id},{$set:{ "deck.cartes": partie.deck.cartes }});
						} catch(e){
							return throwAlert("error","database_request", TAPi18n.__("error.database_request", "lancementProjet - validation deck - energie"));
	  						console.error(TAPi18n.__("error.database_request", "lancementProjet - validation deck - energie") , e);
						}
	  					Meteor.call("updateConstantes",partie, scenario, dateModif);
	  				}
	  			}
				hasError = true;
			}
		} while(hasError);
		console.log("passe 1055");

		//il faut vérifier les confitions globales : 1 énergie , 1 attitude etc.. obligatoire et on vérifie les conditions en tenant compte des cartes sélectionnées toujouts ACTIVES !!
		if(scenario.initialisation.cubesat){
			if(scenario.initialisation.cubesatOptions.nU == "1"){
				for(var t=0; t < ListTagsObligatoires.cubesat1U.length; t++){
					objResult = Parties.aggregate([{$match: {_id: partie._id}}, {$unwind: "$deck.cartes"}, {$unwind: "$deck.cartes.tags"}, {$match: {"deck.cartes.tags": ListTagsObligatoires.cubesat1U[t].tag, "deck.cartes.active": true }}, {$group: {"_id":"$_id", "nbr":{$sum: 1}}}]);
					// db.parties.aggregate([{$match: {_id: "kCW9MS4YXvypEr3mG"}}, {$unwind: "$deck.cartes"}, {$unwind: "$deck.cartes.tags"}, {$match: {"deck.cartes.tags": "structure1U", "deck.cartes.active": true }}, {$group: {"_id":"$_id", "nbr":{$sum: 1}}}]);
					if(!objResult || objResult.length == 0 || objResult.nbr == 0){
						erreurs.isOK = false;
						erreurs.isValid = false;
						switch(niveauDetails){
							case 1:
								eCats[ListTagsObligatoires.cubesat1U[t].categorie] =  1;
								break;
							case 2: 
								erreurs.cartes.push({tag: ListTagsObligatoires.cubesat1U[t].tag, cartes: Cartes.find({tags: ListTagsObligatoires.cubesat1U[t].tag, cubesat: true},{_id: 1, carteId: 1, intitule: 1, categorie: 1}).fetch()});
								break;		
						}
					}
					//console.log("validationDECK 3+END");
				}
			} 
			if(scenario.initialisation.cubesatOptions.nU == "3"){
				for(var t=0; t < ListTagsObligatoires.cubesat3U.length; t++){
					//console.log("validationDECK 3+3U:"+ListTagsObligatoires.cubesat3U[t].tag);
					objResult = Parties.aggregate([{$match: {_id: partie._id}}, {$unwind: "$deck.cartes"}, {$unwind: "$deck.cartes.tags"}, {$match: {"deck.cartes.tags": ListTagsObligatoires.cubesat3U[t].tag, "deck.cartes.active": true }}, {$group: {"_id":"$_id", "nbr":{$sum: 1}}}]);
					if(!objResult || objResult.length == 0 || objResult.nbr == 0){
						erreurs.isOK = false;
						erreurs.isValid = false;
						switch(niveauDetails){
							case 1:
								eCats[ListTagsObligatoires.cubesat3U[t].categorie] =  1;
								break;
							case 2: 
								erreurs.cartes.push({tag: ListTagsObligatoires.cubesat3U[t].tag, cartes: Cartes.find({tags: ListTagsObligatoires.cubesat3U[t].tag, cubesat: true},{_id: 1, carteId: 1, intitule: 1, categorie: 1}).fetch()});
								break;		
						}
					}
				}
			}
			for(var t=0; t < ListTagsObligatoires.cubesat.length; t++){
				//console.log("validationDECK 3+cubseat:"+ListTagsObligatoires.cubesat[t].tag);
				objResult = Parties.aggregate([{$match: {_id: partie._id}}, {$unwind: "$deck.cartes"}, {$unwind: "$deck.cartes.tags"}, {$match: {"deck.cartes.tags": ListTagsObligatoires.cubesat[t].tag, "deck.cartes.active": true }}, {$group: {"_id":"$_id", "nbr":{$sum: 1}}}]);
				if(!objResult || objResult.length == 0 || objResult.nbr == 0){
					erreurs.isOK = false;
					erreurs.isValid = false;
					switch(niveauDetails){
						case 1:
							eCats[ListTagsObligatoires.cubesat[t].categorie] =  1;
							break;
						case 2: 
							erreurs.cartes.push({tag: ListTagsObligatoires.cubesat[t].tag, cartes: Cartes.find({tags: ListTagsObligatoires.cubesat[t].tag, cubesat: true},{_id: 1, carteId: 1, intitule: 1, categorie: 1}).fetch()});
							break;		
					}
				}
			}
		}	
		if(!scenario.initialisation.cubesat){
			for(var t=0; t < ListTagsObligatoires.global.length; t++){
				objResult = Parties.aggregate([{$match: {_id: partie._id}}, {$unwind: "$deck.cartes"}, {$unwind: "$deck.cartes.tags"}, {$match: {"deck.cartes.tags": ListTagsObligatoires.global[t].tag, "deck.cartes.active": true }}, {$group: {"_id":"$_id", "nbr":{$sum: 1}}}]);
				if(!objResult || objResult.length == 0 || objResult.nbr == 0){
					erreurs.isOK = false;
					erreurs.isValid = false;
					switch(niveauDetails){
						case 1:
							eCats[ListTagsObligatoires.global[t].categorie] = 1;
							break;
						case 2: 
							erreurs.cartes.push({tag: ListTagsObligatoires.global[t].tag, cartes: Cartes.find({tags: ListTagsObligatoires.global[t].tag, cubesat: false},{_id: 1, carteId: 1, intitule: 1, categorie: 1}).fetch()});
							break;		
					}
				}
			}
		
			if(scenario.initialisation.objectif === "espace"){
				for(var t=0; t < ListTagsObligatoires.espace.length; t++){
					objResult = Parties.aggregate([{$match: {_id: partie._id}}, {$unwind: "$deck.cartes"}, {$unwind: "$deck.cartes.tags"}, {$match: {"deck.cartes.tags": ListTagsObligatoires.espace[t].tag, "deck.cartes.active": true }}, {$group: {"_id":"$_id", "nbr":{$sum: 1}}}]);
					if(!objResult || objResult.length == 0 || objResult.nbr == 0){
						erreurs.isOK = false;
						erreurs.isValid = false;
						switch(niveauDetails){
							case 1:
								eCats[ListTagsObligatoires.espace[t].categorie] = 1;
								break;
							case 2: 
								erreurs.cartes.push({tag: ListTagsObligatoires.espace[t].tag, cartes: Cartes.find({tags: ListTagsObligatoires.espace[t].tag, cubesat: false},{_id: 1, carteId: 1, intitule: 1, categorie: 1}).fetch()});
								break;		
						}
					}
				}
			}
			if(scenario.initialisation.objectif === "planete"){
				if(partie.planete.distance > 5){
					for(var t=0; t < ListTagsObligatoires.distance[partie.planete.distance.toString()].length; t++){
						objResult = Parties.aggregate([{$match: {_id: partie._id}}, {$unwind: "$deck.cartes"}, {$unwind: "$deck.cartes.tags"}, {$match: {"deck.cartes.tags": ListTagsObligatoires.distance[partie.planete.distance.toString()][t].tag, "deck.cartes.active": true }}, {$group: {"_id":"$_id", "nbr":{$sum: 1}}}]);
						if(!objResult || objResult.length == 0 || objResult.nbr == 0){
							erreurs.isOK = false;
							erreurs.isValid = false;
							switch(niveauDetails){
								case 1:
									eCats[ListTagsObligatoires.distance[partie.planete.distance.toString()][t].categorie] =  1;
									break;
								case 2: 
									erreurs.cartes.push({tag: ListTagsObligatoires.distance[partie.planete.distance.toString()][t].tag, cartes: Cartes.find({tags: ListTagsObligatoires.distance[partie.planete.distance.toString()][t].tag, cubesat: false},{_id: 1, carteId: 1, intitule: 1, categorie: 1}).fetch()});
									break;		
							}
						}
					}
				} else {
					for(var t=0; t < ListTagsObligatoires.distance["10"].length; t++){
						objResult = Parties.aggregate([{$match: {_id: partie._id}}, {$unwind: "$deck.cartes"}, {$unwind: "$deck.cartes.tags"}, {$match: {"deck.cartes.tags": ListTagsObligatoires.distance["10"][t].tag, "deck.cartes.active": true }}, {$group: {"_id":"$_id", "nbr":{$sum: 1}}}]);
						if(!objResult || objResult.length == 0 || objResult.nbr == 0){
							erreurs.isOK = false;
							erreurs.isValid = false;
							switch(niveauDetails){
								case 1:
									eCats[ListTagsObligatoires.distance["10"][t].categorie] = 1;
									break;
								case 2: 
									erreurs.cartes.push({tag: ListTagsObligatoires.distance["10"][t].tag, cartes: Cartes.find({tags: ListTagsObligatoires.distance["10"][t].tag, cubesat: false},{_id: 1, carteId: 1, intitule: 1, categorie: 1}).fetch()});
									break;		
							}
						}
					}
				}
				var hasAtterrisseur = false;
				objResult = Parties.aggregate([{$match: {_id: partie._id}}, {$unwind: "$deck.cartes"}, {$unwind: "$deck.cartes.tags"}, {$match: {"deck.cartes.tags": "atterrisseurPlateforme", "deck.cartes.active": true }}, {$group: {"_id":"$_id", "nbr":{$sum: 1}}}]);
				if(objResult && ((objResult.length > 0) || (objResult.nbr > 0))){
					hasAtterrisseur = true;
				}
				if(hasAtterrisseur){
					if(!partie.planete.atterrisseur){
						erreurs.isOK = false;
						erreurs.isValid = false;
						switch(niveauDetails){
							case 1:
								eCats["J"] = 1;
								break;
							case 2: 
								erreurs.cartes.push({tag: "atterrisseurPlateforme", cartes: Cartes.find({tags: "atterrisseurPlateforme", cubesat: false},{_id: 1, carteId: 1, intitule: 1, categorie: 1}).fetch()});
								break;		
							}
					} else {
						if(partie.planete.atmosphere){
							for(var t=0; t < ListTagsObligatoires.atterrisseurAtmosphere.length; t++){
								objResult = Parties.aggregate([{$match: {_id: partie._id}}, {$unwind: "$deck.cartes"}, {$unwind: "$deck.cartes.tags"}, {$match: {"deck.cartes.tags": ListTagsObligatoires.atterrisseurAtmosphere[t].tag, "deck.cartes.active": true }}, {$group: {"_id":"$_id", "nbr":{$sum: 1}}}]);
								if(!objResult || objResult.length == 0 || objResult.nbr == 0){
									erreurs.isOK = false;
									erreurs.isValid = false;
									switch(niveauDetails){
										case 1:
											eCats[ListTagsObligatoires.atterrisseurAtmosphere[t].categorie] = 1;
											break;
										case 2: 
											erreurs.cartes.push({tag: ListTagsObligatoires.atterrisseurAtmosphere[t].tag, cartes: Cartes.find({tags: ListTagsObligatoires.atterrisseurAtmosphere[t].tag, cubesat: false},{_id: 1, carteId: 1, intitule: 1, categorie: 1}).fetch()});
											break;		
									}
								}
							}
						}
					}
				}
				
			}
		}
		console.log("passe 1183");
		//if faut vérifier les constantes d'énergie, masse,...poids
		if(partie.deck.energie < 0){
 			erreurs.isOK = false;
 			erreurs.isValid = false;
 			erreurs["_"].push({constante: "energie", valeur: partie.deck.energie});
 		}
 		if(partie.deck.budget < 0){
 			erreurs.isOK = false;
 			erreurs.isValid = false;
 			erreurs["_"].push({constante: "budget", valeur: partie.deck.budget});
 		}
 		if(partie.deck.masse < 0){
 			erreurs.isOK = false;
 			erreurs.isValid = false;
 			erreurs["_"].push({constante: "masse", valeur: partie.deck.masse});
 		}
 		if(partie.deck.volume < 0){
 			erreurs.isOK = false;
 			erreurs.isValid = false;
 			erreurs["_"].push({constante: "volume", valeur: partie.deck.volume});
 		}
 		if(partie.deck.science == 0){
 			erreurs.isOK = false;
 			erreurs["_"].push({constante: "science", valeur: partie.deck.science});
 		}
 		console.log("POIDS STRUCTURES");
 		console.log(partie.deck.structures.masses);
 		for(var s=0; s < partie.deck.structures.masses.length; s++){
 			if(partie.deck.structures.masses[s] < 0){
 				erreurs.isOK = false;
 				erreurs.isValid = false;
 				erreurs["_"].push({constante: "masseStructure", valeur: partie.deck.structures.masses[s], nStructure: partie.deck.structures.ids[s]});
 			}
 			console.log("Poids de la structure " + partie.deck.structures.masses[s]);
 		}
 		


  		erreurs.categories = _.keys(eCats);
  		console.log("RESULTATS");
		console.log(erreurs);
		return erreurs;
	},

	scoreDeck: function(partie, scenario){
		if((!partie.rapportFinal) || (!partie.rapportFinal.isValid)) return 0;
		var score = partie.deck.science * scenario.score.ptsParScience - ((partie.tempsTotal / 60) * scenario.score.ptsParTps);
		if(score < 0) return 0;
		return score;
	},

	/**
	* Calcul des constantes de la partie (budget, énergie, poids, volume, science) en tenant compte des cartes choisies, des évènements, du pourcentage du lanceur, des cartes actives
	* @params partie (Object Partie)
	*         scenario (Object Scenario)
	*/
	updateConstantes: function(partie, scenario, dateModif){
		if((partie.finie == 1) || (partie.active == 0)) { return throwAlert("error","partie_close", TAPi18n.__("error.partie_close")); }
		partie.deck.budget     = scenario.initialisation.budget;
		partie.deck.budgetMax  = partie.deck.budget;
		partie.deck.masse      = 0;
		partie.deck.masseMax   = 0;
		partie.deck.volume     = 0;
		partie.deck.volumeMax  = 0;
		partie.deck.energie    = 0;
		partie.deck.energieMax = 0;
		partie.deck.science    = 0;
		//parcours des cartes du deck
		var carte  = null;
		var valeur = 0;

		var nbrStructures = (_.filter(partie.deck.cartes, function(carte){ return ((carte.categorie == "Z") && (!contains(carte.tags, "atterrisseurPlateforme"))); })).length;
		for(var c=0; c < partie.deck.cartes.length; c++){
			
			carte = Cartes.findOne({_id: partie.deck.cartes[c]._carteId});
			if(!carte){
				console.log("carte undefined");
				partie.deck.cartes.splice(c,1);
				c--;
				Parties.update({_id: partie._id},{$set:{"deck.cartes": partie.deck.cartes}});
				continue;
			}
			if(!carte.active) { continue; }
			if(carte.cubesat != scenario.initialisation.cubesat) { continue; }
			if(partie.deck.cartes[c].active){//carte désactivée dans la partie, elle n'a plus d'impact sur l'énergie et la science mais bien sur le budget, la masse et le volume.
				valeur = getValeurDeRegle(partie._id, carte.valNrg);
				if(contains(carte.tags, "energieGenerateur")) {
					if(contains(carte.tags, "energieSolaire")) {
						valeur = Math.floor(valeur * partie.planete.rayonnement);
					}
					partie.deck.energie += valeur;
					partie.deck.energieMax += valeur;
				}  else {
					partie.deck.energie -= valeur;
				}
				valeur = getValeurDeRegle(partie._id, carte.valSci);
				partie.deck.science += valeur;
			}
			
			valeur = getValeurDeRegle(partie._id, carte.valEur);
			if(contains(carte.tags, "lanceur")){//% du lanceur utilisé
				partie.deck.budget -= Math.floor(partie.budgetLanceur * valeur);
			} else {
				if(contains(carte.tags, "orbite")){
					partie.deck.budget -= (nbrStructures * valeur);
				} else {
					partie.deck.budget -= valeur;
				}
			}
			
			valeur = getValeurDeRegle(partie._id, carte.valPds);
			if(contains(carte.tags, "lanceur")){//% du lanceur utilisé
				partie.deck.masse += Math.floor(partie.budgetLanceur * valeur);
				partie.deck.masseMax += Math.floor(partie.budgetLanceur * valeur);
			} else {	
				if(partie.deck.cartes[c].nStructure > 0){
					if(partie.deck.cartes[c].categorie == "Z"){
						/*console.log("PDS STRUCTURE");
						console.log(partie.deck.structures.ids.indexOf(partie.deck.cartes[c].nStructure));
						console.log(partie.deck.structures.masses);
						console.log(carte.maxPds);*/
						partie.deck.structures.masses[partie.deck.structures.ids.indexOf(partie.deck.cartes[c].nStructure)] += carte.maxPds;
					} else {
						partie.deck.structures.masses[partie.deck.structures.ids.indexOf(partie.deck.cartes[c].nStructure)] -= valeur;
					}
				}
				partie.deck.masse -= valeur;
			}	
			
			valeur = getValeurDeRegle(partie._id, carte.valVol);
			if(contains(carte.tags, "lanceur")){//% du lanceur utilisé
				partie.deck.volume += Math.floor(partie.budgetLanceur * valeur);
				partie.deck.volumeMax += Math.floor(partie.budgetLanceur * valeur);
			} else {	
				partie.deck.volume -= valeur;
			}
						
		}

		//parcours des évènements
		var evenement = null;
		for(var e=0; e < partie.eventIds.length; e++){
			evenement = Evenements.find({_id: partie.eventIds[e]});
			if(!evenement.active) { continue; }
			if(evenement.cubesat != scenario.initialisation.cubesat) { continue; }
			partie.deck.energie = partie.deck.energie + evenement.deltaNgr;
			partie.deck.energieMax += ((evenement.deltaNgr > 0) ? evenement.deltaNgr : 0);
			partie.deck.budget  = partie.deck.budget + evenement.deltaEur;
			partie.deck.budgetMax += ((evenement.deltaEur > 0) ? evenement.deltaEur : 0);
			partie.deck.masse   = partie.deck.masse + evenement.deltaPds;
			partie.deck.masseMax += ((evenement.deltaPds > 0) ? evenement.deltaPds : 0);
			partie.deck.volume  = partie.deck.volume + evenement.deltaVol;
			partie.deck.volumeMax += ((evenement.deltaVol > 0) ? evenement.deltaVol : 0);
			partie.deck.science = partie.deck.science + evenement.deltaSci; 
		}

		//budget appel au pair, expert....
		if(partie.experts.length > 0){
			//console.log("nbr experts : "+ partie.experts.length + ", nbr gratuits: " + scenario.expertise.nbrExpertsGratuits + ", cout: "+scenario.expertise.malusBudget);
			partie.deck.budget -= (partie.experts.length - scenario.expertise.nbrExpertsGratuits) * scenario.expertise.malusBudget;
		} 
		if(partie.peers.length > 0){
			var nbrAppels = 0;
			for(var a=0; a < partie.peers.length; a++){
				if(partie.peers[a].dateDebut > 0) nbrAppels++;
			}
			partie.deck.budget -= nbrAppels * scenario.expertise.malusBudget; 
		}
		var affectedRow = false;
		var now = new Date();
		var tps = partie.tempsTotal + (now.getTime() - dateModif) / 1000;
		try {

			affectedRow = Parties.update({_id: partie._id},{$set:{tempsTotal: tps, dateModif: now, "deck.energie": partie.deck.energie, "deck.budget": partie.deck.budget, "deck.masse": partie.deck.masse, "deck.volume": partie.deck.volume, "deck.science": partie.deck.science, "deck.energieMax": partie.deck.energieMax, "deck.budgetMax": partie.deck.budgetMax, "deck.masseMax": partie.deck.masseMax, "deck.volumeMax": partie.deck.volumeMax, "deck.structures.masses": partie.deck.structures.masses}});
			if(affectedRow && Meteor.isClient) Session.set("dateModif", now.getTime());
		} catch(e){
			return throwAlert("error","database_request", TAPi18n.__("error.database_request", "updateConstantes"));
				console.error(TAPi18n.__("error.database_request", "updateConstantes") , e);
		}
	}

	
});



function hasPrivilege(partie, scenario, userId){
	if(partie.userId == userId) return true;
	var peer = _.findWhere(partie.peers, {userId: userId});
	if(peer){
		if((peer.dateDebut > 0) && ((scenario.collaboration.tpsMaxParAppel == 0) || (peer.dateDebut.getTime() + scenario.collaboration.tpsMaxParAppel > now.getTime()))) return true;
	}
	return false;
}