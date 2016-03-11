LinkRoot = "https://gaming.ifres.ulg.ac.be";
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
		{tag: "segmentSol", categorie: "S"},
		{tag: "structure", categorie: "Z"}
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
	atterrisseurAtmosphere: [
		{tag: "atterrisseurParachute", categorie: "J"},
		{tag: "atterrisseurBouclier", categorie: "J"}
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

initTimer = function(partieId){
	if(Meteor.isClient){
		if(!partieId) return;
		if((Session.get('sPartieId')) && (Session.get('sPartieId') != partieId)){
			saveTimer(partieId);
		}
		Session.set('sPartieId', partieId);
		Session.set('sCountTimer', 0);
		Session.set('intervalTimer', Meteor.setInterval(incTimer, 1000));
		//console.log('initTimer ' + partieId);
	}
}

incTimer = function(){
	if(Meteor.isClient) {
		Session.set("sCountTimer", Session.get("sCountTimer") + 1);
	}
}

saveTimer = function(partieId){
	if(Meteor.isClient){
		if(Session.get('sPartieId')){
			if(Session.get('sPartieId') != partieId){
				//sauvegarder time
				Meteor.call("updateTpsPartie", Session.get('sPartieId'), Session.get('sCountTimer'), function(error, result){ closeTimer(); });
				//console.log("save timer:" + Session.get('sCountTimer')+ " partieId:" + Session.get('sPartieId'));
				if(partieId){
					Session.set('sPartieId', partieId);
					Session.set('intervalTimer', Meteor.setInterval(incTimer, 1000));
				}	
			} else {
				Meteor.call("updateTpsPartie", Session.get('sPartieId'), Session.get('sCountTimer'), function(error, result){ Session.set('sCountTimer', 0); });
				//console.log("save same timer:" + Session.get('sCountTimer')+ " partieId:" + Session.get('sPartieId'));
			}
		}
	}
}

closeTimer = function(){
	if(Meteor.isClient){
		if(Session.get("intervalTimer")) Meteor.clearInterval(Session.get("intervalTimer"));
		Session.set("countTimer", 0);
		delete Session.keys["intervalTimer"];
		delete Session.keys["sPartieId"];
		//console.log("close timer ");
	}
}

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


nbrOcc = function(chaine, car){
	var result = 0;
	for(var c=0; c < chaine.length; c++){
		if(chaine[c] == car) result++;
	}
	//console.log("NBROCC DEBUG "+ car + " : " + result);
	return result;
}

getValeurDeRegle = function(_partieId, valeurStr){
	if(!isNaN(parseFloat(valeurStr)) && isFinite(valeurStr)) {
		return valeurStr;
	} else {
		if(!_partieId) return 0;
		var valeur = 0;
		try{
			if(valeurStr.length > 0){
  				for(var r=0; r < valeurStr.length; r++){
  					//console.log(valeurStr[r].condition);
  					var cond  = JSON.parse(valeurStr[r].condition);
  					//console.log("condition evaluee");
					cond._id  = _partieId;
					if(Parties.find(cond).count() == 1){
						valeur = valeurStr[r].valeur;
					}
				}
			}
		} catch(e) {
			console.error(TAPi18n.__("error.database_request", "getValeurDeRegle") , e);
		}
		return valeur;
	}	
}

/*Conversion syntaxique des règles nécessites et incompatibilités
opérateur booléen : + (AND), / (OR)
termes : String (CarteId), "String" (Tag), {"String" opc val, "val"} (condition sur autre chose de cartid et tag)
Opérateur de comparaison (opc) : <, <=, >=, > suivi de val   , = ,!= val ou "val"
nG : position du curseur dans la condition globale
strict : impose l'existence des carteId au préalable (=> ne pas l'appeler avec strict si import de nouvelles cartes !)*/

interprete = function(condition, nG, strict){
	var n = 0;
	var op = "";
	var termes = []; //liste des CarteId et des Tags
	var expressions = []; //liste des expressions mongodb
	var result = {
		erreur : "", //message d'erreur
		erreurPos : 0, //position de l'erreur,
		hasExpression : false,
		mongo: "" //conversion de la condition en mongodb
	};
	var pos = 0;
	var isFirst = true;
	var lastItem = "";
	

	do {
		if(n >= condition.length) break; 
		if (condition[n] == ")"){
			result.erreurPos = nG + n;
			result.erreur    = "Erreur de parenthèse fermée excédentaire";
			break;
		}
		else if (condition[n] == "}"){
			result.erreurPos = nG + n;
			result.erreur    = "Erreur d'accolade fermée excédentaire";
			break;
		}
		else if (condition[n] == "("){
			var no = 1;
			var nf = 0;
			pos = n;
			do {
				pos = condition.indexOf(")", pos+1);
				//console.log("INTERPRETE DEBUG 11 b " + pos);
				if(pos == -1) break;
				no = nbrOcc(condition.substring(n, pos+1),'(');
				nf = nbrOcc(condition.substring(n, pos+1),')');
			} while((pos > -1) && ((pos+1) < condition.length) && (no != nf))
			if(pos == -1){
				result.erreurPos = nG + n;
				result.erreur    = "Erreur de parenthèse non fermée";
				break;
			}
			var resultRecc = interprete(condition.substring(n+1, pos), n+1, strict);
			if(resultRecc.erreurPos > 0){
				return resultRecc;
			}
			if(resultRecc.hasExpression){
				expressions.push(resultRecc.mongo);
				result.hasExpression = true;
			} else {
				termes.push(resultRecc.mongo);
			}
			lastItem = "terme";
			isFirst  = false;
			n = pos+1;
		} 
		else if (condition[n] == "{"){
			var no = 1;
			var nf = 0;
			pos    = n;
			//console.log("INTERPRETE DEBUG 10");
			do {
				//console.log("INTERPRETE DEBUG 11 a " + pos);
				pos = condition.indexOf("}", pos+1);
				//console.log("INTERPRETE DEBUG 11 b " + pos);
				if(pos == -1) break;
				no = nbrOcc(condition.substring(n, pos+1),'{');
				nf = nbrOcc(condition.substring(n, pos+1),'}');
			} while((pos > -1) && ((pos+1) < condition.length) && (no != nf))
			
			if(pos == -1){
				result.erreurPos = nG + n;
				result.erreur    = "Erreur d'accolade non fermée";
				break;
			}			
			try{
				var cond = JSON.parse(condition.substring(n, pos+1));
				Cartes.find(cond).count();
				result.hasExpression = true;
				expressions.push(condition.substring(n, pos+1));
			} catch (e) {
				result.erreurPos = nG + n;
				result.erreur    = "Erreur de syntaxe JSON";
				break;
			}
			lastItem = "terme";
			isFirst  = false;
			n = pos+1;
		}
		else if (condition[n] == " ") {
			//console.log("INTERPRETE DEBUG 15");
			n = n+1;
		}
		else if (condition[n] == '"'){
			pos = condition.indexOf('"', n+1);
			if(pos == -1){
				result.erreurPos = nG + n;
				result.erreur    = "Erreur d'accolade non fermée";
				break;
			}
			if((!isFirst) && (lastItem != "op")){
				result.erreurPos = nG + n;
				result.erreur    = "Il manque un opérateur avant le tag \"" + condition.substring(n, pos) + "\"";
				break;
			}
			if(((pos+1) < condition.length) && (condition[pos+1] == "§")){
				termes.push('{"tags": "' + condition.substring(n+1, pos) + '", "active": true, "nStructure": §nS}');
				n = pos+2;
			} else {
				termes.push('{"tags": "' + condition.substring(n+1, pos) + '", "active": true}');
				n = pos+1;
			}
			
			lastItem = "terme";
			isFirst  = false;
			
		}
		else if ((condition[n] == '+') || (condition[n] == '/')){
			//console.log("INTERPRETE DEBUG 20");
			if((op != "") && (op != condition[n])) {
				result.erreurPos = nG + n;
				result.erreur    = "Deux opérateurs booléens différents dans une même parenthèse";
				break;
			} 
			if(lastItem == "op"){
				result.erreurPos = nG + n;
				result.erreur    = "Erreur d'opérateur excédentaire";
				break;
			}
			if(lastItem == ""){
				result.erreurPos = nG + n;
				result.erreur    = "Il manque un terme avant l'opérateur";
				break;
			}
			lastItem = "op";
			op       = condition[n];
			n        = n+1;
			//console.log("INTERPRETE DEBUG 28");
		} else {
			var carteId = "";
			var code = 0;
			do {
				carteId = carteId + condition[n];
				n = n+1;
				if (n < condition.length) code = condition.charCodeAt(n);
				//console.log("INTERPRETE DEBUG 29 carteId char " + condition[n] + " code " + condition.charCodeAt(n));
			} while ((n < condition.length) && ((( code > 64 ) && ( code < 91 )) || (( code > 96 ) && ( code < 123 )) || (( code > 47 ) && ( code < 58 ))))

			//console.log("INTERPRETE DEBUG 30 carteId:" + carteId + "(" + carteId.length + ")");
			if((strict) && (!Cartes.findOne({carteId: carteId}))) {
				result.erreurPos = nG + (n - partieId.length);
				result.erreur    = "CarteId inexistante";
				break;
			}
			//console.log("INTERPRETE DEBUG 31");
			if((!isFirst) && (lastItem != "op")){
				result.erreurPos = nG + n;
				result.erreur    = "Il manque un opérateur avant la carteId \"" + carteId + "\"";
				break;
			}
			//console.log("INTERPRETE DEBUG 32");
			if((n < condition.length) && (condition[n] == "§")){
				termes.push('{"carteId": "' + carteId + '", "active": true, "nStructure": §nS}');
				n = n+1;
			} else {
				termes.push('{"carteId": "' + carteId + '", "active": true}');
			}
			lastItem = "terme";
			isFirst  = false;
		}
	} while(n < condition.length);
	//console.log("INTERPRETE DEBUG 40");
	if ((nG == 0) && (termes.length > 0)){
		//console.log("INTERPRETE DEBUG 40a");
		if(result.hasExpression){
			if(op != ""){
				result.mongo =  '{"$' + (op == "+" ? "and" : "or") +  '": [';
			} 
		} 
		//*-*-* result.mongo += '{"deck.cartes": {"$elemMatch": ';
	} else if ((nG > 0) && (termes.length > 0) && (result.hasExpression)) {
		//console.log("INTERPRETE DEBUG 40b");
		if(op != ""){
			result.mongo =  '{"$' + (op == "+" ? "and" : "or") +  '": [';
		} 
		//*-* result.mongo = '{"deck.cartes": {"$elemMatch": ';
	} 
	//console.log("INTERPRETE DEBUG 41 " + result.mongo);
	if(op != ""){
		result.mongo +=  '{"$' + (op == "+" ? "and" : "or") +  '": [';
	}
	//console.log("INTERPRETE DEBUG 42 " + result.mongo);
	for(var t=0; t < termes.length; t++){
		result.mongo += '{"deck.cartes": {"$elemMatch":' + termes[t] + "}}, ";
	}
	if(termes.length > 0) {
		result.mongo = result.mongo.substring(0, (result.mongo.length - 2));
		//console.log("INTERPRETE DEBUG 43 " + result.mongo);
	 	if(expressions.length > 0){

	 		if(op != ""){
				result.mongo += ']}';
			} 
			result.mongo += '}}, ';
		}
	}	
	//console.log("INTERPRETE DEBUG 44 " + result.mongo);
	for(var e=0; e < expressions.length; e++){
		result.mongo += expressions[e] + ", ";
	}
	if(expressions.length > 0) result.mongo = result.mongo.substring(0, (result.mongo.length - 2));

	//console.log("INTERPRETE DEBUG 45 " + result.mongo);
	if(op != ""){
		result.mongo += ']}';
	}
	//console.log("INTERPRETE DEBUG 46 " + result.mongo);
	if ((nG == 0) && (termes.length > 0) && (!result.hasExpression)){
		//*-*-* result.mongo += '}}';
	} else if ((nG > 0) && (termes.length > 0) && (result.hasExpression)) {
		//*-* result.mongo += '}}';
		if(op != ""){
			result.mongo +=  ']}';
		}		
	} 
	//console.log("INTERPRETE DEBUG 47 " + result.mongo);
	return result;
}

isObjectID = Match.Where(function (id) {
    check(id, String);
    return /[0-9a-fA-F]{24}/.test(id);
});

Meteor.users.deny({
  update: function(userId, doc) {
  	var u = Meteor.users.findOne({_id: userId},{admin: 1});
/*  	console.log("droits : " + userId);
  	console.log(u);
  	console.log("docs..");
  	console.log(doc);*/
  	//return _.all(docs, function(doc) {
        // Can only change your own documents
       // console.log("check :" + u.admin + " u:" + userId + " d:" + doc._id);
        if ((!u.admin) && (userId !== doc._id)) {
            return true;
        }
        return false;
    //});
  }
});

/**
 * Get the parent template instance
 * @param {Number} [levels] How many levels to go up. Default is 1
 * @returns {Blaze.TemplateInstance}
 */

Blaze.TemplateInstance.prototype.parentTemplate = function (levels) {
    var view = Blaze.currentView;
    if (typeof levels === "undefined") {
        levels = 1;
    }
    while (view) {
        if (view.name.substring(0, 9) === "Template." && !(levels--)) {
            return view.templateInstance();
        }
        view = view.parentView;
    }
};