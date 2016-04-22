if (Meteor.isClient) {
	Template.MenuPrincipal.events({
		'click #configuration': function(event){
			Router.go('Config');
		}
	});
	Template.Config.events({
		'click #listeScenarios': function(event){
			Router.go('ConfigScenarios');
		},
		'click #listeCartes': function(event){
			Router.go('ConfigCartes');
		},
		'click #listeEvenements': function(event){
			Router.go('ConfigEvenements');
		},
		'click #listeUtilisateurs': function(event){
			Router.go('ConfigUtilisateurs');
		},
		'click #retour': function(event){
			Router.go('Home');
		}
	});
	Template.Scores.helpers({
		scores: function(){
			var scores = Parties.find({finie: true}, {sort :{score: -1}, limit: 20}).fetch();
			for(var s=0; s < scores.length; s++){
				scores[s].user = Meteor.users.findOne({_id: scores[s].userId},{profile: 1});
			}
			return scores;
		}
	});
}