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
	Template.registerHelper('formatDate', function(valeur, format){
		return moment(valeur).format(format);
	});
	Template.registerHelper('getIconeConstante', function(nom, valeurMax, valeur){
		if(nom == "L-rd"){
			return nom + (valeur * 10);
		} else {
			var d = (valeurMax > 0 ? (valeur / valeurMax) * 100 : 0);
			if(d == 100) d--;
		//console.log(nom + ' ' + valeur + "/" + valeurMax + " = " + d + " => " + (Math.floor(d / 25) + 1));
			return nom + (Math.floor(d / 25) + 1);
		}
	});
	Template.registerHelper('multi100', function(percent){
		if(percent > 0)	return 100 * percent;
		return 10;
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
		'click #partieExpertise': function(event){
			var partie = Parties.findOne({_id: Template.instance().templateDictionary.get('currentPartie')});
			if(partie.experts.length > 0){
				Template.instance().templateDictionary.set('currentTemplate', 'PartieExpertiseRapport');
			} else {
				Template.instance().templateDictionary.set('currentTemplate', 'PartieExpertiseConfirmation');
			}
			
		},
		'click #appelExpertConfirmation': function(event){
			Template.instance().templateDictionary.set('currentTemplate', 'PartieExpertiseConfirmation');
		},
		'click #partieCollaboration': function(event){
			var partie = Parties.findOne({_id: Template.instance().templateDictionary.get('currentPartie')});
			if(partie.chat.length > 0){
				Template.instance().templateDictionary.set('currentTemplate', 'PartieCollaborationMessages');
			} else {
				Template.instance().templateDictionary.set('currentTemplate', 'PartieCollaborationConfirmation');
			}
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
			Template.instance().templateDictionary.set('currentLocationHash', '');
		},
		'click #percentLanceur': function(event){
			if($('#percentLanceurModal').css("width") == "100%"){
				if($('#percentLanceurModal').css("display") == "block"){
					$('#percentLanceurModal').css("display", "none");
				} else {
					$('#percentLanceurModal').css("display", "block");
				}
				
			}
		},
		'input #partiePctLanceur': function(event){
			event.stopPropagation();
			//console.log("nouveau pourcentage: " + $('#partiePctLanceur').val() );
			Meteor.call("updatePercentLanceur", Template.instance().data.partieId, Template.instance().templateDictionary.get('currentScenarioObj'), Number($('#partiePctLanceur').val()), Session.get("dateModif"));
		},
		'click #appelExpert': function(event){
			Meteor.call("callExpert", Template.instance().data.partieId, Template.instance().templateDictionary.get('currentScenarioObj'), Session.get("dateModif"));
			Template.instance().templateDictionary.set('currentTemplate', 'PartieExpertiseRapport');
		},
		'click #dernierExpert': function(event){
			Template.instance().templateDictionary.set('currentTemplate', 'PartieExpertiseRapport');
		},
		'click #addMessage': function(event){
			if($('#newMessage').val().length > 0){
				Meteor.call("addMessage",Template.instance().data.partieId, Template.instance().templateDictionary.get('currentScenarioObj'), $('#newMessage').val(), Session.get("dateModif"));
			}
		},
		'click #messages': function(event){
			Template.instance().templateDictionary.set('currentTemplate', 'PartieCollaborationMessages');
		},
		'click #appelPeer': function(event){
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
		}
	});
	Template.PartieHeader.helpers({
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
		},
		hasLanceur: function(){
			if(_.find(Template.parentData(0).partie.deck.cartes, function(obj){ return (_.indexOf(obj.tags, "lanceur") > -1); })) return true;
			return false;
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
	Template.PartieCategorie.onRendered(function(){
		console.log(Template.instance().data.locationHash);
		if(Template.instance().data.locationHash){
			$(document).scrollTop( $('#'+Template.instance().data.locationHash).offset().top );  
			//$('#'+Template.instance().data.locationHash).focus();
		} 
	});
	Template.PartieCategorie.helpers({
		cartes : function(){
			return Cartes.find({categorie: Template.instance().data.categorie, cubesat: Template.instance().data.scenario.initialisation.cubesat});
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
					console.log(e.rapport);
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
}