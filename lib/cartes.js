Cartes = new Mongo.Collection('cartes');



Meteor.methods({
  setCarte: function(carte){
  	var user = Meteor.userId;
  	if (!(user && user.admin)) { throw new Meteor.Error(TAPi18n.__("error.not-authorized")); }
  	
  	CheckRegles = Match.Where(function(rules){
  		check(rules, Match.Optional(String));
  		if((rules == null) || (rules == "")) return true;
  		// vérification du format de regle

  		return true;
  	});

  	check(carte, {
  		carteId: String,
  		nom: String,
  		description: Match.Optional(String),
  		tip: Match.Optional(String),
  		regles: CheckRegles,
  		illustrations: {big:  Match.Optional(String), normal: Match.Optional(String), small: Match.Optional(String) },
  		tags: Match.Optional([String]),
  		caracteristiques: [{nom:  Match.Optional(String), valeur:  Match.Optional(Number), unite:  Match.Optional(String)}],
  		version: Match.Optional([String])
  	});

  	// recherche de version si non spéficiée

	Cartes.upsert({carteId: carte.carteId, version: carte.version}, carte, confirmSetCarte);
  	


  }


});



function confirmSetCarte(result){ // avec call back, les appels à bd sont ininterrompus que faire du callback ?
	//result.numberAffected et result.insertedId si insertion
}