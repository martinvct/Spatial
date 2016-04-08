if (Meteor.isClient) {
	Template.registerHelper('convertir', function(valeur, unite){
		return convertir(valeur, unite);
	});
	Template.registerHelper('getIconeConstante', function(nom, valeurMax, valeur){
		if(nom == "star-rd"){
			if(valeur == 0) return nom+"0";
			return nom+"4";
		}
		if(nom == "L-rd"){
			return nom + (valeur * 10);
		} else {
			var d = (valeurMax > 0 ? (valeur / valeurMax) * 100 : 0);
			if(d == 0) return nom + "0";
		//console.log(nom + ' ' + valeur + "/" + valeurMax + " = " + d + " => " + (Math.floor(d / 25) + 1));
			return nom + (Math.floor((d-1) / 25) + 1);
		}
	});
	Template.registerHelper('multi100', function(percent){
		if(percent > 0)	return 100 * percent;
		return 10;
	});
	Template.registerHelper('getValeurDeRegle', function(valeurStr){
		return getValeurDeRegle(Session.get("sPartieId"), valeurStr);
	});
	Template.Partie.onCreated(function(){
		this.templateDictionary = new ReactiveDict();
		this.templateDictionary.set('currentPartie', this.data.partieId);
		//this.templateDictionary.set('nomPartie', Parties.findOne({_id: this.data.partieId},{nom: 1}));
		this.templateDictionary.set('currentScenario', this.data.scenarioId);
		this.templateDictionary.set('currentTemplate', 'partieTest');
		this.templateDictionary.set('currentScenarioObj', Scenarios.findOne({_id: Template.instance().templateDictionary.get('currentScenario')}));
		this.templateDictionary.set('currentCategorie',"");
		initTimer(this.data.partieId);	
		Template.instance().templateDictionary.set('currentTemplate', 'ViewScenario');
		Session.set("toScore", false);
	});
	Template.Partie.onRendered(function(){
		this.autorun(() => {
			if(Session.get("toScore")){
				Template.instance().templateDictionary.set('currentTemplate', 'PartieScore');
				Session.set("toScore", false);
			}
		})
	});
	Template.Parties.onCreated(function(){
		saveTimer();
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
			return { partie: Parties.findOne({_id: Template.instance().templateDictionary.get('currentPartie')}), scenario: Template.instance().templateDictionary.get('currentScenarioObj'), categorie: Template.instance().templateDictionary.get('currentCategorie'), locationHash:  Template.instance().templateDictionary.get('currentLocationHash')};
		},
		scenario: function(){
			return  Template.instance().templateDictionary.get('currentScenarioObj');
		},
		partie: function(){
			var user = Meteor.user();	
			var partie = Parties.findOne({_id: Template.instance().templateDictionary.get('currentPartie')});
			if(partie.userId != user._id){
				if(_.findWhere(partie.peers, {userId: user._id})){
					if(_.findWhere(partie.peers, {dateDebut: 0, userId: user._id})) Meteor.call('replyPeer', partie._id);
				} else if(!user.isAdmin) {
					Router.go('Home');
				}
			}

			if(!Session.get("dateModif")){
				Session.set("dateModif", partie.dateModif.getTime());
			}
			return partie;
		}
		
		
	});
	Template.Partie.events({
		'click #partieScenario': function(event){
			Session.set('currentStructure', 0);
			Template.instance().templateDictionary.set('currentTemplate', 'ViewScenario');
			saveTimer(Template.instance().templateDictionary.get('currentPartie'));
		},
		'click #partieLanceur': function(event){
			Session.set('currentStructure', 0);
			Template.instance().templateDictionary.set('currentTemplate', 'PartieLanceur');
			saveTimer(Template.instance().templateDictionary.get('currentPartie'));
		},
		'click #partieOrbite': function(event){
			Session.set('currentStructure', 0);
			Template.instance().templateDictionary.set('currentTemplate', 'PartieOrbite');
			saveTimer(Template.instance().templateDictionary.get('currentPartie'));
		},
		'click #partieStructure': function(event){
			Session.set('currentStructure', 0);
			Template.instance().templateDictionary.set('currentTemplate', 'PartieStructure');
			saveTimer(Template.instance().templateDictionary.get('currentPartie'));
		},
		'click #partieSegmentSol': function(event){
			Session.set('currentStructure', 0);
			Template.instance().templateDictionary.set('currentCategorie', "S");
			Template.instance().templateDictionary.set('currentTemplate', 'PartieCategorie');
			Template.instance().templateDictionary.set('currentLocationHash', '');
		},
		'click #partieExpertise': function(event){
			Session.set('currentStructure', 0);
			var partie = Parties.findOne({_id: Template.instance().templateDictionary.get('currentPartie')});
			if(partie.experts.length > 0){
				Template.instance().templateDictionary.set('currentTemplate', 'PartieExpertiseRapport');
			} else {
				Template.instance().templateDictionary.set('currentTemplate', 'PartieExpertiseConfirmation');
			}
			saveTimer(Template.instance().templateDictionary.get('currentPartie'));
		},
		'click #appelExpertConfirmation': function(event){
			Session.set('currentStructure', 0);
			Template.instance().templateDictionary.set('currentTemplate', 'PartieExpertiseConfirmation');
			saveTimer(Template.instance().templateDictionary.get('currentPartie'));
		},
		'click #partieCollaboration': function(event){
			Session.set('currentStructure', 0);
			var partie = Parties.findOne({_id: Template.instance().templateDictionary.get('currentPartie')});
			if(partie.chat.length > 0){
				Template.instance().templateDictionary.set('currentTemplate', 'PartieCollaborationMessages');
			} else {
				Template.instance().templateDictionary.set('currentTemplate', 'PartieCollaborationConfirmation');
			}
			saveTimer(Template.instance().templateDictionary.get('currentPartie'));
		},
		'click div.carte': function(event){
			var carteId = $(event.currentTarget).attr("data-carteId");
			if($(event.currentTarget).hasClass("isDeck")){ 
				Meteor.call('removeCarteFromDeck', Template.instance().data.partieId, Template.instance().templateDictionary.get('currentScenarioObj'), this, Session.get('currentStructure'), Session.get("dateModif"));
				//$(event.currentTarget).removeClass("isDeck");
			} else {
				console.log("AJOUT CARTE DANS " + Session.get('currentStructure'));
				console.log("PartieId "+ Template.instance().data.partieId);
				console.log("ScenId " + Template.instance().templateDictionary.get('currentScenarioObj'));
				console.log(this);
				Meteor.call("addCarteToDeck", Template.instance().data.partieId, Template.instance().templateDictionary.get('currentScenarioObj'), this, Session.get('currentStructure'), Session.get("dateModif"));
				//$(event.currentTarget).addClass("isDeck");
			}
			saveTimer(Template.instance().templateDictionary.get('currentPartie'));
		},
		'click .partieCategorie': function(event){
			Template.instance().templateDictionary.set('currentCategorie', this[0]);
			Template.instance().templateDictionary.set('currentTemplate', 'PartieCategorie');
			Template.instance().templateDictionary.set('currentLocationHash', '');
		},
		'click .structureCategorie': function(event){
			Template.instance().templateDictionary.set('currentCategorie', $(event.currentTarget).attr('data-categorie'));
			Session.set('currentStructure', parseInt($(event.currentTarget).attr('data-nStructure')));
			Template.instance().templateDictionary.set('currentTemplate', 'PartieCategorie');
			Template.instance().templateDictionary.set('currentLocationHash', '');
		},
		'click .structureMagasin': function(event){
			if($(event.currentTarget).parent().find("button.structureMagasin").length){
				Session.set('currentStructure', parseInt($(event.currentTarget).attr('data-nStructure')));
				Template.instance().templateDictionary.set('currentTemplate', 'PartieCategories');
				Template.instance().templateDictionary.set('currentLocationHash', '');
			}
		},
		'click #percentLanceur': function(event){
			if($('#percentLanceurModal').css("width") == "100%"){
				if($('#percentLanceurModal').css("display") == "block"){
					$('#percentLanceurModal').css("display", "none");
				} else {
					$('#percentLanceurModal').css("display", "block");
				}
				
			}
			saveTimer(Template.instance().templateDictionary.get('currentPartie'));
		},
		'input #partiePctLanceur': function(event){
			event.stopPropagation();
			//console.log("nouveau pourcentage: " + $('#partiePctLanceur').val() );
			Meteor.call("updatePercentLanceur", Template.instance().data.partieId, Template.instance().templateDictionary.get('currentScenarioObj'), Number($('#partiePctLanceur').val()), Session.get("dateModif"));
		},
		'click #appelExpert': function(event){
			Session.set('currentStructure', 0);
			Meteor.call("callExpert", Template.instance().data.partieId, Template.instance().templateDictionary.get('currentScenarioObj'), Session.get("dateModif"));
			Template.instance().templateDictionary.set('currentTemplate', 'PartieExpertiseRapport');
			saveTimer(Template.instance().templateDictionary.get('currentPartie'));
		},
		'click #dernierExpert': function(event){
			Template.instance().templateDictionary.set('currentTemplate', 'PartieExpertiseRapport');
		},
		'click #addMessage': function(event){
			if($('#newMessage').val().length > 0){
				Meteor.call("addMessage",Template.instance().data.partieId, Template.instance().templateDictionary.get('currentScenarioObj'), $('#newMessage').val(), Session.get("dateModif"));
			}
			saveTimer(Template.instance().templateDictionary.get('currentPartie'));
		},
		'click #messages': function(event){
			Template.instance().templateDictionary.set('currentTemplate', 'PartieCollaborationMessages');
			saveTimer(Template.instance().templateDictionary.get('currentPartie'));
		},
		'click #appelPeer': function(event){
			if($('#peer').val().length > 0){
				Meteor.call("callPeer", Template.instance().data.partieId, Template.instance().templateDictionary.get('currentScenarioObj'), $('#peer').val() , Session.get("dateModif"));
				saveTimer(Template.instance().templateDictionary.get('currentPartie'));
			}
			Template.instance().templateDictionary.set('currentTemplate', 'PartieCollaborationMessages');		
		},
		'click #appelPeerConfirmation' : function(event){
			Template.instance().templateDictionary.set('currentTemplate', 'PartieCollaborationConfirmation');
			saveTimer(Template.instance().templateDictionary.get('currentPartie'));
		},
		'click .carteLien': function(event){
			Template.instance().templateDictionary.set('currentCategorie', this.categorie);
			Template.instance().templateDictionary.set('currentTemplate', 'PartieCategorie');
			Template.instance().templateDictionary.set('currentLocationHash', this.carteId);
		},
		'click .categorieLien': function(event){
			Template.instance().templateDictionary.set('currentCategorie', this.categorie);
			Template.instance().templateDictionary.set('currentTemplate', 'PartieCategorie');
			Template.instance().templateDictionary.set('currentLocationHash', '');
		},
		'click #partieLancement': function(event){
			Session.set('currentStructure', 0);
			Template.instance().templateDictionary.set('currentTemplate', 'PartieLancement');
			saveTimer(Template.instance().templateDictionary.get('currentPartie'));
		},
		'click #partieLancementConf': function(event, template){
			Session.set('currentStructure', 0);
			//Template.instance().templateDictionary.set('currentTemplate', 'PartieLancementConfirmation');
			saveTimer(Template.instance().templateDictionary.get('currentPartie'));
				//console.log(Template.parentData(1));
			template.data.partieId = Template.instance().templateDictionary.get('currentPartie');
			template.data.scenario = Template.instance().templateDictionary.get('currentScenarioObj');
			Session.set('toScore', false);

			//console.log('partieLancementConf');
			Modal.show("PartieLancementConf", this);
		}
	});
	Template.PartieHeader.helpers({
		hasPlanete: function(){
			// si scenario == cubesat => ok
			// sinon si objectif : 1 seule planete : si pas encore dans partie => on ajoute la planete dans la partie => tjs OK
			//					   plusieurs planetes possibles : si pas encore dans partie => KO sinon OK

			
			if(Template.parentData(0).partie.cubesat) return true;
			if(!Template.parentData(0).partie.planete){
				var scenario = Scenarios.findOne({_id : Template.parentData(0).partie.scenarioId});
				if(scenario.initialisation.planetes.length == 1){
					Meteor.call("setPlaneteToPartie", Template.parentData(0).partie, scenario, (_.findWhere(Planetes, {planeteId: scenario.intialisation.planetes[0]})));
					return true;
				}
				return false;
			}
			return true;
		},
		hasLanceur: function(){
			if(_.find(Template.parentData(0).partie.deck.cartes, function(obj){ return (_.indexOf(obj.tags, "lanceur") > -1); })) return true;
			return false;
		} 
	});
	Template.PartieLanceur.helpers({
		cartes: function(){
			return Cartes.find({tags: "lanceur", cubesat: Template.instance().data.scenario.initialisation.cubesat}, {sort: {ordre: 1}});
		},
		hasLanceurLourd: function(){
			
			var result = interprete('CE2 + CZ1', 0, true);
			if(result.erreurPos > 0){
				console.log(result.erreurPos+" : "+result.erreur);
			}
			else console.log(result.mongo);

			var result = interprete('S3 + (J4/J5)', 0, true);
			if(result.erreurPos > 0){
				console.log(result.erreurPos+" : "+result.erreur);
			}
			else console.log(result.mongo);

			result = interprete('{"objectif": "espace"} / {"planete.atterrisseur": false }', 0, true);
			if(result.erreurPos > 0){
				console.log(result.erreurPos+" : "+result.erreur);
			}
			else console.log(result.mongo);

			result = interprete('{"planete.rayonnement": {"$lt": 0.5} }', 0, true);
			if(result.erreurPos > 0){
				console.log(result.erreurPos+" : "+result.erreur);
			}
			else console.log(result.mongo);

			result = interprete('"propulsionMoteur" + S2 + "attitudeCapteur" + (Z1/Z4)', 0, true);
			if(result.erreurPos > 0){
				console.log(result.erreurPos+" : "+result.erreur);
			}
			else console.log(result.mongo);

			result = interprete('Z5 + {"planete.atmosphere": true}', 0, true);
			if(result.erreurPos > 0){
				console.log(result.erreurPos+" : "+result.erreur);
			}
			else console.log(result.mongo);

			
			//var result = interprete('(((C5§ / ("communicationsAntenne"§ + "communicationsGestion"§)) + (Z1/Z2/Z3/Z4)) / ("communicationsAntenne"§ + "communicationsGestion"§ + Z4)) + S3 + (J4§ /J5§)', 0, true);
			//var result = interprete('{"objectif": "espace"}/{"planete.distance": 0}/(Z4 + (O1/O2/O3/O4))');
			var reg = new RegExp(/(§nS)/,"g");
			var result = interprete('Z5§');

			if(result.erreurPos > 0){
				console.log(result.erreurPos+" : "+result.erreur);
			}
			else console.log(result.mongo.replace(reg, "2"));

			//'{"deck.cartes": {"$elemMatch": {"$and": [{"carteId": "CE2", "active": true}, {"carteId": "CZ1", "active": true}]}}}' CE2 + CZ1
			//'{"deck.cartes": {"$elemMatch": {"$or": [{"carteId": "O3", "active": true}, {"carteId": "O4", "active": true}, {"carteId": "O5", "active": true}, {"carteId": "O6", "active": true}]}}}' O3/O4/O5/O6
			//'{"deck.cartes": {"$elemMatch": {"$and": [{"carteId": "S3", "active": true}, {"$or": [{"carteId": "J4", "active": true}, {"carteId": "J5", "active": true}]}]}}}' S3 + (J4/J5)
			//'{"$or":[{"objectif": "espace"},{"planete.atterrisseur": false }]}' {"objectif": "espace"} / {"planete.atterrisseur": false }
			//'{"deck.cartes": {"$elemMatch": {"tags": "energieBatterie", "active": true}}}' "energieBatterie"
			//'{"planete.rayonnement": {"$lt": 0.5} }'
			//{"deck.cartes": {"$elemMatch": {"$and": [{"tags": "propulsionMoteur", "active": true}, {"carteId": "S2", "active": true}, {"tags": "attitudeCapteur", "active": true}, {"$or": [{"carteId": "Z1", "active": true}, {"carteId": "Z4", "active": true}]}]}}}'
			//{"$and": [{"deck.cartes": {"$elemMatch": {"$and": [{"carteId": "Z5", "active": true}]}}}, {"planete.atmosphere": true}]}

			

			if(_.find(Template.parentData(0).partie.deck.cartes, function(obj){ return (_.indexOf(obj.tags, "lanceurLourd") > -1); })) return true;
			return false;
		}
	});
	Template.PartieOrbite.helpers({
		cartes: function(){
			return Cartes.find({tags: "orbite", cubesat: Template.instance().data.scenario.initialisation.cubesat}, {sort: {ordre: 1}});
		}
	});
	Template.PartieCategories.helpers({
		structure: function(){
			if(Session.get('currentStructure') == 0) return;
			var carteStructureId = (_.filter(Template.instance().data.partie.deck.cartes, function(obj){ return ((obj.categorie == "Z") && (obj.nStructure == Session.get('currentStructure')) ); }))[0]._carteId;	
			return Cartes.findOne({_id: carteStructureId});
		},
		nStructure: function(){
			return Session.get("currentStructure");
		},
		categories: function(){
			if(Session.get('currentStructure') == 0) return;
			var carteStructureId = (_.filter(Template.instance().data.partie.deck.cartes, function(obj){ return ((obj.categorie == "Z") && (obj.nStructure == Session.get('currentStructure')) ); }))[0]._carteId;	
			var carteStructure = Cartes.findOne({_id: carteStructureId});
			var cats = [];
			if(carteStructure.composants){
				if(carteStructure.atterrisseur){
					for(var key in ListCategories){ if((key != "L") && (key != "O") && (key != "Z") && (key != "S") && (key != "A") && (key != "P")) cats.push(key); }
				} else {
					for(var key in ListCategories){ if((key != "L") && (key != "O") && (key != "Z") && (key != "S") && (key != "J") && ((!Template.instance().data.partie.cubesat) || ((key != "T") && (key != "P")))) cats.push(key); }
				}
			} else {
				cats.push("A");
				cats.push("P");
			}	
			return cats;
		},
		nbrCartesSelect: function(categorie){
			return (_.filter(Template.parentData(1).partie.deck.cartes, function(obj){ return ((obj.categorie == categorie) && (obj.nStructure == Session.get('currentStructure'))); }).length);
		},
		nbrCartesTotal: function(categorie){
			if((!Template.instance().data.scenario.initialisation.cubesat) && (Template.instance().data.categorie == "I")){
				if(Template.instance().data.scenario.initialisation.objectif == "espace"){
					return Cartes.find({categorie: categorie, cubesat: Template.instance().data.scenario.initialisation.cubesat, tags: "instrumentEspace"}).count();
				}
				return Cartes.find({categorie: categorie, cubesat: Template.instance().data.scenario.initialisation.cubesat, tags: "instrumentPlanete"}).count();
			}
			return Cartes.find({categorie: categorie, cubesat: Template.instance().data.scenario.initialisation.cubesat}).count();
		}
	});
	
	
	Template.PartieCategorie.onRendered(function(){
		console.log(Template.instance().data.locationHash);
		if(Template.instance().data.locationHash){
			$(document).scrollTop( $('#'+Template.instance().data.locationHash).offset().top );  
			//$('#'+Template.instance().data.locationHash).focus();
		} 
	});
	Template.PartieCategorie.helpers({
		structure: function(){
			if(Session.get('currentStructure') == 0) return;
			var carteStructureId = (_.filter(Template.instance().data.partie.deck.cartes, function(obj){ return ((obj.categorie == "Z") && (obj.nStructure == Session.get('currentStructure')) ); }))[0]._carteId;	
			return Cartes.findOne({_id: carteStructureId});
		},
		nStructure: function(){
			return Session.get("currentStructure");
		},
		cartes : function(){
			if((!Template.instance().data.partie.cubesat) && (Template.instance().data.categorie == "I")){
				if(Template.instance().data.scenario.initialisation.objectif == "espace"){
					return Cartes.find({categorie: Template.instance().data.categorie, cubesat: Template.instance().data.scenario.initialisation.cubesat, tags: "instrumentEspace"}, {sort: {ordre: 1}});
				}
				return Cartes.find({categorie: Template.instance().data.categorie, cubesat: Template.instance().data.scenario.initialisation.cubesat, tags: "instrumentPlanete"}, {sort: {ordre: 1}});
			}
			return Cartes.find({categorie: Template.instance().data.categorie, cubesat: Template.instance().data.scenario.initialisation.cubesat}, {sort: {ordre: 1}});
		},
		categorieLegende: function(){
			return TAPi18n.__("categories_legendes."+Template.instance().data.categorie);
		}

	});
	Template.PartieStructure.onRendered(function(){
		//console.log(Template.instance().data.locationHash);
		/*if(Template.instance().data.locationHash){
			$(document).scrollTop( $('#'+Template.instance().data.locationHash).offset().top );  
		} */
	});
	Template.PartieStructure.helpers({
		structures : function(){
			var structures = [];
			//console.log(Template.instance().data);
			
			for(var i=0; i < Template.instance().data.partie.deck.structures.ids.length; i++){
				//console.log("ICI "+i);
				var deckCarte = _.filter(Template.instance().data.partie.deck.cartes, function(obj){ return ((obj.categorie == "Z") && (obj.nStructure == Template.instance().data.partie.deck.structures.ids[i]) ); });
				if(!deckCarte) continue;
				//console.log("LA "+i);
				//console.log(deckCarte);
				var carteStructureId = deckCarte[0]._carteId;
				//console.log(carteStructureId);
				var carteStructure = Cartes.findOne({_id: carteStructureId});
				//console.log(carteStructure);
				var structure = {
					n: deckCarte[0].nStructure,
					carte: carteStructure,
					categories: []
				};
				if(carteStructure.composants){
					if(carteStructure.atterrisseur){
						for(var key in ListCategories){ 
							if((key != "L") && (key != "O") && (key != "Z") && (key != "S") && (key != "A") && (key != "P")) {
								structure.categories.push({categorie: key, nbrSelect: (_.filter(Template.instance().data.partie.deck.cartes, function(obj){ return ((obj.categorie == key) && (obj.nStructure == Template.instance().data.partie.deck.structures.ids[i]) ); }).length)});
							} 
						}
					} else {
						for(var key in ListCategories){ 
							//console.log(key);
							if((key != "L") && (key != "O") && (key != "Z") && (key != "S") && (key != "J") && ((!Template.instance().data.partie.cubesat) || ((key != "T") && (key != "P")))) {
								//console.log( Template.instance().data.partie.deck.structures.ids[i]);
								//console.log(Template.instance().data.partie.deck.cartes);
								//console.log(_.filter(Template.instance().data.partie.deck.cartes, function(obj){ return ((obj.categorie == key) && (obj.nStructure == Template.instance().data.partie.deck.structures.ids[i]) ); }).length);
								structure.categories.push({categorie: key, nbrSelect: (_.filter(Template.instance().data.partie.deck.cartes, function(obj){ return ((obj.categorie == key) && (obj.nStructure == Template.instance().data.partie.deck.structures.ids[i]) ); }).length)});
							} 
						}
					}
				} else {
					structure.categories.push({categorie: "A", nbrSelect: (_.filter(Template.instance().data.partie.deck.cartes, function(obj){ return ((obj.categorie == "A") && (obj.nStructure == Template.instance().data.partie.deck.structures.ids[i]) ); }).length)});
					structure.categories.push({categorie: "P", nbrSelect: (_.filter(Template.instance().data.partie.deck.cartes, function(obj){ return ((obj.categorie == "P") && (obj.nStructure == Template.instance().data.partie.deck.structures.ids[i]) ); }).length)});
				}
				structures.push(structure);
			}
			//console.log(structures);
			return structures; 
		},
		cartes : function(){
			return Cartes.find({categorie: "Z", cubesat: Template.instance().data.scenario.initialisation.cubesat}, {sort: {ordre: 1}});
		},
		categorieLegende: function(){
			return TAPi18n.__("categories_legendes.Z");
		}

	});
	Template.Structure.events({
		'click .structureSupprimer': function(event, template){
			Session.set('currentStructure', parseInt($(event.currentTarget).attr('data-nStructure')));
			//console.log(Template.parentData(1));
			template.data.partieId = Template.parentData(1).partie._id;
			template.data.scenario = Template.parentData(1).scenario;
			Modal.show("StructureSuppression", template.data);
		}
	});

	Template.PartieExpertiseConfirmation.helpers({
		nbrExpertsAppeles: function(){
			return Template.instance().data.partie.experts.length;
		},
		rapportExiste: function(){
			return (Template.instance().data.partie.experts.length > 0);
		}
	});
	Template.PartieExpertiseRapport.helpers({
		erreurs: function(){
			if(Template.instance().data.partie.experts){
				var lastRapport = _.max(Template.instance().data.partie.experts, function(rapport){ return rapport.dateAppel; });
				if(lastRapport){
					var e = _.find(Template.instance().data.partie.experts, function(rapport){ return rapport.dateAppel == lastRapport.dateAppel; });
					//console.log(e.rapport);
					return e.rapport;
				}
			}	
			return null;
		},
		niveauDetailsCategorie: function(){
			return (Template.instance().data.scenario.expertise.niveauDetails == 1);
		},
		niveauDetailsCartes: function(){
			return (Template.instance().data.scenario.expertise.niveauDetails == 2);
		}
	});
	Template.PartieCollaborationConfirmation.helpers({
		nbrPeersAppeles: function(){
			return (_.filter(Template.instance().data.partie.peers, function(peer){ return peer.dateDebut > 0; })).length;
		},
		messageExiste: function(){
			var now = new Date();
			var t = _.find(Template.instance().data.partie.peers, function(peer){ return ((peer.dateDebut > 0) && ((peer.dureeMax == 0) || (peer.dateDebut.getTime() + peer.dureeMax > now.getTime())));   } );
			return ((Template.instance().data.partie.chat.length > 0) || t);
		},
		settings: function(){
			return {
				position: 'top',
				limit: 10,
				rules: [{
					token: '',
					collection: Meteor.users,
					field: 'profile.pattern',
					matchAll: true,
					template: Template.UserAutoComplete
				}]
			};
		}
	});
	Template.PartieCollaborationConfirmation.events({
		'autocompleteselect #peer': function(event, template, doc){
			console.log(doc);
			$('#peer').val(doc.username);
		}
	});
	Template.PartieCollaborationMessages.helpers({
		messageItems: function(){
			var messageItems = [];
			var usrObject;
			var listUsers = [];
			listUsers[Meteor.userId()] = Meteor.user();
			if(Meteor.userId() != Template.instance().data.partie.userId) {
				listUsers[Template.instance().data.partie.userId] = Meteor.users.findOne({_id: Template.instance().data.partie.userId},{fields: {username:1, profile:1}});
			}
			for(var p=0; p < Template.instance().data.partie.peers.length; p++){
				if(Template.instance().data.partie.peers[p].userId == Meteor.userId()) {
					usrObject = Meteor.user();
				} else if (listUsers[Template.instance().data.partie.peers[p].userId] ){
					usrObject = listUsers[Template.instance().data.partie.peers[p].userId];
				} else {
					listUsers[Template.instance().data.partie.peers[p].userId] = Meteor.users.findOne({_id: Template.instance().data.partie.peers[p].userId},{fields: {username:1, profile:1}});
					usrObject = listUsers[Template.instance().data.partie.peers[p].userId];
				}
				messageItems.push({typeItem: "appel", date: Template.instance().data.partie.peers[p].dateAppel, pair:{ username: usrObject.profile.username, firstname: usrObject.profile.firstname, lastname: usrObject.profile.lastname, avatar: usrObject.profile.avatar}});
				if(Template.instance().data.partie.peers[p].dateDebut){
					messageItems.push({typeItem: "reponse", date: Template.instance().data.partie.peers[p].dateDebut, pair:{ username: usrObject.profile.username, firstname: usrObject.profile.firstname, lastname: usrObject.profile.lastname, avatar: usrObject.profile.avatar}});
				}
			}
			for(var m=0; m < Template.instance().data.partie.chat.length; m++){
				//console.log("messageItemChat");
				//console.log("chat "+Template.instance().data.partie.chat[m].auteurId);
				usrObject = listUsers[Template.instance().data.partie.chat[m].auteurId];
				//console.log(usrObject);
				messageItems.push({typeItem: "message", message: Template.instance().data.partie.chat[m].message, date: Template.instance().data.partie.chat[m].dateTime, pair:{ username: usrObject.profile.username, firstname: usrObject.profile.firstname, lastname: usrObject.profile.lastname, avatar: usrObject.profile.avatar}});
			}
			return (_.sortBy(messageItems, "date")).reverse();
		}
	});
	Template.PartieLancement.helpers({
		cartesglobales: function(){
			var cIds = _.pluck(_.filter(Template.instance().data.partie.deck.cartes, function(carte){ return carte.nStructure == 0; }), "_carteId");
			//console.log(cIds);
			var result = {
				cartes: Cartes.find({_id: {$in: cIds}}, {sort: {categorie:1, ordre: 1}}).fetch(),
				last: ""
			} 
			//console.log(result.last);
			if(Template.instance().data.scenario.initialisation.budgetGestion > 0){
				result.cartes.unshift({
					carteId: "G0",
					categorie: "G",
					intitule: {"fr": "Coût de projet", "en": "Project cost" },
					ordre: 0,
					copyright: "",
					description: {"fr": "Coût de préparation et gestion de projet, ainsi que l'intégration de toutes les pièces sur la structure et les test de l'ensemble en environnement spatial pour la mission.", "en": ""},
					valEur: Template.instance().data.scenario.initialisation.budgetGestion
				});
			}
			if(result.cartes.length > 0) result.last = result.cartes[result.cartes.length -1].carteId;
			return result;
		},
		evenements: function(){
			var eIds = Template.instance().data.partie.eventIds;
			console.log(eIds);
			return Evenements.find({_id: {$in: eIds}}, {sort: {categorie:1, ordre: 1}});
		},
		hasEvenements: function(){
			return (Template.instance().data.partie.eventIds.length > 0);
		},
		structures: function(){
			var structures = [];
			//console.log(Template.instance().data);
			
			for(var i=0; i < Template.instance().data.partie.deck.structures.ids.length; i++){
				//console.log("ICI "+i);
				var deckCarte = _.filter(Template.instance().data.partie.deck.cartes, function(obj){ return ((obj.categorie == "Z") && (obj.nStructure == Template.instance().data.partie.deck.structures.ids[i]) ); });
				if(!deckCarte) continue;
				//console.log("LA "+i);
				//console.log(deckCarte);
				var carteStructureId = deckCarte[0]._carteId;
				//console.log(carteStructureId);
				var carteStructure = Cartes.findOne({_id: carteStructureId});
				//console.log(carteStructure);
				var structure = {
					n: deckCarte[0].nStructure,
					carte: carteStructure,
					cartes: [],
					last: ""
				};
				var cIds = _.pluck(_.filter(Template.instance().data.partie.deck.cartes, function(obj){return ((obj.categorie != "Z") && (obj.nStructure == Template.instance().data.partie.deck.structures.ids[i]) );}), "_carteId");
				structure.cartes = Cartes.find({_id: {$in: cIds}}, {sort: {categorie:1, ordre: 1}}).fetch();
				if(structure.cartes.length > 0) structure.last = structure.cartes[structure.cartes.length - 1].carteId;
				console.log(structure.last);
				structures.push(structure);
			}
			//console.log(structures);
			return structures; 

		}
	});
	Template.PartieLancementConf.events({
		'click #partieLancementConfirmation': function(event, template){
			Meteor.call("lancementProjet", Template.instance().data.partie._id, Template.instance().data.scenario, Session.get("dateModif"));
			Session.set("toScore", true);
			Modal.hide("PartieLancementConf");
		},
		'click #partieLancementAnnulation': function(event){
			Modal.hide("PartieLancementConf");
		}
	});
	Template.PartieScore.helpers({
		erreurs: function(){
			return Template.instance().data.partie.rapportFinal;
		},
		score: function(){
			return Template.instance().data.partie.score;
		},
		niveauDetailsCategorie: function(){
			return (Template.instance().data.scenario.validation.niveauDetails == 1);
		},
		niveauDetailsCartes: function(){
			return (Template.instance().data.scenario.validation.niveauDetails == 2);
		}
	});
	Template.StructureSuppression.events({
		'click .structureSuppressionNon': function(event){
			Modal.hide("StructureSuppression");
			Session.set("currentStructure", 0);
		},
		'click .structureSuppressionOui': function(event){
			Meteor.call('removeCarteFromDeck', Template.instance().data.partieId, Template.instance().data.scenario, Template.instance().data.carte, Session.get('currentStructure'), Session.get("dateModif"));
			saveTimer( Template.instance().data.partieId);
			Modal.hide("StructureSuppression");
			Session.set("currentStructure", 0);
		}
	});
}