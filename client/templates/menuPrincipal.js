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
		'click #listeUtilisateurs': function(event){
			Router.go('ConfigUtilisateurs');
		},
		'click #retour': function(event){
			Router.go('Home');
		}
	});
}