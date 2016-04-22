if (Meteor.isClient) {
	Template.registerHelper('getIllustration', function(carte){
		if(carte){
			if(!carte.hasOwnProperty("illustration") || (carte.illustration == "")) {
				if((carte.hasOwnProperty("eventId")) && (carte.eventId.length > 0)){
					illustration = "/Cartes/illustrations/defaut.png";
				} else {
					illustration = "/Cartes/illustrations/";
					if(carte.cubesat) illustration += "cubesat-";
					illustration += carte.carteId + ".png";
				}
			} else {
				if(carte.illustration[0] == '§'){
					illustration = "/Cartes/illustrations/" + carte.illustration.substring(1);
				} else illustration = "/cfs/files/illustrations/"+carte.illustration;
			}
		}
		else illustration = "/Cartes/illustrations/defaut.png";	
		//console.log("illustration");
		//console.log(illustration);	
		//console.log(carte);
		return illustration;
	});
	Template.ConfigCartes.helpers({
		categories: function(){
			var cats = [];
			for(var key in ListCategories){ cats.push(key); }
			return cats;
		},
		categoriesCubesat: function(){
			var cats = [];
			for(var key in ListCategories){ if((key != "J") && (key != "O") && (key != "S") && (key != "T") && (key != "P")) cats.push(key); }
			return cats;
		},
		nbrCartesTotal: function(categorie, cubesat){
			return Cartes.find({categorie: categorie, cubesat: cubesat}).count();
		}
	});
	Template.ConfigCartes.events({
		'click #retour': function(event){
			Router.go('Config');
		},
		'click .carteCategorie': function(event){
			Router.go('ConfigCartesCategorie', {_categorieId: $(event.currentTarget).attr('data-categorie'), _cubesat: $(event.currentTarget).attr('data-cubesat')});
		}
	});
	Template.ConfigCartesCategorie.helpers({
		cartes: function(){
			var cubesat = (Template.instance().data.cubesat == "1");
			return Cartes.find({categorie: Template.instance().data.categorie, cubesat: cubesat},{sort :{cubesat: -1, categorie: 1, ordre: 1}});
		}
	});
	Template.ConfigCartesCategorie.events({
		'click #retour': function(event){
			Router.go('ConfigCartes');
		},
		'click #addCarte': function(event){
			//console.log(Template.instance().data);
			Router.go('NouvelleCarte', {_categorieId: Template.instance().data.categorie, _cubesat: Template.instance().data.cubesat});
		},
		'click .carte': function(event){
			Router.go('EditCarte', {carteId: $(event.currentTarget).attr('data-carteId')});
		}
	});

	Template.Carte.helpers({
		isDeck: function(){
			if(this.carteId == "G0") return "isDeck";
			//console.log(_.findWhere(Template.parentData(1).partie.deck.cartes, {_carteId: this._id, nStructure: Session.get('currentStructure')}));
			if((Session.get("sPartieId")) && (_.findWhere(Template.parentData(1).partie.deck.cartes, {_carteId: this._id, nStructure: Session.get('currentStructure')}) && (this.categorie != 'Z'))) return "isDeck";
			return "";  
		},
		isLanceur: function(){
			if (_.indexOf(this.tags, "lanceur") > -1) return 'L';
			return '';
		},
		isEnergieGenerateur: function(){
			if (_.indexOf(this.tags, "energieGenerateur") > -1) return 'E';
			return '';
		},
		stars: function(){
			var n = getValeurDeRegle(Session.get("sPartieId"), this.valSci);

			var arr = [];
			for(var i=0; i < n; i++) arr.push("S");
			//console.log(arr);
			return arr;
		},
		hasTip: function(){
			return (this.tip[TAPi18n.getLanguage()].length > 0);
		}
	});
	Template.CartePreview.helpers({
		stars: function(){
			var n = getValeurDeRegle(Session.get("sPartieId"), this.carte.valSci);

			var arr = [];
			for(var i=0; i < n; i++) arr.push("S");
			//console.log(arr);
			return arr;
		},
		hasTip: function(){
			return (this.carte.tip[TAPi18n.getLanguage()].length > 0);
		},
		isLast: function(carteId, lastCarteId){
			if(carteId == lastCarteId) return "isLast";
			return "";
		},
		isInactive: function(){
			//console.log(_.find(Template.parentData(3).partie.deck.cartes, function(carte){ return carte._carteId == this.carte._id; }));
			if(Template.parentData(3).hasOwnProperty("partie") ){
				if ((_.findWhere(Template.parentData(3).partie.deck.cartes, {_carteId: this.carte._id})).active == false){
					return "inactive";
				}
				return "";
			} else {
				if ((_.findWhere(Template.parentData(2).partie.deck.cartes, {_carteId: this.carte._id})).active == false){
					return "inactive";
				}
				return "";
			}
		}
	});
	Template.CartePreview.events({
		'click .cartePreview': function(event){
			if(!$(event.currentTarget).hasClass("isLast")) {
				//console.log($(event.currentTarget).attr("id"));

				$(event.currentTarget).find("div.carteIllustration").toggle();
				$(event.currentTarget).find("div.carteDescription").toggle();
				$(event.currentTarget).find("div.carteConstantes").toggle();
				$(event.currentTarget).find("div.carteTips").toggle();
			}
		}
	});
	Template.CarteNom.helpers({
		carte: function(){ Cartes.findOne({_id: this}); }
	});

	Template.StructurePreview.events({
		'click .structurePreview': function(event){
			if(!$(event.currentTarget).hasClass("isLast")) {
				//console.log($(event.currentTarget).attr("id"));

				$(event.currentTarget).find("div.carteIllustration").toggle();
				$(event.currentTarget).find("div.carteDescription").toggle();
				$(event.currentTarget).find("div.carteConstantes").toggle();
				$(event.currentTarget).find("div.carteTips").toggle();
			}
		}
	});
	Template.CarteTxt.helpers({
		isStructure: function(){
			return (this.categorie == 'Z');
		},
		getTags: function(){
			if(this.tags.length ==0) return " ";
			var listeTags = '"' + this.tags[0] + '"';
			for(var t=1; t < this.tags.length; t++) listeTags += ', "' + this.tags[t] + '"';
			return listeTags;
		}
	});
	Template.EditCarte.helpers({
		isChecked: function(valeur){
			if (valeur !== false)  return "checked"; 
		},
		isNChecked: function(valeur){
			if (valeur === false)  return "checked"; 
		},
		isStructure: function(){
			return ((this.carte && (this.carte.categorie == 'Z')) || (this.categorie == 'Z'));
		},
		settings: function(){
			return {
				position: 'bottom',
				limit: 10,
				rules: [{
					token: '',
					collection: Tags,
					field: 'tag',
					matchAll: false,
					template: Template.TagAutoComplete
				}]
			};
		}
	});
	Template.EditCarte.events({
		'click #retour': function(event){
			if(Template.instance().data.carte){
				Router.go('ConfigCartesCategorie', {_categorieId: Template.instance().data.carte.categorie, _cubesat: Template.instance().data.carte.cubesat});
			} else {
				Router.go('ConfigCartesCategorie', {_categorieId: Template.instance().data.categorie, _cubesat: Template.instance().data.cubesat});
			}	
		},
		'autocompleteselect #tag': function(event, template, doc){
			$('#tag').val(doc.tag);
		},
		'click .remCarteTag' : function(event){
			//console.log($(event.currentTarget).parent().attr("id"));
			var tags = "";
			$(event.currentTarget).parent().remove();
			$('div.carteTag').each(function(){
				tags += ","+$(this).attr("id");
			});
			if(tags.length > 0) tags = tags.substring(1);
			$('#tags').val(tags);
		},
		'click #addTag' : function(event){
			//console.log('<div class="carteTag" id="' + $('#tag').val() + '">' + $('#tag').val() + '<div class="remCarteTag"> X </div></div>');
			$('div.listeTags').append('<div class="carteTag" id="' + $('#tag').val() + '">' + $('#tag').val() + '<div class="remCarteTag"> X </div></div>');
			var tags = "";
			$('div.carteTag').each(function(){
				tags += ","+$(this).attr("id");
			});
			if(tags.length > 0) tags = tags.substring(1);
			$('#tags').val(tags);
			$('#tag').val("");
		},
		'change #illustration' : function(event, template){
			//var _carteId = Template.instance().data.carte._id;
			//console.log(Template.instance().data.carte);

			/*FS.Utility.eachFile(event, function(file){
				var fsFile = new FS.File(file);
				fsFile.owner = Meteor.userId();

				
				Illustrations.insert(fsFile, function(err, fileObj){
					if (err){
             			// handle error
             			console.log(err);
         			} else {
            			$(event.currentTarget).next().val(fileObj._id);
            			var interval = Meteor.setInterval( function() {
            				if (fileObj.hasStored('illustrations')) {
            					$(event.currentTarget).prev().attr("src", "/cfs/files/illustrations/"+fileObj._id);  
                				$(event.currentTarget).next().val(fileObj._id);           				
                  				Meteor.clearInterval(interval);
              				}
    					}, 50);
          			}
				});
			});*/
		},
		'click #delCarte': function(event, template){
			template.data.securite = $('#securite').is(':checked');
			console.log(template.data);
			Modal.show("CarteSuppression", template.data);
		},
		'click #saveCarte': function(event){
			$("div.carteParametre").each( function(){ $(this).removeClass('error'); });


			if($('#intitule').val().length == 0){
				$(this).parent().addClass('error');
				throwAlert("error","champs_requis", TAPi18n.__("error.champs_requis_vide"));
				return;
			}
			var verif;
			var oldCarte;
			
			if(($('#_id').val().length > 0) && (!$('#securite').is(':checked'))) {
				oldCarte = Cartes.findOne({_id: $('#_id').val()});
				if(Meteor.apply('checkCarteUtilisee', [$('#_id').val()], {returnStubValue: true})){
					throwAlert("error","carte_utilisee", TAPi18n.__("error.carte_utilisee"));
					return;
				}
			}


			var carte = {
				categorie: $('#categorie').val(),
				cubesat: ($('#cubesat').val() === 'true'),
				copyright: $('#copyright').val(),
				intitule:{fr: '', en: ''},
				description:{fr: '', en: ''},
				tip:{fr: '', en: ''},
				reglesTXT:{
					necessite: $('#necessite').val(),
					incompatible: $('#incompatible').val()
				},
				regles:{},
				tags: (($('#tags').val()).split(",")),
				fiabilite: parseFloat($('#fiabilite').val()),
				valSci: parseInt($('#valSci').val()),
				active: ($('#active').val() === "1"),
				ordre: parseInt($('#ordre').val())
			};

			if(TAPi18n.getLanguage() == "fr"){
				carte.intitule.fr = $('#intitule').val();
				carte.intitule.en = (oldCarte ? oldCarte.intitule.en : $('#intitule').val());

				carte.description.fr = $('#description').val();
				carte.description.en = (oldCarte ? oldCarte.description.en : $('#description').val());

				carte.tip.fr = $('#tip').val();
				carte.tip.en = (oldCarte ? oldCarte.tip.en : $('#tip').val());
			} else if (TAPi18n.getLanguage() == "en"){
				carte.intitule.en = $('#intitule').val();
				carte.intitule.fr = (oldCarte ? oldCarte.intitule.fr : $('#intitule').val());

				carte.description.en = $('#description').val();
				carte.description.fr = (oldCarte ? oldCarte.description.fr : $('#description').val());

				carte.tip.en = $('#tip').val();
				carte.tip.fr = (oldCarte ? oldCarte.tip.fr : $('#tip').val());
			}

			if($('#_id').val().length > 0) {
				carte._id = $('#_id').val();
				carte.carteId = $('#carteId').val();
			} 

			if($('#newIllustration').val().length > 0){
				carte.illustration = $('#newIllustration').val();
			}
			if(carte.categorie == "Z"){
				carte.composants = ($('#composants').val() === 'true'),
				carte.atterrisseur = ($('#atterrisseur').val() === 'true'),
				carte.maxPds = parseInt($('#maxPds').val())
			};

			if(!isNaN(parseFloat($('#valEur').val())) && isFinite($('#valEur').val())) {
				carte.valEur = parseFloat($('#valEur').val());
			} else {
				carte.valEur = $('#valEur').val();
			}
			if(!isNaN(parseFloat($('#valNrg').val())) && isFinite($('#valNrg').val())) {
				carte.valNrg = parseFloat($('#valNrg').val());
			} else {
				carte.valNrg = $('#valNrg').val();
			}
			if(!isNaN(parseFloat($('#valPds').val())) && isFinite($('#valPds').val())) {
				carte.valPds = parseFloat($('#valPds').val());
			} else {
				carte.valPds = $('#valPds').val();
			}
			if(!isNaN(parseFloat($('#valVol').val())) && isFinite($('#valVol').val())) {
				carte.valVol = parseFloat($('#valVol').val());
			} else {
				carte.valVol = $('#valVol').val();
			}

			if($('#necessite').val()){
				verif = interprete($('#necessite').val(), 0, true);
				if(verif){
		    		if(verif.erreurPos > 0){
		      			throwAlert("error","carte_regle", TAPi18n.__("message.carte_regle_necessite", verif.erreur + ' (' + verif.erreurPos + ')' ));
		      			return;
		    		} else {
		      			carte.regles.necessite = verif.mongo;
		    		}
		  		}
		  	}
		  	if($('#incompatible').val()){
				verif = interprete($('#incompatible').val(), 0, true);
				if(verif){
		    		if(verif.erreurPos > 0){
		      			throwAlert("error","carte_regle", TAPi18n.__("message.carte_regle_incompatible", verif.erreur + ' (' + verif.erreurPos + ')' ));
		      			return;
		    		} else {
		      			carte.regles.incompatible = verif.mongo;
		    		}
		  		}
		  	}

			//console.log(carte);

			Meteor.call('setCarte', carte,  function(error, result){ if(Meteor.isClient) { Meteor.setTimeout(function(){ Router.go('ConfigCartesCategorie', {_categorieId: carte.categorie, _cubesat: carte.cubesat}, 2000); }); }});
		}
	});
	Template.CarteSuppression.events({
		'click .carteSuppressionNon': function(event){
			Modal.hide("CarteSuppression");
		},
		'click .carteSuppressionOui': function(event){
			var carte = Template.instance().data.carte;
			
			if((!Template.instance().data.securite) && Meteor.apply('checkCarteUtilisee', [Template.instance().data.carte._id], {returnStubValue: true})){
				Modal.hide("CarteSuppression");
				throwAlert("error","carte_utilisee", TAPi18n.__("error.carte_utilisee"));
				//console.log("carte utilisee merde");
				return;
			} else {
				Meteor.call('removeCarte', Template.instance().data.carte, Template.instance().data.securite);
				Router.go('ConfigCartesCategorie', {_categorieId: carte.categorie, _cubesat: carte.cubesat});
				Modal.hide("CarteSuppression");
			}
			
			
		}
	});
}