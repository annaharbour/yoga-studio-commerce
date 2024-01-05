const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MembershipSchema = new Schema(
	{
		title: {
			type: String,
			enum: ['annual', 'monthly', 'none'],
			required: true,
			default: 'none'
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		billFreq: {
			type: String,
			enum: ['already-paid', 'annually-billed', 'monthly-billed']
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Membership", MembershipSchema);
