Scenarios = new Mongo.Collection('scenarios');

Meteor.methods({
	/**
	* Recherche un scénario
	* @params : _scenarioId (ObjectID du scénario recherché)
	* @return : Objet Scénario
	*/
	getScenario: function(_scenarioId){
		check(_scenarioId, Meteor.Collection.ObjectID);
		return Scenarios.findOne({_id : _scenarioId});
	}
});