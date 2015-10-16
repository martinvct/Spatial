Test = new Mongo.Collection('testmet');

Meteor.methods({
	initTest: function(){
		//Test.insert({nom: "chat", donnees: [{id: 1, t:2, c:3}, {id:2, t:4, c:5}, {id:2, t:0, c:6}]});
		//Test.insert({nom: "chien", donnees: [{id: 1, t:8, c:9}, {id:2, t:11, c:12}]});
	},
	countTest: function(){
		//db.testmet.aggregate([{$unwind: "$donnees"}, {$match: {"donnees.t": 0}},{$group: {"_id":"$nom", "nbr":{$sum: 1}}}]);
	},
	updTest: function(){
		/*db.testmet.update({nom: "chat", "donnees.id":2, "donnees.t": 0},{$set: {"donnees.$.t": 10}});

		db.testmet.update({nom: "chat"}, {$set: {donnees: [{id: 1, t:2, c:3}, {id:2, t:4, c:5}, {id:2, t:0, c:6}], tab:[1,2,3,4]}});
		db.testmet.update({nom: "chien"}, {$set: {tab:[3,4,5,6]}});

		db.testmet.update({nom: "chat"}, {$set: {obj:{nom: "minou", age:5}}});
		db.testmet.update({nom: "chien"}, {$set: {obj:{nom:"wourf", age:7}}});


		db.testmet.update({nom:"chien"},{$set:{"obj.examens": [{date: 5, examen: 3},{date: 10, examen: 4}]}});
		db.testmet.update({nom:"chien"},{$push: {"obj.examens": {date: 15, examen: 5}}});

		db.testmet.update({nom:"chien"},{$pull: {"obj.examens": {date: 15}}});*/
	}
});