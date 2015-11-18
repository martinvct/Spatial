if (Meteor.isClient) {
	Template.Header.events({
		'click button.buttonAvatar': function (event, template) {
			Blaze.render(Template.MenuProfile, document.getElementById('main'));
		}
	});
	Template.Header.onRendered(function() {
		
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
			return Meteor.call("getScenarios");
		},
		nomPlanete: function(_planeteId){
			return TAPi18n.__("planetes." + (_.findWhere(Planetes, {planeteId: _planeteId})).planeteId);
		},
		tr: function(prefix, fieldName){
			return TAPi18n.__(prefix + fieldName);
		}
	});
	Template.ConfigScenarios.events({
		'click #addScenario': function(event){
			Router.go('EditScenario');
		},
		'click #retour': function(event){
			Router.go('Config');
		}
	});
	Template.EditScenario.helpers({
		nomPlanete: function(_planeteId){
			return TAPi18n.__("planetes." + (_.findWhere(Planetes, {planeteId: _planeteId})).planeteId);
		},
		isChecked: function(valeur){
			if (valeur !== false)  return "checked"; 
		},
		isNChecked: function(valeur){
			if (valeur === false)  return "checked"; 
		},
		isSelected: function(valeur, ref){
			if (valeur === ref)  return "checked"; 
		},
		isNSelected: function(valeur, ref){
			if (valeur !== ref)  return "checked"; 
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
			if(!$('#intitule').val()){
				throwError("champs_requis", TAPi18n.__("error.champs_requis_vide"));
				return;
			}
			//TODO vérification des champs de type numériques !!
			var scenario = {
				intitule: $('#intitule').val(),
				description: $('#description').val(),
				active: $('#active').val(),
				initialisation: {
					cubesat: $('#cubesat').val(),
					cubesatLimites:{
						poidsMax: $('#poidsMax').val(),
						volumeMax: $('#volumeMax').val()
					},
					budget: $('#budget').val(),
					objectif: $('#objectif').val(),
					planetes: []
				},
				construction: {
					tpsMax: $('#tpsMax').val()
				},
				expertise:{
					nbrMaxExperts: $('#nbrMaxExperts').val(),
					malusTemps: $('#malusTempsExpert').val(),
					malusBudget: $('#malusBudgetExpert').val(),
					malusNbrEvenements: $('#malusNbrEvenementsExpert').val(),
					niveauDetails: $('#niveauDetails').val(),
					nbrExpertsGratuits: $('#nbrExpertsGratuits').val()
				},
				collaboration:{
					nbrMaxAppels: $('#nbrMaxAppels').val(),
					malusTemps: $('#malusTempsAppel').val(),
					malusBudget: $('#malusBudgetAppel').val(),
					malusNbrEvenements: $('#malusNbrEvenementsAppel').val(),
					tpsMaxParAppel: $('#tpsMaxParAppel').val(),
					nbrAppelsGratuits: $('#nbrAppelsGratuits').val()
				},
				evenement:{
					nbrMax: $('#nbrMaxEvenements').val(),
					intervalleTps: $('#intervalleTps').val()
				},
				validation:{
					niveauDetails: $('#niveauDetailsValidation').val()
				},
				lancement:{
					nbrEvenements: $('#nbrEvenementsFinaux').val()
				},
				score:{
					ptsParScience: $('#ptsParScience').val(),
					ptsParTps: $('#ptsParTps').val()
				}
			};
			$('input[name="planetes"] :checked').each(function(){ scenario.intialisation.planetes.push($(this).val()) });
			if($('#_id').val()) scenario._id = $('#_id').val();

			Meteor.call('setScenario', scenario);
		},
		'click #retour': function(event){
			Router.go('ConfigScenarios');
		}
	});
}