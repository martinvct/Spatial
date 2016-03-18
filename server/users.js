Meteor.startup(function(){

  /* Accounts.config({
    forbidClientAccountCreation: true
  });*/
  process.env.MAIL_URL = 'smtp://smtp.ulg.ac.be';
  process.env.MAIL_EXP = 'vincent.martin@ulg.ac.be';
 // process.env.PATH     = 'C:\\Program Files (x86)\\GraphicsMagick-1.3.23-Q16';
 /* var sep = /^win/.test(process.platform) ? ';' : ':';
  console.log(process.env['PATH'].split(/:|;/));
  console.log(process.env['PATH'].split(sep));*/
  // If this is the first user going into the database, make them an admin
  if (Meteor.users.find().count() === 0) {
  	Accounts.createUser({username: "admin", password: "M@st3r", admin: true, profile: { username: "admin", firstname: "Jean", lastname:"Martin", email: "vincent.martin@ulg.ac.be", admin: true }});
  }

  if(!gm.isAvailable) {
    console.log("PAS de GM");
  }
  Meteor.call("testGM");
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

Meteor.methods({
  sendEmail: function(to, from, subject, text){
    check([to, from, subject, text], [String]);
    this.unblock();
    if (from == "default") from = "vincent.martin@ulg.ac.be";
    console.log('senEmail');
    console.log(text);
    console.log(from);
    console.log(to);
    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  }
});

//LDAP_DEFAULTS = {};
LDAP_DEFAULTS.url= 'ldap://ldap.ulg.ac.be'; 
LDAP_DEFAULTS.port= '389'; 
//LDAP_DEFAULTS.dn= 'uid'; 
LDAP_DEFAULTS.createNewUser= true; 
//LDAP_DEFAULTS.defaultDomain= false; 
LDAP_DEFAULTS.searchResultsProfileMap= [{resultKey:'uid', profileProperty:'username'}, {resultKey:'mail', profileProperty:'email'}, {resultKey:'givenName', profileProperty:'firstname'}, {resultKey:'sn', profileProperty:'lastname'}]; 
LDAP_DEFAULTS.base= 'ou=people, dc=ulg, dc=ac, dc=be'; 
