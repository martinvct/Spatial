if (Meteor.isClient) {
	Template.ConfigUtilisateurs.helpers({
		utilisateurs: function(){
			return Meteor.users.find({});
			//return allUsersData();
		}
	});
}