
ListTokens = [
];
ListTagsObligatoires = { 
	cubesat:[
		{tag: "communicationsTelecom", categorie: "C"},
		{tag: "attitudeMesure", categorie: "A"},
		{tag: "commandesProcesseur", categorie: "M"},
		{tag: "commandesMemoire", categorie: "M"}
	],
	cubesat1U:[
		{tag: "lanceur1U", categorie: "L"},
		{tag: "structure1U", categorie: "Z"},
		{tag: "energie1U", categorie: "E"}
	],
	cubesat3U:[
		{tag: "lanceur3U", categorie: "L"},
		{tag: "structure3U", categorie: "Z"},
		{tag: "energie3U", categorie: "E"}
	],
	global: [
		{tag: "lanceur", categorie: "L"},
		{tag: "orbite", categorie: "O"},
		{tag: "structure", categorie: "Z"},
		{tag: "thermiquePassif", categorie: "C"},
		{tag: "communicationsAntenne", categorie: "C"},
		{tag: "communicationsGestion", categorie: "C"},
		{tag: "commandesMemoire", categorie: "M"},
		{tag: "commandesCalculateur", categorie: "M"},
		{tag: "energieGenerateur", categorie: "E"},
		{tag: "energieGestion", categorie: "E"},
		{tag: "attitudeGestion", categorie: "A"}
	],
	espace:[
		{tag: "instrumentTelescope", categorie: "I"},
		{tag: "instrumentScan", categorie: "I"}
	],
	distance: {
		"0": [],
		"1": [{tag: "orbiteHohmann", categorie: "O"}, {tag: "propulsionInterplanetaire", categorie: "P"}], //Vénus ou Mars
		"2": [{tag: "orbiteHohmann", categorie: "O"}, {tag: "propulsionInterplanetaire", categorie: "P"}], //Mercure ou Jupiter
		"3": [{tag: "orbiteHohmann", categorie: "O"}, {tag: "propulsionInterplanetaire", categorie: "P"}, {tag: "energieThermo", categorie: "E"}], //Saturne
		"4": [{tag: "orbiteHohmann", categorie: "O"}, {tag: "propulsionInterplanetaire", categorie: "P"}, {tag: "energieThermo", categorie: "E"}], //Uranus
		"5": [{tag: "orbiteHohmann", categorie: "O"}, {tag: "propulsionInterplanetaire", categorie: "P"}, {tag: "energieThermo", categorie: "E"}], //Neptune
		"10": [{tag: "orbiteHohmann", categorie: "O"}, {tag: "propulsionInterplanetaire", categorie: "P"}, {tag: "energieThermo", categorie: "E"}] //+ loin que Neptune
	},
	atterisseur:[
		{tag: "segmentSolAtterrisseur", categorie: "S"},
		{tag: "atterrisseurPlateforme", categorie: "J"},
		{tag: "atterrisseurFrein", categorie: "J"}
	]
};
ListCategories = {
	"A" : "attitude",
	"C" : "communication",
	"E" : "energie",
	"I" : "instrument",
	"J" : "atterrisseur",
	"L" : "lanceur",
	"M" : "centre de commandes",
	"O" : "orbite",
	"P" : "propulsion",
	"S" : "segment sol",
	"T" : "controle thermique",
	"Z" : "structure"
};

contains = function(arr, obj) {
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

isObjectID = Match.Where(function (id) {
    check(id, String);
    return /[0-9a-fA-F]{24}/.test(id);
});

Meteor.users.deny({
  update: function() {
    return true;
  }
});