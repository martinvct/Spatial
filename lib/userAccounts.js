

Meteor.methods({
  setUserAccount: function(userAccount, passwordConf, isBatch){
    var user = Meteor.user();
    if (!(user && (user.profile.admin || (user._id == userAccount._id)))) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
    var checkUser = Meteor.users.findOne({username: userAccount.username});
    if(userAccount._id.length == 0){
        if(checkUser != null){
          return throwAlert("error","champs_requis", TAPi18n.__("error.username_existe"));
        }
        if((userAccount.password.length == 0) || ((!isBatch) && (userAccount.password != passwordConf))) {
          return throwAlert("error","champs_requis", TAPi18n.__("error.passwords_diff"));
        } else  {
          if(Meteor.isServer){
            Accounts.createUser(userAccount, function(error){
              if(error){
                return throwAlert("error","champs_requis", error);
              }
            });
          }
        }
      } else {
        if((checkUser != null) && (checkUser._id != userAccount._id)){
          return throwAlert("error","champs_requis", TAPi18n.__("error.username_existe"));
        } else {
          if(Meteor.isServer){
            Meteor.users.update({_id: userAccount._id},{$set:{"username": userAccount.username, "profile.username": userAccount.username, "profile.firstname": userAccount.firstname, "profile.lastname": userAccount.lastname, "profile.admin": userAccount.admin, "profile.email": userAccount.email, "email": userAccount.email}});
            if(userAccount.password.length > 0) {
              if (userAccount.password != passwordConf){
                return throwAlert("error","champs_requis", TAPi18n.__("error.passwords_diff",{},"fr"));
              } 
              Accounts.setPassword(userAccount._id, userAccount.password);
            } 
          }
          return throwAlert("success","edit_user", TAPi18n.__("success.utilisateur_sauve", userAccount.username));
        }
      }
  },
  importUtilisateurs: function(batchUtilisateurs){
    var user = Meteor.user();
    if (!(user && user.profile.admin)) { return throwAlert("error","privilege_user", TAPi18n.__("error.privilege_user")); }
    var lignes = batchUtilisateurs.split("\n");
    var result = [];
    for(var l=0; l < lignes.length; l++){
      var fields = lignes[l].split(/[,|\t|;]+/);
      if(fields.length != 5){
        result.push({status: "ERREUR", ligne: (l+1), message: TAPi18n.__("error.batch_utilisateur_nbrChamps")});
        continue;
      }
      var checkUser = Meteor.users.findOne({$or:[{username: fields[0]},{"profile.email": fields[3]}]});
      if(checkUser != null){
        result.push({status: "ERREUR", ligne: (l+1), message: TAPi18n.__("error.batch_username_existe")});
        continue;
      } else {
        if((fields[0].length == 0)||(fields[1].length == 0)||(fields[2].length == 0)||(fields[3].length == 0)||(fields[4].length == 0)) {
          result.push({status: "ERREUR", ligne: (l+1), message: TAPi18n.__("error.batch_utilisateur_champsVides")});
          continue;
        } else  {
          var userAccount = {
            username: fields[0],
            password: fields[4],
            email: fields[3],
            profile: {
              firstname: fields[2],
              lastname: fields[1],
              email: fields[3],
              admin: false
            }
          };
          if(Meteor.isServer) Accounts.createUser(userAccount);
          result.push({status: "OK", ligne: (l+1), message: TAPi18n.__("success.batch_utilisateur_ajoute")});

           //console.log(TAPi18n.__("courriel.inscription.message", {username: fields[0], password: fields[4], firstname: fields[2], lastname: fields[1], link: LinkRoot},"fr"));
          
          if(Meteor.isServer) Meteor.call("sendEmail", fields[3], "default", TAPi18n.__("courriel.inscription.sujet",{},"fr"), TAPi18n.__("courriel.inscription.message", {username: fields[0], password: fields[4], firstname: fields[2], lastname: fields[1], link: LinkRoot},"fr"));
          
        }
      }
    }


    return result;
  }
});
if(Meteor.isClient){
  LDAP_DEFAULTS = {};
  LDAP_DEFAULTS.base = 'ou=people, dc=ulg, dc=ac, dc=be';
  LDAP_DEFAULTS.search = '(uid={{username}})';
  LDAP_DEFAULTS.dn = 'uid={{username}}, ou=people, dc=ulg, dc=ac, dc=be';
}

