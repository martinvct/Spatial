Scenarios = new Mongo.Collection('scenarios');

Meteor.methods({
	getScenario: function(_scenarioId){
		check(_scenarioId, Meteor.Collection.ObjectId);
		return Scenarios.findOne({_id : _scenarioId});
	}
});