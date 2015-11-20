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
			return Scenarios.find();
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
	Template.ConfigScenario.helpers({
		nomPlanete: function(_planeteId){
			return TAPi18n.__("planetes." + (_.findWhere(Planetes, {planeteId: _planeteId})).planeteId);
		},
		tr: function(prefix, fieldName){
			return TAPi18n.__(prefix + fieldName);
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
			$("div.scenarioParametre").each( function(){ $(this).removeClass('error'); });
			if(!$('#intitule').val()){
				$(this).parent().addClass('error');
				throwError("champs_requis", TAPi18n.__("error.champs_requis_vide"));
				return;
			}
			if($('#poidsMax').val() && (!$.isNumeric($('#poidsMax').val()))){
				$(this).parent().addClass('error');
				throwError("champs_numerique", TAPi18n.__("error.champs_numeric_incorrect"));
				return;
			}
			var scenario = {
				intitule: $('#intitule').val(),
				description: $('#description').val(),
				active: ($('#active').val() === "1"),
				initialisation: {
					cubesat: ($('#cubesat').val() === "1"),
					cubesatLimites:{
						poidsMax: parseInt($('#poidsMax').val()),
						volumeMax: parseInt($('#volumeMax').val())
					},
					budget: parseInt($('#budget').val())*1000,
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

			Meteor.call('setScenario', scenario);
		},
		'click #retour': function(event){
			Router.go('ConfigScenarios');
		}
	});
}