if (Meteor.isClient) {
  Template.MenuProfile.events({
  	'click button.menuProfileLogout': function (event, template) {
  	 	Blaze.remove(Blaze.getView($("ul.menuProfile").get(0)));
  	 	Meteor.logout();   
  	},
  	'click button.close': function(event, template){
  		Blaze.remove(Blaze.getView($("ul.menuProfile").get(0)));
  	}
  });
}