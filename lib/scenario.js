Scenarios = new Mongo.Collection('scenarios');

Meteor.methods({
	/**
	* Recherche un scénario
	* @params : _scenarioId (ObjectID du scénario recherché)
	* @return : Objet Scénario
	*/
	getScenario: function(_scenarioId){
		try {
			check(_scenarioId, Meteor.Collection.ObjectID);
		} catch(e){
			return throwError("bad-parameters", "Fonction getScenario : mauvais arguments");
		}	
		return Scenarios.findOne({_id : _scenarioId});
	},
	setScenario: function(scenario){
		var user = Meteor.user();
  		if (!(user && user.admin)) { return throwError("privilege_user", TAPi18n.__("error.privilege_user")); }
		try{
			check(scenario, Match.ObjectIncluding({
				intitule: String,
				description: String,
				active: Boolean,
				initialisation: { cubesat: Boolean, budget: Number, objectif: String, planetes: Match.Optional([Meteor.Collection.ObjectID]), cubesatLimites: {poidsMax: Number, volumeMax: Number}  },
				construction: { tpsMax: Number },
				expertise: { nbrMaxExperts: Number, malusTemps: Number, malusBudget: Number, malusNbrEvenement: Number, niveauDetails: String, nbrExpertsGratuits: Number },
				collaboration: { nbrMaxAppels: Number, malusTemps: Number, malusBudget: Number, malusNbrEvenement: Number, tpsMaxParAppel: Number },
				evenement: { nbrMax: Number, intervalleTps: Number },
				validation: { niveauDetails: String },
				lancement: { nbrEvenements: Number },
				score: { ptsParScience: Number, ptsParTps: Number }
			}));
		} catch(e){
			return throwError("bad-parameters", "Fonction setScenario : mauvais arguments");
		}
		var result = false;
		if(scenario.hasOwnProperty("_id")){
			if (Meteor.apply("checkScenarioUtilise",[scenario._id], {returnStubValue: true})) { return throwError("scenario_utilise", TAPi18n.__("error.scenario_utilise")); }
			result = Scenarios.upsert({_id: scenario._id}, scenario);
		} else {
			result = Scenarios.insert(scenario);
		}	
	  	if(result){
	  		if(active) {
	  			if(result.insertedId){
	  				scenario._id = result.insertedId;
	  				Meteor.call("throwNotification","SCENAR-NEW", "*", {scenario: scenario});
	  			} else {
	  				Meteor.call("throwNotification","SCENAR-UPD", "*", {scenario: scenario});
	  			}
	  		}
	  		sAlert.success(TAPi18n.__("message.scenario_enregistree", scenario.scenarioId + " " + scenario.intitule ));
	  	}
	},
	getPlanetesDuScenario: function(scenario){
		try{
			check(scenario, Match.ObjectIncluding({
				intitule: String,
				active: Boolean,
				initialisation: { cubesat: Boolean, budget: Number, objectif: String, planetes: Match.Optional([Meteor.Collection.ObjectID]) }
			}));
		} catch(e){
			return throwError("bad-parameters", "Fonction getPlanetesDuScenario : mauvais arguments");
		}
		if((scenario.initialisation.objectif != "planete") || (scenario.initialisation.planetes.length == 0)) { return; }
		return Planetes.find({_id: {$in: scenario.initialisation.planetes }});
	}


});