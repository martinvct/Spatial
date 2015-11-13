

if (Meteor.isClient) {
	Template.header.events({
		'click button.buttonAvatar': function (event, template) {
			Blaze.render(Template.menuProfile, document.getElementById('main'));
		}
	});
	Template.header.onRendered(function() {
		
	});
}