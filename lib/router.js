/*
	router          : https://github.com/iron-meteor/iron-router
	router guide    : http://iron-meteor.github.io/iron-router/
	router examples : https://github.com/iron-meteor/iron-router/tree/devel/examples
*/



Router.configure({
  layoutTemplate: 'Layout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});



	Router.onBeforeAction(function(){
		if(Meteor.userId() && Meteor.isClient){
			Meteor.subscribe("getLastNotifications");
		}
		this.next();
	}, { except: ['Notifications'] });

	Router.onBeforeAction(function(){
		if(!Meteor.userId()){
			Router.go('Home');
			//this.render('Home');
		} else {
			this.next();
		}
	}, { except: ['Home', 'Aide'] });


	Router.onBeforeAction(function(){
		//try {
			var user;
			if(Meteor.userId()){
				user = Meteor.users.findOne({_id: Meteor.userId()});
			}
			if(Meteor.userId() && user && user.profile.admin) {
				//&& Meteor.user().profile.admin)
				this.next();
			} else {
				this.render('Home');
			}
		//} catch(ex) {
		//	this.render('Home');
		//}
	}, { only: ['Config', 'ConfigScenarios', 'ConfigUtilisateurs', 'ConfigBatchUtilisateurs', 'EditScenario', 'ConfigCartes', 'ConfigCartesCategorie', 'EditCarte', 'ConfigEvenements', 'ConfigEvenementsType', 'EditEvenement'] });


Router.route('/', { name:'Home', template:'Home', subscriptions: function(){ return Meteor.subscribe('getMyProfile'); }, action: function(){ if(this.ready()) { this.render(); } else { this.render('Loading'); } } } );
Router.route('/aide', { name:'Aide', template:'Aide' } );
Router.route('/config', { name: 'Config', template:'Config' } );
Router.route('/scenarios', { name: 'ConfigScenarios', template:'ConfigScenarios', subscriptions: function(){ return [Meteor.subscribe('getScenarios', true), Meteor.subscribe('getPartiesScenarios')]; }, action: function(){ if(this.ready()) { this.render(); } else { this.render('Loading'); } } } );
Router.route('/scenario/:_id', { name: 'EditScenario', template:'EditScenario', subscriptions: function(){ return [Meteor.subscribe('getScenario', this.params._id,true), Meteor.subscribe('getPartiesScenarios')]; }, data: function() { d = { scenario: Scenarios.findOne(this.params._id) }; return d; } } );
Router.route('/utilisateurs', { name: 'ConfigUtilisateurs', template:'ConfigUtilisateurs', subscriptions: function(){ return Meteor.subscribe('getUsers'); }, action: function(){ if(this.ready()) { this.render(); } else { this.render('Loading'); } } } );
Router.route('/nouvellePartie', { name:'NouvellePartie', template:'ListScenarios', subscriptions: function(){ return Meteor.subscribe('getScenarios', true); }, action: function(){ if(this.ready()) { this.render(); } else { this.render('Loading'); } } });
Router.route('/partie/:_scenarioId/:_id', { name:'Partie', template:'Partie', subscriptions: function(){ return [ Meteor.subscribe('illustrations'), Meteor.subscribe('getScenario', this.params._scenarioId, false), Meteor.subscribe('getPartie', this.params._id), Meteor.subscribe('getCartes', true), Meteor.subscribe('getEvenements', true), Meteor.subscribe('getUsers')]; }, data: function() { d = { scenarioId: this.params._scenarioId, partieId: this.params._id }; return d; }, action: function(){ if(this.ready()) { this.render(); } else { this.render('Loading'); } } }); 
Router.route('/parties', { name:'Parties', template:'Parties', subscriptions: function() { return [Meteor.subscribe('getParties', true), Meteor.subscribe('getScenarios', false)]; }, action: function(){ if(this.ready()) { this.render(); } else { this.render('Loading'); } } });
Router.route('/notifications', { name:'Notifications', template:'NotificationsPage', subscriptions: function(){ return Meteor.subscribe("getNotifications"); }, action: function(){ if(this.ready()) { this.render(); } else { this.render('Loading'); } } });
Router.route('/scores', { name:'Scores', template:'Scores', subscriptions: function() { return [Meteor.subscribe('getParties', true), Meteor.subscribe('getScenarios', false)]; }, action: function(){ if(this.ready()) { this.render(); } else { this.render('Loading'); } } });
Router.route('/utilisateur/:_id', { name: 'ConfigEditUtilisateur', template:'ConfigEditUtilisateur', subscriptions: function(){ return Meteor.subscribe('getUsers'); }, data: function() { d = { utilisateur: Meteor.users.findOne(this.params._id) }; console.log(d.utilisateur); return d; } } );
Router.route('/utilisateurs/import', { name: 'ConfigBatchUtilisateurs', template:'ConfigBatchUtilisateurs', subscriptions: function(){ return Meteor.subscribe('getUsers'); }, action: function(){ if(this.ready()) { this.render(); } else { this.render('Loading'); } } } );
Router.route('/cartes', { name: 'ConfigCartes', template:'ConfigCartes', subscriptions: function(){ return [Meteor.subscribe('illustrations'), Meteor.subscribe('getCartes', false)]; }, action: function(){ if(this.ready()) { this.render(); } else { this.render('Loading'); } } } );
Router.route('/cartes/categorie/:_categorieId/:_cubesat', { name: 'ConfigCartesCategorie', template:'ConfigCartesCategorie', subscriptions: function(){ return [Meteor.subscribe('illustrations'), Meteor.subscribe('getCartes', false)]; }, data: function() { d = { categorie: this.params._categorieId, cubesat: this.params._cubesat }; return d; }, action: function(){ if(this.ready()) { this.render(); } else { this.render('Loading'); } } } );
Router.route('/carte/:carteId', { name: 'EditCarte', template:'EditCarte', subscriptions: function(){ return [Meteor.subscribe('illustrations'), Meteor.subscribe('getPartiesCartes'), Meteor.subscribe('getCartes', false), Meteor.subscribe('getTags'), Meteor.subscribe('getMyProfile')]; }, data: function() { d = { carte: Cartes.findOne({carteId: this.params.carteId}) }; return d; }, action: function(){ if(this.ready()) { this.render(); } else { this.render('Loading'); } } } );
Router.route('/carte/new/:_categorieId/:_cubesat', { name: 'NouvelleCarte', template:'EditCarte', subscriptions: function(){ return [Meteor.subscribe('illustrations'), Meteor.subscribe('getCartes', false), Meteor.subscribe('getTags'), Meteor.subscribe('getMyProfile')]; }, data: function() { d = { categorie: this.params._categorieId, cubesat: this.params._cubesat }; return d; } } );
Router.route('/evenements', { name: 'ConfigEvenements', template:'ConfigEvenements', subscriptions: function(){ return [Meteor.subscribe('illustrations'), Meteor.subscribe('getEvenements', false)]; }, action: function(){ if(this.ready()) { this.render(); } else { this.render('Loading'); } } } );
Router.route('/evenements/:_cubesat', { name: 'ConfigEvenementsType', template:'ConfigEvenementsType', subscriptions: function(){ return [Meteor.subscribe('illustrations'), Meteor.subscribe('getEvenements', false)]; }, data: function() { d = { cubesat: this.params._cubesat }; return d; }, action: function(){ if(this.ready()) { this.render(); } else { this.render('Loading'); } } } );
Router.route('/evenement/:eventId', { name: 'EditEvenement', template:'EditEvenement', subscriptions: function(){ return [Meteor.subscribe('illustrations'), Meteor.subscribe('getPartiesEvenements'), Meteor.subscribe('getEvenements', false), Meteor.subscribe('getTags'), Meteor.subscribe('getMyProfile')]; }, data: function() { d = { evenement: Evenements.findOne({eventId: this.params.eventId}) }; return d; }, action: function(){ if(this.ready()) { this.render(); } else { this.render('Loading'); } } } );
Router.route('/evenement/new/:_cubesat', { name: 'NouvelEvenement', template:'EditEvenement', subscriptions: function(){ return [Meteor.subscribe('illustrations'), Meteor.subscribe('getEvenements', false), Meteor.subscribe('getTags'), Meteor.subscribe('getMyProfile')]; }, data: function() { d = { cubesat: this.params._cubesat }; return d; } } );
