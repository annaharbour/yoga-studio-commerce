const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		cart: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: "Product",
				},
				name: {
					type: String,
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
				image: {
					type: String,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
			},
		],
		shippingAddress: {
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
		shippingPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		totalPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
          },
          paidDate: {
            type: Date,
          },
          isDelivered: {
            type: Boolean,
            required: true,
            default: false,
          },
          deliveredDate: {
            type: Date,
          },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Order", OrderSchema);
