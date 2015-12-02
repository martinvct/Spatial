if (Meteor.isClient) {
	Template.registerHelper('convertir', function(valeur, unite){
		return convertir(valeur, unite);
	});
	Template.registerHelper('illustration', function(carteId, cubesat){
		var illustration = "/Cartes/illustrations/";
		if(cubesat) illustration += "cubesat-";
		illustration += carteId + ".png";
		return illustration;
	});
	Template.Partie.onCreated(function(){
		this.templateDictionary = new ReactiveDict();
		this.templateDictionary.set('currentPartie', this.data.partieId);
		this.templateDictionary.set('currentScenario', this.data.scenarioId);
		this.templateDictionary.set('currentTemplate', 'partieTest');
		this.templateDictionary.set('currentScenarioObj', Scenarios.findOne({_id: Template.instance().templateDictionary.get('currentScenario')}));
		this.templateDictionary.set('currentCategorie',"");
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
		partieTemplate: function(){
			return Template.instance().templateDictionary.get('currentTemplate');
		},
		partieData: function(){
			return { partie: Parties.findOne({_id: Template.instance().templateDictionary.get('currentPartie')}), scenario: Template.instance().templateDictionary.get('currentScenarioObj'), categorie: Template.instance().templateDictionary.get('currentCategorie') };
		},
		scenario: function(){
			return  Template.instance().templateDictionary.get('currentScenarioObj');
		},
		partie: function(){
			var partie = Parties.findOne({_id: Template.instance().templateDictionary.get('currentPartie')});
			if(!Session.get("dateModif")){
				Session.set("dateModif", partie.dateModif.getTime());
			}
			return partie;
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
		},
		'click #partieOrbite': function(event){
			Template.instance().templateDictionary.set('currentTemplate', 'PartieOrbite');
		},
		'click #partieMagasin': function(event){
			Template.instance().templateDictionary.set('currentTemplate', 'PartieCategories');
		},
		'click div.carte': function(event){
			var carteId = $(event.currentTarget).attr("data-carteId");
			if($(event.currentTarget).hasClass("isDeck")){
				Meteor.call('removeCarteFromDeck', Template.instance().data.partieId, Template.instance().templateDictionary.get('currentScenarioObj'), this, Session.get("dateModif"));
				//$(event.currentTarget).removeClass("isDeck");
			} else {
				Meteor.call("addCarteToDeck", Template.instance().data.partieId, Template.instance().templateDictionary.get('currentScenarioObj'), this, Session.get("dateModif"));
				//$(event.currentTarget).addClass("isDeck");
			}
		},
		'click .partieCategorie': function(event){
			Template.instance().templateDictionary.set('currentCategorie', this[0]);
			Template.instance().templateDictionary.set('currentTemplate', 'PartieCategorie');
		}
	});
	Template.PartieHeader.helpers({
		multi100: function(percent){
			if(percent > 0)	return 100 * percent;
			return 10;
		},
		getIconeConstante: function(nom, valeurMax, valeur){
			var d = (valeurMax > 0 ? (valeur / valeurMax) * 100 : 0);
			if(d == 100) d--;
			//console.log(nom + ' ' + valeur + "/" + valeurMax + " = " + d + " => " + (Math.floor(d / 25) + 1));
			return nom + (Math.floor(d / 25) + 1);
		},
		hasPlanete: function(){
			// si scenario == cubesat => ok
			// sinon si objectif : 1 seule planete : si pas encore dans partie => on ajoute la planete dans la partie => tjs OK
			//					   plusieurs planetes possibles : si pas encore dans partie => KO sinon OK

			
			if(Template.parentData(0).partie.cubesat) return true;
			if(!Template.parentData(0).partie.planete){
				var scenario = Template.instance().templateDictionary.get('currentScenarioObj');
				if(scenario.initialisation.planetes.length == 1){
					Meteor.call("setPlaneteToPartie", Template.parentData(0).partie, scenario, (_.findWhere(Planetes, {planeteId: scenario.intialisation.planetes[0]})));
					return true;
				}
			}
			return false;
		},
		hasLanceur: function(){
			if(_.find(Template.parentData(0).partie.deck.cartes, function(obj){ return (_.indexOf(obj.tags, "lanceur") > -1); })) return true;
			return false;
		}
	});
	Template.PartieLanceur.helpers({
		cartes: function(){
			return Cartes.find({tags: "lanceur", cubesat: Template.instance().data.scenario.initialisation.cubesat});
		}
	});
	Template.PartieOrbite.helpers({
		cartes: function(){
			return Cartes.find({tags: "orbite", cubesat: Template.instance().data.scenario.initialisation.cubesat});
		}
	});
	Template.PartieCategories.helpers({
		categories: function(){
			var cats = [];
			for(var key in ListCategories){ if((key != "L") && (key != "O")) cats.push(key); }
			return cats;
		},
		nbrCartesSelect: function(categorie){
			return (_.filter(Template.parentData(1).partie.deck.cartes, function(obj){ return obj.categorie == categorie; }).length);
		},
		nbrCartesTotal: function(categorie){
			return Cartes.find({categorie: categorie, cubesat: Template.instance().data.scenario.initialisation.cubesat}).count();
		}
	});
	Template.Carte.helpers({
		isDeck: function(){
			if(_.findWhere(Template.parentData(1).partie.deck.cartes, {_carteId: this._id})) return "isDeck";
			return "";
		}
	});
	Template.PartieCategorie.helpers({
		cartes : function(){
			return Cartes.find({categorie: Template.instance().data.categorie, cubesat: Template.instance().data.scenario.initialisation.cubesat});
		}
	});
}