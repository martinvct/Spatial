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
	setScenarioToPartie: function(partie, scenario){
		//TODO appliquer les paramètres du scénario à la partie 
		return partie;
	}
});