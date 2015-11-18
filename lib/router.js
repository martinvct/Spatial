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
}, { only: ['Config', 'ConfigScenarios', 'ConfigUtilisateurs'] });

Router.route('/', { name:'Home', template:'Home' } );
Router.route('/aide', { name:'Aide', template:'Aide' } );
Router.route('/config', { name: 'Config', template:'Config' } );
Router.route('/scenarios', { name: 'ConfigScenarios', template:'ConfigScenarios' } );
Router.route('/scenario', { name: 'EditScenario', template:'EditScenario' } );
Router.route('/utilisateurs', { name: 'ConfigUtilisateurs', template:'ConfigUtilisateurs', waitOn: function(){ return Meteor.subscribe('getUsers'); } } );