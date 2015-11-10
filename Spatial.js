getUserLanguage = function () {
  // Put here the logic for determining the user language
  return "fr";
};

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
   // var last = Meteor.users.aggregate([{$group:{_id:null, maxU:{$max: "$username"}}}]);
    //  last.forEach(function(m){ console.log(m.maxU); });

    Meteor.call("initTest");
  });
  
  Meteor.publish("users", function(){
    return Meteor.users.find();
  });
  Meteor.publish("testmet", function(){
    return Test.find();
  });
}

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  Meteor.subscribe("users");
  Meteor.subscribe("testmet");
  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    },
    teste: function(){
      
      var nbr = -1;
      var str = '{"$or":[{"username":"admin"}, {"username":"u200846"}]}';
      try {
        var con  = JSON.parse(str);
        nbr = Meteor.users.find(con).count();
      } catch(e){
        console.error(TAPi18n.__("error.syntaxe_carte_regles", "T1"), e);
      } 
      if(nbr > -1) return "OK";
      return "ERREUR";
    },
    chatte: function(){
      //Meteor.call("loadChat");
      return Meteor.apply("loadChat", [], {returnStubValue: true});
    },
    nchat: function(){
      return Meteor.apply("countChat", [], {returnStubValue: true});
    }

  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
     // var condition = "{username:\"admin\", admin: true}";
     // var carteTest = {"carteId": "T1", "nom": "Carte Test"};
     // Meteor.call("throwNotification","CARTE-NEW", "*", {carte: carteTest});
     //Meteor.call("updChat");
     Meteor.call("testCheck", function(error, result){
      if(error) sAlert.error(error.reason);
     });
    }
  });

  Template.loginWithLDAP.events({
    'click button': function (event, template) {
     
        Meteor.loginWithLDAP(template.find('#login').value, template.find('#password').value, { dn: "uid=" + template.find('#login').value + ",ou=people,dc=ulg,dc=ac,dc=be" }, function(err){
          if(err){
            if(! Meteor.userId()){
              Meteor.loginWithPassword(template.find('#login').value, template.find('#password').value,  function(err) { if (err) console.log(err.reason); });
           }
          }
        });
      
      
    }
  });

  Template.userConnected.events({
    'click button': function (event, template) {
      Meteor.logout();   

    }
  });
}
