
if (Meteor.isServer) {
  Meteor.startup(function () {
  });
  Meteor.publish("users", function(){
    return Meteor.users.find();
  });

}

if (Meteor.isClient) {
  Meteor.subscribe("users");
}
