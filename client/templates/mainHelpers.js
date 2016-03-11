if (Meteor.isClient) {
	Template.registerHelper('compare', function(v1, v2) {
  		if (typeof v1 === 'object' && typeof v2 === 'object') {
    		return _.isEqual(v1, v2); // do a object comparison
  		} else {
    		return v1 === v2;
  		}
	});
	Template.registerHelper('concat', function(prefix, fieldName){
		return TAPi18n.__(prefix + fieldName);
	});
	Template.Header.onRendered(function() {
		
	});
	Template.Header.helpers({
		nNotifications: function(){
			//console.log(Meteor.user());
			return Meteor.user().profile.nNotifications;
		},
		currentPartie: function(){

			return ((Template.instance().data) && (Template.instance().data.partieId));
		},
		nomPartie: function(){
			return Parties.findOne({_id: Template.instance().data.partieId},{nom: 1});
		}
	});
	Template.Header.events({
		'click button.buttonAvatar': function (event, template) {
			//Blaze.render(Template.MenuProfile, document.getElementById('main'));
			Modal.show("MenuProfile");
		},
		'click #logoApplication': function(){
			Router.go('Home');
		},
		'click #buttonNotifications': function(event, template){
			//console.log("ntoification menu");
			//Blaze.render(Template.NotificationsMenu, document.getElementById('backgroundModal'));
			Meteor.call('updateNNotifications');
			Modal.show("NotificationsMenu");
		}
	});
	Template.MenuProfile.events({
		'click button.menuProfileLogout': function(event, template){
			if((Session.get('sPartieId')) && (Session.get('sCountTimer') > 0)){
				//sauvegarder time
				saveTimer();

			}
			Meteor.logout();
		}
	});
	Template.Login.events({
	    'click button.loginWithLDAP': function (event, template) {
	        //console.log("Tentative de login...");
	       // console.log("username: "+ template.find('#login').value);
	       //console.log("password: "+ template.find('#password').value);
	        
	        try {
	        	LDAP_DEFAULTS.dn = LDAP_DEFAULTS.dn.replace("{{username}}", template.find('#login').value);
	        	LDAP_DEFAULTS.search = LDAP_DEFAULTS.search.replace("{{username}}", template.find('#login').value);
	        	Meteor.loginWithLDAP(template.find('#login').value, template.find('#password').value, LDAP_DEFAULTS, function(err, result){
		          if(err){
		          	//console.log("WithLDAP Erreur");
		          	//console.log(err);
		            if(! Meteor.userId()){
		              //console.log("Tentative de login interne...");	
		              try {
			              Meteor.loginWithPassword(template.find('#login').value, template.find('#password').value,  function(erreur) { 
			              	if (erreur) { 
			              		//console.log("login interne erreur"); 
			              		return throwAlert("error","login_echoue",  TAPi18n.__("error.login_echoue"));
			              	}
			              	else {
				              	var currUser = Meteor.user();
				           	  	var now      = new Date();
				           	  	Meteor.users.update({_id: currUser._id},{$set: {"profile.lastlogin": now}});
				           	}
			              });
			          } catch(ex){

		    		  }    
		            }
		           } else {
		           	  var currUser = Meteor.user();
		           	  var now      = new Date();
		           	  Meteor.users.update({_id: currUser._id},{$set: {"profile.lastlogin": now}});
		           }
		        });
		    } catch(e){
		    	console.log(e.message);
		    }  
	    },
	    'click button.loginWithFaceBook': function(event){ //voir : http://bulenttastan.net/login-with-facebook-using-meteor-js/
	    	Meteor.loginWithFacebook({}, function(err){
	            if (err) {
	                throwError("login_echoue", TAPi18n.__("error.login_echoue")); 
	            } else {
	           	  var currUser = Meteor.user();
	           	  var now      = new Date();
	           	  Meteor.users.update({_id: currUser._id},{$set: {"profile.lastlogin": now}});
	           }
	        });
	    },
	    'keypress #password': function(event, template){
	    	if(event.which === 13){
	    		$('button.loginWithLDAP').click();
	    	}
	    }
	});
	Template.MenuPrincipal.onCreated(function(){
		saveTimer();
	});
	Template.MenuPrincipal.helpers({
		counttimer: function(){ return Session.get('sCountTimer'); },
		partieid: function(){ return Session.get('sPartieId'); }
	});
	Template.MenuPrincipal.events({
		'click #configuration': function(event){
			Router.go('Config');
		},
		'click #nouvellePartie': function(event){
			Router.go('NouvellePartie');
		},
		'click #chargerPartie': function(event){
			Router.go('Parties');
		},
		'click #meilleursScores': function(event){
			Router.go('Scores');
		}
	});
	Template.Scores.helpers({
		scores: function(){
			var parties = Parties.find({finie: true, active: true},{"deck.cartes": 0, logs: 0, peers: 0, chat: 0, experts: 0, sort: {score: -1}, limit: 20}); //.sort({score: -1}).limit(20);
			var scores = [];
			for(var p=0; p < parties.length; p++){
				var scenario = Scenarios.findOne({_id: parties[p].scenarioId },{services: 0});
				var user     = Meteor.users.findOne({_id: parties[p].userId});
				scores.push({user: user, partie: {score: parties[p].score, science: parties[p].deck.science, tempsTotal: parties[p].tempsTotal}, scenario: {_id: scenario._id, intitule: scenario.intitule, budget: scenario.initialisation.budget, cubesat: scenario.initialisation.cubesat }});
			}
			return scores;
		}
	});
	Template.Scores.events({
		'click #retour': function(event){
			Router.go('Home');
		}
	});
	Template.Config.events({
		'click #listeScenarios': function(event){
			Router.go('ConfigScenarios');
		},
		'click #listeUtilisateurs': function(event){
			Router.go('ConfigUtilisateurs');
		},
		'click #retour': function(event){
			Router.go('Home');
		}
	});
	Template.ConfigScenarios.helpers({
		scenarios: function(){
			return Scenarios.find();
		}
	});
	Template.ConfigScenarios.events({
		'click #addScenario': function(event){
			Router.go('EditScenario', {_id: 0});
		},
		'click #retour': function(event){
			Router.go('Config');
		}
	});
	Template.ConfigScenario.helpers({
		nbrPartie: function(scenarioId){
			return 0; // TODO compter le nombre de parties de ce scénario
		},
		nomPlanete: function(_planeteId){
			//return TAPi18n.__("planetes." + (_.findWhere(Planetes, {planeteId: _planeteId})).nom);
			return TAPi18n.__("planetes." + _planeteId);
		},
		convertir: function(valeur, unite){
			return convertir(valeur, unite);
		},
		tr: function(prefix, fieldName){
			return TAPi18n.__(prefix + fieldName);
		},
		formatDate: function(valeur, format){
			return moment(valeur).format(format);
		}
	});
	Template.ConfigScenario.events({
		'click button.lien': function(event){
			Router.go('EditScenario', {_id: $(event.target).attr('data-scenarioId')});
			//Router.go('EditScenario');
		}
	});
	
	Template.ViewScenario.helpers({

		nomPlanete: function(_planeteId){
			return TAPi18n.__("planetes." + _planeteId);
		},
		isPlaneteChecked: function(_planeteId){
			if((Template.parentData(1).partie.planete) && (Template.parentData(1).partie.planete.planeteId == _planeteId)) return "checked";
		},
		planetes: function(){
			if(Session.get("sPartieId")){
				var planetes = [];
				for(var p=0; p < Template.instance().data.scenario.initialisation.planetes.length; p++){
					planetes.push(_.find(Planetes, function(planete){ return planete.planeteId == Template.instance().data.scenario.initialisation.planetes[p]}));
				}
				return planetes;
			}
			return Planetes;
		},
		hasPartieId: function(){
			return (Session.get("sPartieId"));
		}
	});
	Template.ViewScenario.events({
		'click #savePlanetePartie': function(event){
			//console.log(_.findWhere(Planetes, {planeteId: $('input[type=radio][name=planetes]:checked').val()}));
			Meteor.call("setPlaneteToPartie", Template.instance().data.partie, Template.instance().data.scenario, (_.findWhere(Planetes, {planeteId: $('input[type=radio][name=planetes]:checked').val()})));
		},
		'click #nomPartieBouton': function(event){
			Meteor.call("updateNomPartie", Template.instance().data.partie._id, $('#nomPartieTxt').val());
		}
	});
	Template.EditScenario.helpers({
		nomPlanete: function(_planeteId){
			return TAPi18n.__("planetes." + _planeteId);
		},
		isChecked: function(valeur){
			if (valeur !== false)  return "checked"; 
		},
		isNChecked: function(valeur){
			if (valeur === false)  return "checked"; 
		},
		isSelected: function(valeur, ref){
			if (valeur == ref)  return "selected"; 
		},
		isNSelected: function(valeur, ref){
			if (valeur != ref)  return "selected"; 
		},
		isPlaneteChecked: function(_planeteId, planetes){
			if((!planetes) || (planetes.indexOf(_planeteId) == -1)) return "";
			return "checked";
		},
		planetes: function(){
			return Planetes;
		}
	});
	Template.EditScenario.onRendered(function() {
		if($('#cubesat').is(':checked')){
			$('#nU').parent().show();
			$('#objectif').parent().hide();
			$('#objectif').parent().next().hide();
		} else {
			$('#nU').parent().hide();
			$('#objectif').parent().show();			
			if($('#objectif').val() == "espace"){
				$('#objectif').parent().next().hide();
			} else {
				$('#objectif').parent().next().show();
			}
		}

	});
	Template.EditScenario.events({
		'change #cubesat': function(event, template){
			if($(event.target).is(':checked')){
				$('#nU').parent().show();
				$('#objectif').parent().hide();
				$('#objectif').parent().next().hide();
			} else {
				$('#nU').parent().hide();
				$('#objectif').parent().show();
				$('#objectif').parent().next().show();
				if($('#objectif').val() == "espace"){
					$('#objectif').parent().next().hide();
				} else {
					$('#objectif').parent().next().show();
				}
			}
		},
		'change #objectif': function(event, template){
			if($('#objectif').val() == "espace"){
				$('#objectif').parent().next().hide();
			} else {
				$('#objectif').parent().next().show();
			}
		},
		'click #saveScenario': function(event){
			$("div.scenarioParametre").each( function(){ $(this).removeClass('error'); });
			if(!$('#intitule').val()){
				$(this).parent().addClass('error');
				throwError("champs_requis", TAPi18n.__("error.champs_requis_vide"));
				return;
			}
			/*if(isNaN($('#poidsMax').val())) $('#poidsMax').val(0);
			if(isNaN($('#volumeMax').val())) $('#volumeMax').val(0);
			if($('#poidsMax').val() && (!$.isNumeric($('#poidsMax').val()))){
				$('#poidsMax').parent().addClass('error');
				throwError("champs_numerique", TAPi18n.__("error.champs_numeric_incorrect"));
				return;
			}
			if($('#volumeMax').val() && (!$.isNumeric($('#volumeMax').val()))){
				$('#poidsMax').parent().addClass('error');
				throwError("champs_numerique", TAPi18n.__("error.champs_numeric_incorrect"));
				return;
			}*/
			var scenario = {
				intitule: $('#intitule').val(),
				description: $('#description').val(),
				active: ($('#active').val() === "1"),
				initialisation: {
					cubesat: ($('#cubesat').is(':checked')),
					cubesatOptions:{
						nU: parseInt($('#nU').val())
					},
					budget: parseInt($('#budget').val()),
					objectif: $('#objectif').val(),
					planetes: []
				},
				construction: {
					tpsMax: parseInt($('#tpsMax').val())
				},
				expertise:{
					nbrMaxExperts: parseInt($('#nbrMaxExperts').val()),
					malusTemps: parseInt($('#malusTempsExpert').val()),
					malusBudget: parseInt($('#malusBudgetExpert').val()),
					malusNbrEvenements: parseInt($('#malusNbrEvenementsExpert').val()),
					niveauDetails: $('#niveauDetails').val(),
					nbrExpertsGratuits: parseInt($('#nbrExpertsGratuits').val())
				},
				collaboration:{
					nbrMaxAppels: parseInt($('#nbrMaxAppels').val()),
					malusTemps: parseInt($('#malusTempsAppel').val()),
					malusBudget: parseInt($('#malusBudgetAppel').val()),
					malusNbrEvenements: parseInt($('#malusNbrEvenementsAppel').val()),
					tpsMaxParAppel: parseInt($('#tpsMaxParAppel').val()),
					nbrAppelsGratuits: parseInt($('#nbrAppelsGratuits').val())
				},
				evenement:{
					nbrMax: parseInt($('#nbrMaxEvenements').val()),
					intervalleTps: parseInt($('#intervalleTps').val())
				},
				validation:{
					niveauDetails: $('#niveauDetailsValidation').val()
				},
				lancement:{
					nbrEvenements: parseInt($('#nbrEvenementsFinaux').val())
				},
				score:{
					ptsParScience: parseInt($('#ptsParScience').val()),
					ptsParTps: parseInt($('#ptsParTps').val())
				}
			};
			$('input[name="planetes"]:checked').each(function(){ scenario.initialisation.planetes.push($(this).val()); });
			if($('#_id').val()) scenario._id = $('#_id').val();

			Meteor.call('setScenario', scenario,  function(error, result){ if(Meteor.isClient) { Meteor.setTimeout(function(){ Router.go('ConfigScenarios'); }, 2000); } });
		},
		'click #retour': function(event){
			Router.go('ConfigScenarios');
		}
	});
	Template.ListScenarios.helpers({
		scenarios: function(){
			return Scenarios.find();
		}
	});
	Template.ScenarioItem.helpers({
		nbrPartie: function(scenarioId){
			return 0; // TODO compter le nombre de parties de ce scénario
		},
		nomPlanete: function(_planeteId){
			//return TAPi18n.__("planetes." + (_.findWhere(Planetes, {planeteId: _planeteId})).nom);
			return TAPi18n.__("planetes." + _planeteId);
		},
		convertir: function(valeur, unite){
			return convertir(valeur, unite);
		},
		tr: function(prefix, fieldName){
			return TAPi18n.__(prefix + fieldName);
		},
		formatDate: function(valeur, format){
			return moment(valeur).format(format);
		}
	});
	Template.ScenarioItem.events({
		'click button.lien': function(event){
			//var scenario = Meteor.apply("getScenario", [$(event.target).attr('data-scenarioId')], {returnStubValue: true});
			//console.log($(event.target).attr('data-scenarioId') + " " + scenario.intitule);
			var partie = Meteor.apply('newPartie', [$(event.target).attr('data-scenarioId')], {returnStubValue: true});
			if(partie) {
				Session.set('currentPartie', partie);
				//console.log('nouvelle partie' + partie.userId);
				Router.go('Partie', {_scenarioId: $(event.target).attr('data-scenarioId'), _id: partie._id});
			}
						
		}
	});

}