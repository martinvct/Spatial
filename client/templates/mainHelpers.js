if (Meteor.isClient) {
	Template.registerHelper('compare', function(v1, v2) {
  		if (typeof v1 === 'object' && typeof v2 === 'object') {
    		return _.isEqual(v1, v2); // do a object comparison
  		} else {
    		return v1 === v2;
  		}
	});
	Template.registerHelper('concat', function(prefix, fieldName){
		return TAPi18n.__(prefix + fieldName);
	});
	Template.registerHelper('i18nMongo', function(chaine){
		if(chaine.length == 0) return "";
		return chaine[TAPi18n.getLanguage()];
	});
	Template.Header.onRendered(function() {
		
	});
	Template.registerHelper('formatDate', function(valeur, format){
		return moment(valeur).format(format);
	});
	Template.registerHelper('signeValeurRegle', function(valeur){
		if(valeur > 0) return "+";
	});
	Template.registerHelper('formatValeurRegle', function(valeur, unite, isCarte){
		valeur = Math.floor(valeur*100)/100;
		if(unite == "pds"){
			if(Math.abs(valeur) < 1000){
				return valeur + " <span class='valUnite'>g"+"</span>";
			} 
			if(Math.abs(valeur) < 1000000){
				if(Math.floor(valeur / 1000) != (valeur / 1000)) {
					if(isCarte) return (valeur / 1000)+ " <span class='valUnite'>kg</span>";
					return Math.floor(valeur / 1000)+ " <span class='valUnite'>kg</span>";
				}
				return (valeur / 1000)+ " <span class='valUnite'>kg</span>";
			}
			if(Math.floor(valeur / 1000000) != (valeur / 1000000)){
				if(isCarte) return (valeur / 1000000)+ " <span class='valUnite'>T</span>";
				return Math.floor(valeur / 1000000)+ " <span class='valUnite'>T</span>";
			} 
			return (valeur / 1000000)+ " <span class='valUnite'>T</span>";
		}
		if(unite == "vol"){
			if(Math.abs(valeur) < 1000){
				return valeur + " <span class='valUnite'>mm</span>";
			} 
			if(Math.abs(valeur) < 1000000){
				if(Math.floor(valeur / 1000) != (valeur / 1000)){
					if(isCarte) return (valeur / 1000)+ " <span class='valUnite'>m"+"</span>";
					return Math.floor(valeur / 1000)+ " <span class='valUnite'>m"+"</span>";
				} 
				return (valeur / 1000)+ " <span class='valUnite'>"+"</span>";
			}
			if(Math.floor(valeur / 1000000) != (valeur / 1000000)){
				if(isCarte) return (valeur / 1000000)+ " <span class='valUnite'>km"+"</span>";
				return Math.floor(valeur / 1000000)+ " <span class='valUnite'>km"+"</span>";
			} 
			return (valeur / 1000000)+ " <span class='valUnite'>"+"</span>";
		}
		switch(unite){
			case "eur": unite = ""; break;
			case "nrg": unite = "W"; break;
			case "sci": unite = ""; break;
		}
		if(Math.abs(valeur) < 1000){
			return valeur + " <span class='valUnite'>"+unite+"</span>";
		} 
		if(Math.abs(valeur) < 1000000){
			if(Math.floor(valeur / 1000) != (valeur / 1000)){
				if(isCarte) return (valeur / 1000)+ " <span class='valUnite'>k"+unite+"</span>";
				return Math.floor(valeur / 1000)+ " <span class='valUnite'>k"+unite+"</span>";
			} 
			return (valeur / 1000)+ " <span class='valUnite'>k"+unite+"</span>";
		}
		if(Math.floor(valeur / 1000000) != (valeur / 1000000)){
			if(isCarte) return (valeur / 1000000)+ " <span class='valUnite'>M"+unite+"</span>";
			return Math.floor(valeur / 1000000)+ " <span class='valUnite'>M"+unite+"</span>";
		} 
		return (valeur / 1000000)+ " <span class='valUnite'>M"+unite+"</span>";
	});

	Template.registerHelper('formatValeurTemps', function(valeur, unite, isCarte){
		valeur = Math.floor(valeur*100)/100;
		if(unite == "tps"){
			if(Math.abs(valeur) < 60){
				return valeur + "<span class='valUnite'>s</span>";
			} 
			if(Math.abs(valeur) < 3600){
				return Math.floor(valeur / 60) + "<span class='valUnite'>m</span>" + Math.floor(valeur % 60);
			}
			var restValeur = Math.floor(valeur % 3600);
			return Math.floor(valeur / 3600) + "<span class='valUnite'>h</span>" + Math.floor(restValeur / 60) + "<span class='valUnite'>m</span>" + Math.floor(restValeur % 60);
		}
	});

	Template.Header.helpers({
		nNotifications: function(){
			//console.log(Meteor.user());
			return Meteor.user().profile.nNotifications;
		},
		currentPartie: function(){

			return ((Template.instance().data) && (Template.instance().data.partieId));
		},
		nomPartie: function(){
			return Parties.findOne({_id: Template.instance().data.partieId},{nom: 1});
		}
	});
	Template.Header.events({
		'click button.buttonAvatar': function (event, template) {
			//Blaze.render(Template.MenuProfile, document.getElementById('main'));
			Modal.show("MenuProfile");
		},
		'click #logoApplication': function(){
			Router.go('Home');
		},
		'click #buttonNotifications': function(event, template){
			//console.log("ntoification menu");
			//Blaze.render(Template.NotificationsMenu, document.getElementById('backgroundModal'));
			Meteor.call('updateNNotifications');
			Modal.show("NotificationsMenu");
		}
	});
	Template.MenuProfile.events({
		'click button.menuProfileLogout': function(event, template){
			if((Session.get('sPartieId')) && (Session.get('sCountTimer') > 0)){
				//sauvegarder time
				saveTimer();

			}
			Meteor.logout();
		}
	});
	Template.Login.events({
	    'click button.loginWithLDAP': function (event, template) {
	       //console.log("Tentative de login...");
	       //console.log("username: "+ template.find('#login').value);
	       //console.log("password: "+ template.find('#password').value);
	        
	        try {
	        	LDAP_DEFAULTS.dn = LDAP_DEFAULTS.dn.replace("{{username}}", template.find('#login').value);
	        	LDAP_DEFAULTS.search = LDAP_DEFAULTS.search.replace("{{username}}", template.find('#login').value);
	        	Meteor.loginWithLDAP(template.find('#login').value, template.find('#password').value, LDAP_DEFAULTS, function(err, result){
		          if(err){
		          	//console.log("WithLDAP Erreur");
		          	//console.log(err);
		            if(! Meteor.userId()){
		              //console.log("Tentative de login interne...");	
		              try {
			              Meteor.loginWithPassword(template.find('#login').value, template.find('#password').value,  function(erreur) { 
			              	if (erreur) { 
			              		//console.log("login interne erreur"); 
			              		return throwAlert("error","login_echoue",  TAPi18n.__("error.login_echoue"));
			              	}
			              	else {
				              	var currUser = Meteor.user();
				           	  	var now      = new Date();
				           	  	Meteor.users.update({_id: currUser._id},{$set: {"profile.lastlogin": now}});
				           	}
			              });
			          } catch(ex){

		    		  }    
		            }
		           } else {
		           	  var currUser = Meteor.user();
		           	  var now      = new Date();
		           	  Meteor.users.update({_id: currUser._id},{$set: {"profile.lastlogin": now}});
		           }
		        });
		    } catch(e){
		    	console.log(e.message);
		    }  
	    },
	    'click button.loginWithFaceBook': function(event){ //voir : http://bulenttastan.net/login-with-facebook-using-meteor-js/
	    	Meteor.loginWithFacebook({}, function(err){
	            if (err) {
	                throwError("login_echoue", TAPi18n.__("error.login_echoue")); 
	            } else {
	           	  var currUser = Meteor.user();
	           	  var now      = new Date();
	           	  Meteor.users.update({_id: currUser._id},{$set: {"profile.lastlogin": now}});
	           }
	        });
	    },
	    'keypress #password': function(event, template){
	    	if(event.which === 13){
	    		$('button.loginWithLDAP').click();
	    	}
	    }
	});
	Template.MenuPrincipal.onCreated(function(){
		saveTimer();
	});
	Template.MenuPrincipal.helpers({
		counttimer: function(){ return Session.get('sCountTimer'); },
		partieid: function(){ return Session.get('sPartieId'); }
	});
	Template.MenuPrincipal.events({
		'click #configuration': function(event){
			Router.go('Config');
		},
		'click #nouvellePartie': function(event){
			Router.go('NouvellePartie');
		},
		'click #chargerPartie': function(event){
			Router.go('Parties');
		},
		'click #meilleursScores': function(event){
			Router.go('Scores');
		}
	});
	Template.Scores.helpers({
		scores: function(){
			var parties = Parties.find({finie: true, active: true},{"deck.cartes": 0, logs: 0, peers: 0, chat: 0, experts: 0, sort: {score: -1}, limit: 20}); //.sort({score: -1}).limit(20);
			var scores = [];
			for(var p=0; p < parties.length; p++){
				var scenario = Scenarios.findOne({_id: parties[p].scenarioId },{services: 0});
				var user     = Meteor.users.findOne({_id: parties[p].userId});
				scores.push({user: user, partie: {score: parties[p].score, science: parties[p].deck.science, tempsTotal: parties[p].tempsTotal}, scenario: {_id: scenario._id, intitule: scenario.intitule, budget: scenario.initialisation.budget, cubesat: scenario.initialisation.cubesat }});
			}
			return scores;
		}
	});
	Template.Scores.events({
		'click #retour': function(event){
			Router.go('Home');
		}
	});
	Template.Config.events({
		'click #listeScenarios': function(event){
			Router.go('ConfigScenarios');
		},
		'click #listeEvenements': function(event){
			Router.go('ConfigEvenements');
		},
		'click #listeUtilisateurs': function(event){
			Router.go('ConfigUtilisateurs');
		},
		'click #retour': function(event){
			Router.go('Home');
		}
	});
}