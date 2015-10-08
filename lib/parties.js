Parties = new Mongo.Collection('parties');


Meteor.methods({
	checkCarteUtilisee: function(_id){
		var used = true;
		check(_id, Meteor.Collection.ObjectId);
		try{
			if(Parties.find({deck:{carteIds: _id}}).count() == 0) used = false;
		} catch(e) {
			console.error(TAPi18n.__("error.database_request", "checkCarteUtilisee") , e);
		}
		return used;
	}
});