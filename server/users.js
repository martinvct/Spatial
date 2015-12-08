Meteor.startup(function(){




  // If this is the first user going into the database, make them an admin
  if (Meteor.users.find().count() === 0) {
  	Accounts.createUser({username: "admin", email: "vincent.martin@ulg.ac.be", password: "M@str3r", profile: { firstname: "Vincent", lastname:"Martin" }});
  }

  Accounts.config({
    forbidClientAccountCreation: true
  });


});

Accounts.onCreateUser(function(options, user){
	if (Meteor.users.find().count() === 0){
		user.admin = true;
	}

	if (options.profile) user.profile = options.profile;
  user.profile.pattern = user.username+" "+user.profile.firstname+" "+user.profile.lastname;
	return user;
});

Meteor.publish("getUsers", function(){
  if(this.userId){
    return Meteor.users.find({},{fields: {username:1, profile:1}});
  } else {
    this.ready();
  }
});

LDAP_DEFAULTS.url= 'ldap://ldap.ulg.ac.be'; 
LDAP_DEFAULTS.port= '389'; 
//LDAP_DEFAULTS.dn= 'uid'; 
LDAP_DEFAULTS.createNewUser= true; 
LDAP_DEFAULTS.defaultDomain= false; 
LDAP_DEFAULTS.searchResultsProfileMap= [{resultKey:'uid', profileProperty:'username'}, {resultKey:'mail', profileProperty:'email'}, {resultKey:'givenName', profileProperty:'firstname'}, {resultKey:'sn', profileProperty:'lastname'}]; 
LDAP_DEFAULTS.base= 'ou=people,dc=ulg,dc=ac,dc=be'; 
LDAP_DEFAULTS.search= '(objectclass=*)';
 

//TODO : ajouter lors d'un login d'un user: profile.lastLogin est la date de la dernière connexion !