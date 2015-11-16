if (Meteor.isClient) {
	Template.Login.events({
    'click button.loginWithLDAP': function (event, template) {
        Meteor.loginWithLDAP(template.find('#login').value, template.find('#password').value, { dn: "uid=" + template.find('#login').value + ",ou=people,dc=ulg,dc=ac,dc=be" }, function(err){
          if(err){
            if(! Meteor.userId()){
              Meteor.loginWithPassword(template.find('#login').value, template.find('#password').value,  function(err) { if (err) return throwError("login_echoue", TAPi18n.__("error.login_echoue")); });
           }
          }
        });
    },
    'click button.loginWithFaceBook': function(event){ //voir : http://bulenttastan.net/login-with-facebook-using-meteor-js/
    	Meteor.loginWithFacebook({}, function(err){
            if (err) {
                throwError("login_echoue", TAPi18n.__("error.login_echoue")); 
            }
        });
    },
    'keypress #password': function(event, template){
    	if(event.which === 13){
    		$('button.loginWithLDAP').click();
    	}
    }
  });
}