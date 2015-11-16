

if (Meteor.isClient) {
	Template.Header.events({
		'click button.buttonAvatar': function (event, template) {
			Blaze.render(Template.MenuProfile, document.getElementById('main'));
		}
	});
	Template.Header.onRendered(function() {
		
	});
}