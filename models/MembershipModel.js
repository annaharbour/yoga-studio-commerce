const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MembershipSchema = new Schema(
	{
		membershipType: {
			type: String,
			required: true,
			default: 'none'
		},
		description: {
			type: String,
		},
		billingFreq: {
			type: Number,
			required: true
		},
		price: {
			type: Number,
			required: true
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Membership", MembershipSchema);
