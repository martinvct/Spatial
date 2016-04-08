Scenarios = new Mongo.Collection('scenarios');


if(Meteor.isServer){
	Meteor.publish("getScenario", function(_id, isAdmin){
		var user = this.userId;
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
  		if(isAdmin){
  			return Scenarios.find({_id: _id});
  		} else {
  			return Scenarios.find({_id: _id, active: true});
  		}
	});
	Meteor.publish("getScenarios", function(isAdmin){
		var user = this.userId;
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
  		if(isAdmin){
  			return Scenarios.find({});
  		} else {
  			return Scenarios.find({active: true});
  		}
	});
}

Meteor.methods({
	/**
	* Recherche un scénario
	* @params : _scenarioId (ObjectID du scénario recherché)
	* @return : Objet Scénario
	*/
	getScenario: function(_scenarioId){
		try {
			check(_scenarioId, String);
		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction getScenario : mauvais arguments");
		}	
		return Scenarios.findOne({_id : _scenarioId});
	},
	getScenarios: function(){
		var user = Meteor.user();
  		if (!(user)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
  		if(user.profile.admin){
  			return Scenarios.find({});
  		} else {
  			return Scenarios.find({active: true});
  		}
	},

	setScenario: function(scenario){
		var user = Meteor.user();
  		if (!(user && user.profile.admin)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
		try{
			/*check(scenario, Match.ObjectIncluding({
				intitule: String,
				description: String,
				active: Boolean,
				initialisation: { cubesat: Boolean, budget: Number, objectif: String, planetes: Match.Optional([String]), cubesatOptions: {nU: Number}  },
				construction: { tpsMax: Number },
				expertise: { nbrMaxExperts: Number, malusTemps: Number, malusBudget: Number, malusNbrEvenements: Number, niveauDetails: String, nbrExpertsGratuits: Number },
				collaboration: { nbrMaxAppels: Number, malusTemps: Number, malusBudget: Number, malusNbrEvenements: Number, tpsMaxParAppel: Number, nbrAppelsGratuits: Number },
				evenement: { nbrMax: Number, intervalleTps: Number },
				validation: { niveauDetails: String },
				lancement: { nbrEvenements: Number },
				score: { ptsParScience: Number, ptsParTps: Number }
			}));*/
		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction setScenario : mauvais arguments");
		}
		scenario.userId = Meteor.userId();
		scenario.dateModif = new Date();
		var result = false;
		if(scenario.initialisation.objectif == "planete"){
			if(scenario.initialisation.planetes.length == 0){
				return throwAlert("error","scenario_planetes", TAPi18n.__("error.scenario_planetes"));
			}
		}
		if(scenario.initialisation.objectif == "espace"){
			scenario.initialisation.planetes = ["TERRE"];
		}
		if(scenario.hasOwnProperty("_id")){
			//if (Meteor.apply("checkScenarioUtilise",[scenario._id], {returnStubValue: true})) { return throwAlert("error","scenario_utilise", TAPi18n.__("error.scenario_utilise")); }
			result = Scenarios.upsert({_id: scenario._id}, scenario);
		} else {
			result = Scenarios.insert(scenario);
		}	
	    if(result){
	  		if(scenario.active) {
	  			if(result.insertedId){
	  				scenario._id = result.insertedId;
	  				Meteor.call("throwNotification","SCENAR-NEW", "*", {scenario: scenario});
	  			} else {
	  				Meteor.call("throwNotification","SCENAR-UPD", "*", {scenario: scenario});
	  			}
	  		}
	  		if(Meteor.isClient) sAlert.success(TAPi18n.__("message.scenario_enregistre",  scenario.intitule.fr ));
	  		return scenario._id;
	  	}
	  	return 0;
	},
	getPlanetesDuScenario: function(scenario){
		try{
			check(scenario, Match.ObjectIncluding({
				intitule: String,
				active: Boolean,
				initialisation: { cubesat: Boolean, budget: Number, objectif: String, planetes: Match.Optional([Meteor.Collection.ObjectID]) }
			}));
		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction getPlanetesDuScenario : mauvais arguments");
		}
		if((scenario.initialisation.objectif != "planete") || (scenario.initialisation.planetes.length == 0)) { return; }
		return Planetes.find({_id: {$in: scenario.initialisation.planetes }});
	},
	launchEvent: function(partie, scenario){
		if((scenario.evenement.intervalleTps > 0) && ((scenario.evenement.nbrMax == 0) || (scenario.evenement.nbrMax < partie.nbrEventsFromTimer))){
			var evenement = Meteor.apply("getRandomEvenement", [partie.eventIds, false, scenario.cubesat]);
			Meteor.call("addEvenementToDeck", partie, evenement);
		}
	}


});