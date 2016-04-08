if(Meteor.isClient){
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
			//console.log(scenarioId);
			//console.log(Parties.find({}).count());
			return Parties.find({scenarioId: scenarioId}).count(); 
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
		plusieursPlanetes: function(){
			return (Template.instance().data.scenario.initialisation.planetes.length > 1);
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
		isPlaneteChecked: function(_planeteId, initialisationPlanetes){
			if(initialisationPlanetes.indexOf(_planeteId) == -1)	return "";
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

			var oldScenario;
			
			if(($('#_id').val().length > 0) && (!$('#securite').is(':checked'))) {
				oldScenario = Scenarios.findOne({_id: $('#_id').val()});
				if(Meteor.apply('checkScenarioUtilise', [$('#_id').val()], {returnStubValue: true})){
					throwAlert("error","scenario_utilisee", TAPi18n.__("error.scenario_utilise"));
					return;
				}
			}

			var scenario = {
				intitule: {},
				description: {},
				active: ($('#active').val() === "1"),
				initialisation: {
					cubesat: ($('#cubesat').is(':checked')),
					cubesatOptions:{
						nU: parseInt($('#nU').val())
					},
					budget: parseInt($('#budget').val()),
					budgetGestion: parseInt($('#budgetGestion').val()),
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
					seuilTps: parseInt($('#seuilTps').val()),
					ptsParTps: parseInt($('#ptsParTps').val())
				}
			};
			if(TAPi18n.getLanguage() == "fr"){
				scenario.intitule.fr = $('#intitule').val();
				scenario.intitule.en = (oldScenario ? oldScenario.intitule.en : $('#intitule').val());

				scenario.description.fr = $('#description').val();
				scenario.description.en = (oldScenario ? oldScenario.description.en : $('#description').val());
			} else if (TAPi18n.getLanguage() == "en"){
				scenario.intitule.en = $('#intitule').val();
				scenario.intitule.fr = (oldScenario ? oldScenario.intitule.fr : $('#intitule').val());

				scenario.description.en = $('#description').val();
				scenario.description.fr = (oldScenario ? oldScenario.description.fr : $('#description').val());
			}
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