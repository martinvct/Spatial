Meteor.startup(function(){
  // If this is the first user going into the database, make them an admin
  if (Meteor.users.find().count() === 0) {
  	Accounts.createUser({username: "admin", email: "vincent.martin@ulg.ac.be", password: "M@str3r", profile: { firstname: "Vincent", lastname:"Martin" }});
  } else if (Meteor.users.find().count() === 1) {
  	Accounts.createUser({username: "u200846", email: "martin_vct@hotmail.com", password: "m@rtin_vct", profile: { firstname: "Raspoutine", lastname:"" }});
  }
});

Accounts.onCreateUser(function(options, user){
	if (Meteor.users.find().count() === 0){
		user.admin = true;
	}

	if (options.profile) user.profile = options.profile;
	return user;
});
//TODO : ajouter lors d'un login d'un user: profile.lastLogin est la date de la dernière connexion !