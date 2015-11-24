ListActions = [
	"CARTE-ACTIVE",
	"CARTE-DEL", 
	"CARTE-NEW", 
	"CARTE-UPD",
	"DECK-ADD",
	"DECK-REM",
	"EVENT-ACTIVE",
	"EVENT-DEL", 
	"EVENT-NEW",
	"EVENT-PUT", 
	"EVENT-UPD",
	"EXPERT-CALL",
	"EXPERT-NOCALL-BUDGET",
	"EXPERT-NOMORECALL",
	"PARTIE-DEL",
	"PEER-CALL",
	"PEER-NOCALL-BUDGET",
	"PEER-NOMORECALL",
	"PEER-STILLCALL",
	"PEER-TOOLATE",
	"SCENAR-NEW",
	"SCENAR-UPD",
	"USER-CALL",
	"USER-MSG",
	"USER-NOCALL-BUDGET"
];
ListTokens = [
];
ListTagsObligatoires = { //les tags commencent par le nom de la catégorie!
	global: [
		"lanceur",
		"orbite",
		"structure",
		"controle_thermique_passif",
		"communications_antenne",
		"communications_gestion",
		"commandes_memoire",
		"commandes_calculateur",
		"energie_generateur",
		"energie_gestion",
		"attitude_gestion"
	],
	espace:[
		"instrument_telescope",
		"instrument_espace"
	],
	distance: {
		"0": [],
		"1": ["orbite_hohmann", "propulsion_interplanetaire"], //Vénus ou Mars
		"2": ["orbite_hohmann", "propulsion_interplanetaire"], //Mercure ou Jupiter
		"3": ["orbite_hohmann", "propulsion_interplanetaire", "energie_generateur_thermo"], //Saturne
		"4": ["orbite_hohmann", "propulsion_interplanetaire", "energie_generateur_thermo"], //Uranus
		"5": ["orbite_hohmann", "propulsion_interplanetaire", "energie_generateur_thermo"], //Neptune
		"10": ["orbite_hohmann", "propulsion_interplanetaire", "energie_generateur_thermo"] //+ loin que Neptune
	},
	atterisseur:[
		"segment_atterrisseur",
		"atterisseur_plateforme",
		"atterisseur_frein"
	]
};

function contains(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

convertir = function(valeur, unite){
	var nombre = ''+valeur;
	var retour = '';
	var count=0;
	for(var i=nombre.length-1 ; i>=0 ; i--){
		if(count!=0 && count % 3 == 0){
			retour = nombre[i]+' '+retour ;
		} else {
			retour = nombre[i]+retour ;
		}
		count++;
	}
	return retour;
}

throwError = function(error, reason, details){
	var meteorError = new Meteor.Error(error, reason, details);
	if(Meteor.isClient){
		sAlert.error(meteorError.reason);
		return meteorError;
	} else if (Meteor.isServer){
		throw meteorError;
	}
}

Meteor.users.deny({
  update: function() {
    return true;
  }
});