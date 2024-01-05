const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MembershipSchema = new Schema(
	{
		membershipType: {
			type: String,
			enum: ['annual', 'monthly', 'none'],
			required: true,
			default: 'none'
		},
		description: {
			type: String,
		},
		isPaid: {
			type: Boolean,
		}
	},
	{
		timestamps: true,
	}
);


// MembershipSchema.virtual("membershipType").get(function () {
// 	const price = {
// 		annual: 1200,

// 	};

// 	return this.customDescription || descriptions[this.classSchema] || "";
// });

module.exports = mongoose.model("Membership", MembershipSchema);
