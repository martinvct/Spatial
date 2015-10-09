Parties = new Mongo.Collection('parties');


Meteor.methods({
	checkCarteUtilisee: function(_carteId){
		var used = true;
		check(_carteId, Meteor.Collection.ObjectId);
		try{
			if(Parties.find({deck:{carteIds: _carteId}}).count() == 0) used = false;
		} catch(e) {
			console.error(TAPi18n.__("error.database_request", "checkCarteUtilisee") , e);
		}
		return used;
	},
	checkEvenementUtilise: function(_eventId){
		var used = true;
		check(_eventId, Meteor.Collection.ObjectId);
		try{
			if(Parties.find({eventIds: _eventId}).count() == 0) used = false;
		} catch(e) {
			console.error(TAPi18n.__("error.database_request", "checkEvenementUtilise") , e);
		}
		return used;
	},
	newPartie: function(_scenarioId){
		var userId = Meteor.userId;
  		if (!(userId)) { throw new Meteor.Error(TAPi18n.__("error.privilege_anonyme")); }
  		check(_scenarioId, Meteor.Collection.ObjectId);
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
	loadParties: function(){
		var userId = Meteor.userId;
  		if (!(userId)) { throw new Meteor.Error(TAPi18n.__("error.privilege_anonyme")); }
  		return Parties.find({userId: userId, active: true, finie: false},{_id: 1, nom: 1, dateDebut: 1, scenarioId: 1}).sort({dateModif: -1});
 	},
	loadAllParties: function(){
		var userId = Meteor.userId;
  		if (!(userId)) { throw new Meteor.Error(TAPi18n.__("error.privilege_anonyme")); }
  		return Parties.find({userId: userId, active: true},{_id: 1, nom: 1, dateDebut: 1, scenarioId: 1, score: 1, dateModif: 1}).sort({finie: 1, dateModif: -1});
	},
	loadPartie: function(_partieId){
		var userId = Meteor.userId;
  		if (!(userId)) { throw new Meteor.Error(TAPi18n.__("error.privilege_anonyme")); }
  		check(_partieId, Meteor.Collection.ObjectId);
  		return Parties.findOne({userId: userId, _id: _partieId});
	}

});