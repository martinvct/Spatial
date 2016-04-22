if(Meteor.isClient){
	Template.registerHelper('evenementNumero', function(eventId){
		return eventId.substring(2);
	});
	Template.ConfigEvenements.helpers({
		nbrEvenementsTotal: function(cubesat){
			return Evenements.find({cubesat: cubesat}).count();
		}
	});
	Template.ConfigEvenements.events({
		'click #retour': function(event){
			Router.go('Config');
		},
		'click .evenementType': function(event){
			Router.go('ConfigEvenementsType', { _cubesat: $(event.currentTarget).attr('data-cubesat')});
		}
	});
	Template.ConfigEvenementsType.helpers({
		evenements: function(){
			var cubesat = (Template.instance().data.cubesat == "1");
			return Evenements.find({cubesat: cubesat},{sort :{eventId: 1}});
		}
	});
	Template.ConfigEvenementsType.events({
		'click #retour': function(event){
			Router.go('ConfigEvenements');
		},
		'click #addEvenement': function(event){
			//console.log(Template.instance().data);
			Router.go('NouvelEvenement', {_cubesat: Template.instance().data.cubesat});
		},
		'click .evenement': function(event){
			Router.go('EditEvenement', {eventId: $(event.currentTarget).attr('data-eventId')});
		}
	});
	Template.EvenementModal.events({
		'click .carteVisionOk': function(event){
			Modal.hide("EvenementModal");
		}
	});
	Template.Evenement.helpers({
		stars: function(){
			var n = getValeurDeRegle(Session.get("sPartieId"), this.deltaSci);
			var arr = [];
			for(var i=0; i < n; i++) arr.push("S");
			//console.log(arr);
			return arr;
		},
		badstars: function(){
			var n = getValeurDeRegle(Session.get("sPartieId"), this.deltaSci);
			var arr = [];
			for(var i=0; i > n; i--) arr.push("S");
			//console.log(arr);
			return arr;
		},
		isLancementTag: function(){
			return (this.isLancement ? "L" : "");
		},
		hasCarteIds: function(){
			return (this.carteIds.length > 0);
		}
	});
	Template.EvenementPreview.helpers({
		stars: function(){
			var n = getValeurDeRegle(Session.get("sPartieId"), this.deltaSci);
			var arr = [];
			for(var i=0; i < n; i++) arr.push("S");
			//console.log(arr);
			return arr;
		},
		badstars: function(){
			var n = getValeurDeRegle(Session.get("sPartieId"), this.deltaSci);
			var arr = [];
			for(var i=0; i > n; i--) arr.push("S");
			//console.log(arr);
			return arr;
		},
		isLancementTag: function(){
			return (this.isLancement ? "L" : "");
		}
	});
	Template.EvenementPreview.events({
		'click .evenementPreview': function(event){
			//if(!$(event.currentTarget).hasClass("isLast")) {
				//console.log($(event.currentTarget).attr("id"));

				$(event.currentTarget).find("div.evenementIllustration").toggle();
				$(event.currentTarget).find("div.evenementDescription").toggle();
				$(event.currentTarget).find("div.evenementConstantes").toggle();
				$(event.currentTarget).find("div.evenementTps").toggle();
			//}
		}
	});
	Template.EditEvenement.onRendered(function() {
		if($('#isLancement').val('') == "1"){
			$('#carteIds').parent().prev().show();
			$('#carteIds').parent().show();
			$('#tags').parent().show();
		} else {
			$('#carteIds').parent().prev().hide();
			$('#carteIds').parent().hide();
			$('#tags').parent().hide();
		}
	});
	Template.EditEvenement.helpers({
		isChecked: function(valeur){
			if (valeur !== false)  return "checked"; 
		},
		isNChecked: function(valeur){
			if (valeur === false)  return "checked"; 
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
	Template.EditEvenement.events({
		'change #isLancement': function(event, template){
			if($(event.target).val() == "1"){
				$('#carteIds').parent().prev().show();
				$('#carteIds').parent().show();
				$('#tags').parent().show();
			} else {
				$('#carteIds').parent().prev().hide();
				$('#carteIds').parent().hide();
				$('#tags').parent().hide();
			}
		},
		'click #retour': function(event){
			if(Template.instance().data.evenement){
				Router.go('ConfigEvenementsType', {_cubesat: Template.instance().data.carte.cubesat});
			} else {
				Router.go('ConfigEvenementsType', {_cubesat: Template.instance().data.cubesat});
			}	
		},
		'autocompleteselect #tag': function(event, template, doc){
			$('#tag').val(doc.tag);
		},
		'click .remCarteTag' : function(event){
			var tags = "";
			$(event.currentTarget).parent().remove();
			$('div.carteTag').each(function(){
				tags += ","+$(this).attr("id");
			});
			if(tags.length > 0) tags = tags.substring(1);
			$('#tags').val(tags);
		},
		'click #addTag' : function(event){
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
			/*FS.Utility.eachFile(event, function(file){
				//console.log("MERDE" + _carteId);
				var fsFile = new FS.File(file);
				fsFile.owner = Meteor.userId();

				
				//Meteor.call('setImage', fsFile);
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
		'click #delEvenement': function(event, template){
			template.data.securite = $('#securite').is(':checked');
			Modal.show("EvenementSuppression", template.data);
		},
		'click #saveEvenement': function(event){
			$("div.carteParametre").each( function(){ $(this).removeClass('error'); });


			if($('#intitule').val().length == 0){
				$(this).parent().addClass('error');
				throwAlert("error","champs_requis", TAPi18n.__("error.champs_requis_vide"));
				return;
			}
			var verif;
			var oldEvenement;
			
			if(($('#_id').val().length > 0) && (!$('#securite').is(':checked'))) {
				oldEvenement = Evenements.findOne({_id: $('#_id').val()});
				if(Meteor.apply('checkEvenementUtilise', [$('#_id').val()], {returnStubValue: true})){
					throwAlert("error","evenement_utilise", TAPi18n.__("error.evenement_utilise"));
					return;
				}
			}


			var evenement = {
				cubesat: ($('#cubesat').val() === 'true'),
				copyright: $('#copyright').val(),
				intitule:{fr: '', en: ''},
				description:{fr: '', en: ''},
				isLancement: ($('#isLancement').val() === "1"),
				deltaSci: parseInt($('#deltaSci').val()),
				active: ($('#active').val() === "1"),
			};

			if(evenement.isLancement){
				evenement.targetCarteIds = (($('#carteIds').val()).split(","));
				evenement.targetCarteTags = (($('#tags').val()).split(","));
			} else {
				evenement.targetCarteIds = [];
				evenement.targetCarteTags = [];
			}

			if(TAPi18n.getLanguage() == "fr"){
				evenement.intitule.fr = $('#intitule').val();
				evenement.intitule.en = (oldEvenement ? oldEvenement.intitule.en : $('#intitule').val());

				evenement.description.fr = $('#description').val();
				evenement.description.en = (oldEvenement ? oldEvenement.description.en : $('#description').val());
			} else if (TAPi18n.getLanguage() == "en"){
				evenement.intitule.en = $('#intitule').val();
				evenement.intitule.fr = (oldEvenement ? oldEvenement.intitule.fr : $('#intitule').val());

				evenement.description.en = $('#description').val();
				evenement.description.fr = (oldEvenement ? oldEvenement.description.fr : $('#description').val());
			}

			if($('#_id').val().length > 0) {
				evenement._id = $('#_id').val();
				evenement.eventId = $('#eventId').val();
			} 

			if($('#newIllustration').val().length > 0){
				evenement.illustration = $('#newIllustration').val();
			}
			
			if(!isNaN(parseFloat($('#deltaEur').val())) && isFinite($('#deltaEur').val())) {
				evenement.deltaEur = parseFloat($('#deltaEur').val());
			} else {
				evenement.deltaEur = $('#deltaEur').val();
			}
			if(!isNaN(parseFloat($('#deltaNrg').val())) && isFinite($('#deltaNrg').val())) {
				evenement.deltaNrg = parseFloat($('#deltaNrg').val());
			} else {
				evenement.deltaNrg = $('#deltaNrg').val();
			}
			if(!isNaN(parseFloat($('#deltaPds').val())) && isFinite($('#deltaPds').val())) {
				evenement.deltaPds = parseFloat($('#deltaPds').val());
			} else {
				evenement.deltaPds = $('#deltaPds').val();
			}
			if(!isNaN(parseFloat($('#deltaVol').val())) && isFinite($('#deltaVol').val())) {
				evenement.deltaVol = parseFloat($('#deltaVol').val());
			} else {
				evenement.deltaVol = $('#deltaVol').val();
			}
			
			console.log(evenement);

			Meteor.call('setEvenement', evenement,  function(error, result){ if(Meteor.isClient) { Meteor.setTimeout(function(){ Router.go('ConfigEvenementsType', {_cubesat: evenement.cubesat}, 2000); }); }});
		}
	});
	Template.EvenementSuppression.events({
		'click .evenementSuppressionNon': function(event){
			Modal.hide("EvenementSuppression");
		},
		'click .evenementSuppressionOui': function(event){
			var evenement = Template.instance().data.evenement;
			
			if((!Template.instance().data.securite) && Meteor.apply('checkEvenementUtilise', [Template.instance().data.evenement._id], {returnStubValue: true})){
				Modal.hide("EvenementSuppression");
				throwAlert("error","evenement_utilisee", TAPi18n.__("error.evenement_utilise"));
				return;
			} else {
				Meteor.call('removeEvenement', Template.instance().data.evenement, Template.instance().data.securite);
				Router.go('ConfigEvenementsType', {_cubesat: carte.cubesat});
				Modal.hide("EvenementSuppression");
			}
		}
	});
}