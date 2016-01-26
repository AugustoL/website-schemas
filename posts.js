module.exports = function(db,mongoose) {
	
	var post = new mongoose.Schema({
		titleEs : String,
		titleEn : String,
		categories : [String], // travel,music,bitcoin,linux,programing,other,games,movies,series
		img : String,
		date : Date,
		draft : Boolean,
		bodyEs : String,
		bodyEn : String,
		comments : [{
			id : mongoose.Types.ObjectId,
			name : String,
			text : String,
			date : Date,
			ip : String
		}]
	});
	post.methods.create = function(){
		this.titleEs = "";
		this.titleEn = "";
		this.img = "";
		this.date = new Date();
		this.categories = [];
		this.draft = true;
		this.bodyEs = "";
		this.bodyEn = "";
		this.comments = [];
	};
	post.methods.addComment = function(_name, _text, _ip){
		if (!this.comments)
			this.comments = [];
		this.comments.push({
			id : new mongoose.Types.ObjectId(),
			name : _name,
			text : _text,
			date : new Date(),
			ip : _ip
		});
	};
	post.methods.edit = function(titleEs,titleEn,img,categories,bodyEs,bodyEn){
		this.titleEs = titleEs;
		this.titleEn = titleEn;
		this.bodyEs = bodyEs
		this.bodyEn = bodyEn;
		this.img = img;
		var self = this;
		console.log(categories);
		if (self.draft)
			this.categories = categories;
 		else if (categories&&(categories.length > 0)&&(self.categories != categories)){
            var index = 0;
            self.categories.forEach( function(catInPost) {
                isThere = false;
                categories.forEach( function(newCat) {
                    if (newCat == catInPost)
                        isThere = true;
                });
                if (!isThere){
                    self.categories.splice(index, 1);
                    db.categories.findOne({"name" : catInPost }, {}, function (err, cat) {
                        if (err){
                            callback(err);
                        } else {    
                            cat.quantity = cat.quantity - 1;
                            cat.save();
                        }
                    });
                }
                index ++;
            });
            categories.forEach( function(newCat) {
                isThere = false;
                if (self.categories.length > 0)
	                self.categories.forEach( function(catInPost) {
	                    if (newCat == catInPost)
	                        isThere = true;
	                });
                if (!isThere){
                    self.categories.push(newCat);
                    db.categories.findOne({"name" : newCat }, {}, function (err, cat) {
                        if (err){
                            callback(err);
                        } else {         
                            cat.quantity = cat.quantity + 1;
                            cat.save();
                        }
                    });
                }
            });
        }
	};

	db.posts = db.model('posts', post);

};
