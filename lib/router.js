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
	if(!Meteor.userId()){
		this.render('Home');
	} else {
		this.next();
	}
}, { except: ['Home', 'Aide'] });


Router.onBeforeAction(function(){
	if(!Meteor.userId() || !Meteor.user().admin){
		this.render('Home');
	} else {
		this.next();
	}
}, { only: ['Config', 'ConfigScenarios', 'ConfigUtilisateurs', 'EditScenario'] });


Router.route('/', { name:'Home', template:'Home' } );
Router.route('/aide', { name:'Aide', template:'Aide' } );
Router.route('/config', { name: 'Config', template:'Config' } );
Router.route('/scenarios', { name: 'ConfigScenarios', template:'ConfigScenarios', waitOn: function(){ return Meteor.subscribe('getScenarios', true); } } );
Router.route('/scenario/:_id', { name: 'EditScenario', template:'EditScenario', waitOn: function(){ return Meteor.subscribe('getScenario', this.params._id,true); }, data: function() { d = { scenario: Scenarios.findOne(this.params._id) }; return d; } } );
Router.route('/utilisateurs', { name: 'ConfigUtilisateurs', template:'ConfigUtilisateurs', waitOn: function(){ return Meteor.subscribe('getUsers'); } } );
Router.route('/nouvellePartie', { name:'NouvellePartie', template:'ListScenarios', waitOn: function(){ return Meteor.subscribe('getScenarios', true); } });
Router.route('/partie/:_scenarioId/:_id', { name:'Partie', template:'Partie', waitOn: function(){ return [Meteor.subscribe('getScenario', this.params._scenarioId, false), Meteor.subscribe('getPartie', this.params._id), Meteor.subscribe('getCartes', true), Meteor.subscribe('getUsers')]; }, data: function() { d = { scenarioId: this.params._scenarioId, partieId: this.params._id }; return d; } }); 
Router.route('/parties', { name:'Parties', template:'Parties', waitOn: function() { return [Meteor.subscribe('getParties', true), Meteor.subscribe('getScenarios', false)]; } });