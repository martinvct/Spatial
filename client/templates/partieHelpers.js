if (Meteor.isClient) {
	Template.registerHelper('convertir', function(valeur, unite){
		return convertir(valeur, unite);
	});
	Template.Partie.onCreated(function(){
		this.templateDictionary = new ReactiveDict();
		this.templateDictionary.set('currentPartie', this.data.partieId);
		this.templateDictionary.set('currentScenario', this.data.scenarioId);
		this.templateDictionary.set('currentTemplate', 'partieTest');
		this.templateDictionary.set('currentScenarioObj', Scenarios.findOne({_id: Template.instance().templateDictionary.get('currentScenario')}));
	});
	Template.Parties.helpers({
		parties: function(){
			return Parties.find();
		}
	});
	Template.Parties.events({
		'click #retour': function(event){
			Router.go('Home');
		}
	});
	Template.PartieItem.helpers({
		nomPlanete: function(_planeteId){
			return TAPi18n.__("planetes." + _planeteId);
		},
		tr: function(prefix, fieldName){
			return TAPi18n.__(prefix + fieldName);
		},
		formatDate: function(valeur, format){
			return moment(valeur).format(format);
		},
		scenario: function(){
			return Scenarios.findOne({_id: this.scenarioId});
		}
	});
	Template.PartieItem.events({
		'click button.lien': function(event){
			Router.go('Partie', {_scenarioId: $(event.target).attr('data-scenarioId'), _id: $(event.target).attr('data-partieId')});
		}
	});
	Template.Partie.helpers({
		multi100: function(percent){
			if(percent > 0)	return 100 * percent;
			return 10;
		},
		getIconeConstante: function(nom, valeurMax, valeur){
			var d = (valeurMax > 0 ? (valeur / valeurMax) * 100 : 0);
			if(d == 100) d--;
			console.log(nom + ' ' + valeur + "/" + valeurMax + " = " + d + " => " + (Math.floor(d / 25) + 1));
			return nom + (Math.floor(d / 25) + 1);
		},
		partieTemplate: function(){
			return Template.instance().templateDictionary.get('currentTemplate');
		},
		partieData: function(){
			return { partie: Parties.findOne({_id: Template.instance().templateDictionary.get('currentPartie')}), scenario: Template.instance().templateDictionary.get('currentScenarioObj') };
		},
		scenario: function(){
			return  Template.instance().templateDictionary.get('currentScenarioObj');
		},
		partie: function(){
			return Parties.findOne({_id: Template.instance().templateDictionary.get('currentPartie')});
		},
		hasPlanete: function(){
			// si scenario == cubesat => ok
			// sinon si objectif : 1 seule planete : si pas encore dans partie => on ajoute la planete dans la partie => tjs OK
			//					   plusieurs planetes possibles : si pas encore dans partie => KO sinon OK

			var partie = Parties.findOne({_id: Template.instance().templateDictionary.get('currentPartie')});

			if(partie.cubesat) return true;
			if(!partie.planete){
				var scenario = Template.instance().templateDictionary.get('currentScenarioObj');
				if(scenario.initialisation.planetes.length == 1){
					Meteor.call("setPlaneteToPartie", partie, scenario, (_.findWhere(Planetes, {planeteId: scenario.intialisation.planetes[0]})));
					return true;
				}
			}
			return false;
		},
		hasLanceur: function(){
			var partie = Parties.findOne({_id: Template.instance().templateDictionary.get('currentPartie'), "deck.cartes.tags": "Lanceur"});
			if(partie) return true;
			return false;
		}
	});
	Template.Partie.events({
		'click #nomPartieView': function(event){
			$('#nomPartieView').hide();
			$('#nomPartieForm').show();
			$('#nomPartieTxt').focus();
		},
		'click #nomPartieBouton': function(event){
			Meteor.call("updateNomPartie", Template.instance().templateDictionary.get('currentPartie'), $('#nomPartieTxt').val());
			$('#nomPartieForm').hide();
			$('#nomPartieView').show();
		},
		'click #partieScenario': function(event){
			Template.instance().templateDictionary.set('currentTemplate', 'ViewScenario');
		},
		'click #partieLanceur': function(event){
			Template.instance().templateDictionary.set('currentTemplate', 'PartieLanceur');
		}
	});
	Template.PartieLanceur.helpers({
		cartes: function(){
			return Cartes.find({tags: "lanceur", cubesat: Template.instance().data.scenario.initialisation.cubesat});
		}
	});
}