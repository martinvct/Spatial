if (Meteor.isClient) {
	Template.Partie.onCreated(function(){
		this.templateDictionary = new ReactiveDict();
		this.templateDictionary.set('currentPartie', this.data.partieId);
		this.templateDictionary.set('currentScenario', this.data.scenarioId);
		this.templateDictionary.set('currentTemplate', 'partieTest');

	});
	Template.Partie.helpers({
		multi100: function(percent){
			if(percent > 0)	return 100 * percent;
			return 10;
		},
		convertir: function(valeur, unite){
			return convertir(valeur, unite);
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
			return { partie: Parties.findOne({_id: Template.instance().templateDictionary.get('currentPartie')}), scenario: Scenarios.findOne({_id: Template.instance().templateDictionary.get('currentScenario')}) };
		},
		scenario: function(){
			return Scenarios.findOne({_id: Template.instance().templateDictionary.get('currentScenario')});
		},
		partie: function(){
			return Parties.findOne({_id: Template.instance().templateDictionary.get('currentPartie')});
		}
	});
	Template.Partie.events({
		'click #partieScenario': function(event){
			Template.instance().templateDictionary.set('currentTemplate', 'partieEssai');
		}
	});
}