Illustrations = new FS.Collection("illustrations", {
  stores: [new FS.Store.GridFS("illustrations", { transformWrite: function(fileObj, readStream, writeStream){ 
  	
  	gm(readStream, fileObj.name()).size({bufferStream: true}, function(err, size){
		if(!err){
				console.log("width" + size.width);
				console.log("height" + size.height);
				if((size.width > 234) || (size.height > 113)){
					console.log("Fichier trop grand " + fileObj.name());
					
					if((size.width > 234) && (size.height > 113)){
						this.resize('234','113').stream().pipe(writeStream);
					} else if(size.width > 234){
						this.crop('234',size.height).stream().pipe(writeStream);
					} else if (size.height > 113){
						this.crop(size.width,'113').stream().pipe(writeStream);
					}
				} else {
					this.stream().pipe(writeStream);
				}
		} else {
			console.log(err);
		}
	});
	

	/*console.log(fileObj.size());
	gm(readStream, fileObj.name()).resize('234','113').stream().pipe(writeStream);*/
  } })],
  allow:{
  	contentTypes: ['image/*'],
  	extensions: ['png'],
  	onInvalid: function(){
  		if(Meteor.isClient){
  			throwAlert("error","upload_file", TAPi18n.__("error.upload_only_png"));
  		}
  	}
  }
});

Avatars = new FS.Collection("avatars", {
  stores: [new FS.Store.GridFS("avatars")]
});

if(Meteor.isServer){
	Illustrations.allow({
		'insert': function(){
			return true;
		},
		'update': function(){
			return true;
		},
		'remove': function(){
			return true;
		},
		'download': function(){
			return true;
		}
	});
	Avatars.allow({
		'insert': function(){
			return true;
		},
		'update': function(){
			return true;
		},
		'remove': function(){
			return true;
		},
		'download': function(){
			return true;
		}
	});
	Meteor.publish("illustrations", function(){ return Illustrations.find(); });

}

Meteor.methods({
	testGM: function(){
		if(gm.isAvailable){
			console.log("GM OK");
		} else {
			console.log("GM MERDE");
		}
	}
});

var createIllustration = function(fileObj, readStream, writeStream){
	console.log("createIllustration");
	this.gm(fileObj.name()).size(function(err, size){
		if(!err){
				console.log("width" + size.width);
				console.log("height" + size.height);
				if((size.width > 234) || (size.height > 113)){
					if((size.width > 234) && (size.height > 113)){
						gm(readStream, fileObj.name()).resize('234','113').stream().pipe(writeStream);
					} else if(size.width > 234){
						gm(readStream, fileObj.name()).crop('234',size.height).stream().pipe(writeStream);
					} else if (size.height > 113){
						gm(readStream, fileObj.name()).crop(size.width,'113').stream().pipe(writeStream);
					}
				}
		} else {
			console.log(err);
		}
	});
}