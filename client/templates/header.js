

if (Meteor.isClient) {
	Template.Header.events({
		'click button.buttonAvatar': function (event, template) {
			Blaze.render(Template.MenuProfile, document.getElementById('main'));
		},
		'click button.buttonHome': function(event, template) {
			Router.go('Home');
		}
	});
	Template.Header.onRendered(function() {
		
	});
}