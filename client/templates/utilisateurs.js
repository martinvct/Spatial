if (Meteor.isClient) {

	if (Accounts._resetPasswordToken) {  
  		Session.set('resetPasswordToken', Accounts._resetPasswordToken);
	}

	Template.RecoverPassword.helpers({  
  		resetPassword: function() {
    		return Session.get('resetPasswordToken');
  		}
	});

	Template.ConfigListUtilisateurs.helpers({
		utilisateurs: function(){
			if(Session.get("filtreUtilisateurs")) {
				var pattern = Session.get("filtreUtilisateurs");
				return Meteor.users.find({$or:[{"profile.username": {'$regex': pattern, '$options': 'i'}}, {"profile.firstname": {'$regex': pattern, '$options': 'i'}}, {"profile.lastname": {'$regex': pattern, '$options': 'i'}}, {"profile.email": {'$regex': pattern, '$options': 'i'}}]},{services: 0, sort: {"profile.lastname": 1, "profile.firstname" :1}});
			}
			return Meteor.users.find({},{services: 0, sort: {"profile.lastname": 1, "profile.firstname" :1}});
		}
	});
	Template.ConfigUtilisateurs.helpers({
		filtreUtilisateurs: function(){
			return Session.get("filtreUtilisateurs");
		}
	});
	Template.ConfigUtilisateurs.events({
		'click #addUtilisateur': function(event){
			Router.go('ConfigEditUtilisateur', {_id: 0});
		},
		'click #retour': function(event){
			Router.go('Config');
		},
		'input #filtreUtilisateurs': function(event){
			Session.set("filtreUtilisateurs", $('#filtreUtilisateurs').val());
		},
		'click td.lien': function(event){
			Router.go('ConfigEditUtilisateur', {_id: $(event.currentTarget).attr('data-utilisateurId')});						
		}
	});
	Template.ConfigEditUtilisateur.helpers({
		isChecked: function(valeur){
			if (valeur === true)  return "checked"; 
		}
	});
	Template.ConfigEditUtilisateur.events({
		'click #saveUtilisateur': function(event){
			$("div.utilisateurParametre").each( function(){ $(this).removeClass('error'); });
			if(!$('#username').val()){
				$(this).parent().addClass('error');
				throwError("champs_requis", TAPi18n.__("error.champs_requis_vide"));
				return;
			}
			if(!$('#_id').val()){
				if(!$('#password').val() || ($('#password').val() != $('#passwordConf').val())){
					throwError("champs_requis", TAPi18n.__("error.champs_requis_vide"));
					return;
				}
			}
			var newUser = {
				username: $('#username').val(),
				password: $('#password').val(),
				email: $('#email').val(),
				profile: {
					firstname: $('#firstname').val(),
					lastname: $('#lastname').val(),
					email: $('#email').val(),
					admin: $('#admin').val()
				}
			};

			Accounts.createUser(newUser, function(error){
				if(error){
					console.log(error);
				}

			});
			return false;

		},
		'click #retour': function(event){
			Router.go('ConfigUtilisateurs');
		}
	});

	Template.RecoverPassword.events({  
	  'submit #forgot-password': function(event, template) {
	    var email = template.find('#email');

	    if (email) {
	      Accounts.forgotPassword(email);
	      throwAlert("success","privilege_user", TAPi18n.__("success.reset_password"));
	    } else {
	      throwAlert("error","privilege_user", TAPi18n.__("error.email"));
	    }
	    return false;
	  },
	  'submit #set-new-password': function (event, template) {
	    var password = template.find('#password').value;
	    var passwordConf = template.find('#passwordConf').value;

	    if (password == passwordConf) {
	      Accounts.resetPassword(
	        Session.get('resetPasswordToken'),
	        password,
	        function (error) {
	          if (err) {
	            throwAlert("error","privilege_user", TAPi18n.__("error.password_upd"));
	          } else {
	            Session.set('resetPasswordToken', null);
	            throwAlert("success","privilege_user", TAPi18n.__("success.password_upd"));
	          }
	        });
	    } else {
	      throwAlert("error","privilege_user", TAPi18n.__("error.passwords_diff"));
	    }

	    return false;
	  }
	});
}