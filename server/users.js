Meteor.startup(function(){

  Accounts.config({
    forbidClientAccountCreation: true
  });


  // If this is the first user going into the database, make them an admin
  if (Meteor.users.find().count() === 0) {
  	Accounts.createUser({username: "admin", password: "M@st3r", profile: { username: "admin", firstname: "Jean", lastname:"Martin", email: "vincent.martin@ulg.ac.be", admin: true }});
  }
});

Accounts.onCreateUser(function(options, user){
	if (options.profile) user.profile = options.profile;
  user.profile.pattern = user.username+" "+user.profile.firstname+" "+user.profile.lastname;
	return user;
});

Accounts.validateNewUser(function(user){

  return true;
});

Meteor.publish("getMyProfile", function(){
  if(this.userId){
    return Meteor.users.find({_id: this.userId},{fields: {username:1, profile:1}});
  } else {
    this.ready();
  }
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