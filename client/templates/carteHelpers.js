if (Meteor.isClient) {
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
		'click .carte': function(event){
			Router.go('EditCarte', {carteId: $(event.currentTarget).attr('data-carteId')});
		}
	});

	Template.Carte.helpers({
		isDeck: function(){
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
			return (this.carte.categorie == 'Z');
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
		'autocompleteselect #tag': function(event, template, doc){
			console.log("resultats tag");
			console.log(doc);
			$('#tag').val(doc.tag);
		}
	});
}