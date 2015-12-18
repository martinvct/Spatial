Test = new Mongo.Collection('testmet');

Meteor.methods({
	initTest: function(){
		//Test.insert({nom: "chat", donnees: [{id: 1, t:2, c:3}, {id:2, t:4, c:5}, {id:2, t:0, c:6}]});
		//Test.insert({nom: "chien", donnees: [{id: 1, t:8, c:9}, {id:2, t:11, c:12}]});
		//db.testmet.insert({nom: "cheval", donnees: [{id: 1, t:2, c:3}, {id:2, t:4, c:5}, {id:2, t:0, c:6}], data:[{i:1, vals:[1,2,3,4,5]},{i:2, vals:[2,4,6,8,10]}]});
	},
	countTest: function(){
		//db.testmet.aggregate([{$unwind: "$donnees"}, {$match: {"donnees.t": 0}},{$group: {"_id":"$nom", "nbr":{$sum: 1}}}]);
		//db.testmet.aggregate([{$match: {nom: "cheval"}}, {$unwind: "$data"}, {$unwind: "$data.vals"}, {$match: {"data.vals": 2}},{$group: {"_id":"$nom", "nbr":{$sum: 1}}}]);
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
	},
	loadChat: function(){
		return Test.findOne({nom: "chat"});
	},
	updChat: function(){
		Test.update({nom: "chat"},{$set: {prenom: "Rififi"}});
	},
	countChat: function(){
		return Test.find({nom: "chat"}).count();
	},
	testCheck: function(){
		var test = {param: "un", param2:"deux"};
		try {
			check(test, Match.ObjectIncluding({param: String}));
		} catch(e){
			return throwAlert("error","bad-parameters", "Fonction testCheck : mauvais arguments");
		}	
		console.log("test ok");
		return throwAlert("error","Exception","testCheck exception launched");
		console.log("launch ok");
	}

});