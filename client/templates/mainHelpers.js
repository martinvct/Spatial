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
			console.log(Meteor.user());
			return Meteor.user().profile.nNotifications;
		}
	});
	Template.Header.events({
		'click button.buttonAvatar': function (event, template) {
			Blaze.render(Template.MenuProfile, document.getElementById('main'));
		},
		'click #logoApplication': function(){
			Router.go('Home');
		},
		'click #buttonNotifications': function(event, template){
			//console.log("ntoification menu");
			Blaze.render(Template.NotificationsMenu, document.getElementById('backgroundModal'));
		}
	});
	Template.Login.events({
	    'click button.loginWithLDAP': function (event, template) {
	        Meteor.loginWithLDAP(template.find('#login').value, template.find('#password').value, { dn: "uid=" + template.find('#login').value + ",ou=people,dc=ulg,dc=ac,dc=be" }, function(err){
	          if(err){
	            if(! Meteor.userId()){
	              Meteor.loginWithPassword(template.find('#login').value, template.find('#password').value,  function(err) { if (err) return throwError("login_echoue", TAPi18n.__("error.login_echoue")); });
	           }
	          }
	        });
	    },
	    'click button.loginWithFaceBook': function(event){ //voir : http://bulenttastan.net/login-with-facebook-using-meteor-js/
	    	Meteor.loginWithFacebook({}, function(err){
	            if (err) {
	                throwError("login_echoue", TAPi18n.__("error.login_echoue")); 
	            }
	        });
	    },
	    'keypress #password': function(event, template){
	    	if(event.which === 13){
	    		$('button.loginWithLDAP').click();
	    	}
	    }
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
	Template.ConfigUtilisateurs.helpers({
		utilisateurs: function(){
			return Meteor.users.find();
		}
	});
	Template.ConfigUtilisateurs.events({
		'click #retour': function(event){
			Router.go('Config');
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
				$('#poidsMax').parent().show();
				$('#volumeMax').parent().show();
				$('#objectif').parent().hide();
				$('#objectif').parent().next().hide();
			} else {
				$('#poidsMax').parent().hide();
				$('#volumeMax').parent().hide();
				$('#objectif').parent().show();
				$('#objectif').parent().next().show();
			}
	});
	Template.EditScenario.events({
		'change #cubesat': function(event, template){
			if($(event.target).is(':checked')){
				$('#poidsMax').parent().show();
				$('#volumeMax').parent().show();
				$('#objectif').parent().hide();
				$('#objectif').parent().next().hide();
			} else {
				$('#poidsMax').parent().hide();
				$('#volumeMax').parent().hide();
				$('#objectif').parent().show();
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
				console.log('nouvelle partie' + partie.userId);
				Router.go('Partie', {_scenarioId: $(event.target).attr('data-scenarioId'), _id: partie._id});
			}
						
		}
	});
}