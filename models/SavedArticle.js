const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SavedArticleSchema = new Schema({
	
	title: {
		type: String,
		required: true,
		unique: true
	},
	link: {
		type: String,
		required: true,
		unique: true
	},
	image: {
		type: String,
		unique: true
	},
	note: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
});

const SavedArticle = mongoose.model('Saved Article', SavedArticleSchema);

module.exports = SavedArticle;