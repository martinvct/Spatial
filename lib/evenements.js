Evenements = new Mongo.Collection('evenements');

Meteor.methods({
  setEvenement: function(evenement){
  	var user = Meteor.userId;
  	if (!(user && user.admin)) { throw new Meteor.Error(TAPi18n.__("error.privilege_user")); }
  	check(evenement, {
  		eventId: String,
  		nom: String,
  		description: Match.Optional(String),
      illustrations: {big:  Match.Optional(String), normal: Match.Optional(String), small: Match.Optional(String) },
      isLancement: Boolean,
  		targetCarteIds: Match.Optional([String]),
  		targetCarteTags: Match.Optional([String]),
      deltaTps: Match.Optional(Number),
  		deltaEur: Match.Optional(Number),
      deltaNrg: Match.Optional(Number),
      deltaPds: Match.Optional(Number),
      deltaVol: Match.Optional(Number),
      deltaSci: Match.Optional(Number),
  		active: Boolean
  	}); 	
	var result = Evenements.upsert({eventId: evenement.eventId}, evenement);
	if(result){
		if(active) {
			if(result.insertedId){
				evenement.insertedId = result.insertedId;
				Meteor.call("throwNotification","EVENT-NEW", "*", {evenement: evenement});
			} else {
				Meteor.call("throwNotification","EVENT-UPD", "*", {evenement: evenement});
			}
		}
		console.log(TAPi18n.__("message.evenement_enregistre", evenement.eventId + " " + evenement.intitule));
	}
  },

  updActiveEvenement: function(_eventId, active){
  	var user = Meteor.userId;
  	if (!(user && user.admin)) { throw new Meteor.Error(TAPi18n.__("error.privilege_user")); }
  	check(_eventId, Meteor.Collection.ObjectId);
  	check(active, Boolean);

  	var affectedRow = Evenements.update({_id: _eventId}, {$set: {active: active}});
  	if(affectedRow){
  		if(active){
  			var evenement = Evenements.findOne({_id: _eventId});
  			Meteor.call("throwNotification","EVENR-ACTIVE", "*", {evenement: evenement});
  		}
  	}
  },

  removeEvenement: function(_eventId){
  	var user = Meteor.user();
  	if (!(user && user.admin)) { throw new Meteor.Error(TAPi18n.__("error.privilege_user")); }
  	if (Meteor.call("checkEvenementUtilise",_eventId)) { throw new Meteor.Error(TAPi18n.__("error.evenement_utilise")); }
  	var evenement = Evenements.findOne({_id: _eventId});
  	var affectedRow = Evenements.remove({_id: _eventId});
  	if(affectedRow){
  		Meteor.call("throwNotification","EVENT-DEL", user.userId, {evenement: evenement});
  	}
  },

  getRandomEvenement: function(eventIds){
    check(eventIds, Match.Optional([Meteor.Collection.ObjectId]));
    if(eventIds == null) eventIds = new Array();
    var totEvenements = Evenements.find({},{_id: 1}).count() - eventIds.length;
    if(totEvenement == 0) return null;
    return Evenements.find({_id: {$nin: eventIds}}).skip(Math.floor(Math.random() * (totEvenements))).limit(1);
  }
});