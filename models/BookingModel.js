const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		bookings: [
			{
				classId: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: "YogaClass",
				},
				name: {
					type: String,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
			},
		],
		userAddress: {
			address: { type: String, required: true },
			city: { type: String, required: true },
			state: { type: String, required: true },
			postalCode: { type: String, required: true },
			country: { type: String, required: true },
		},
		paymentMethod: {
			type: String,
			required: true,
		},
		taxPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		totalPrice: {
			type: Number,
			required: true,
			default: 0.0,
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Booking", BookingSchema);
