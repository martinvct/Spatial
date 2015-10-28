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

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}