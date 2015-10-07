Meteor.startup(function(){
  // If this is the first user going into the database, make them an admin
  if (Meteor.users.find().count() === 0) {
  	Accounts.createUser({username: "admin", email: "vincent.martin@ulg.ac.be", password: "M@str3r", profile: { name: "Vincent Martin" }});
  }
});

Accounts.onCreateUser(function(options, user){
	if (Meteor.users.find().count() === 0){
		options.profile.firstname = "Vincent";
		options.profile.lastname  = "Martin";
		user.admin = true;
	}
	if (options.profile) user.profile = options.profile;
	return user;
});