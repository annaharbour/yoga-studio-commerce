const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const YogaClassSchema = new Schema({
	classType: {
		type: String,
		enum: [
			"Power",
			"Nidra",
			"Vinyasa",
			"Hatha",
			"Iyengar",
			"Kundalini",
			"Ashtanga",
			"Bikram",
			"Yin",
			"Workshop",
			"Yoga Teacher Certification",
			"Yoga Retreat"
		],
	},
	start: {
		type: Date,
		required: true,
	},
	end: {
		type: Date,
		required: true,
	},
	price: {
		type: Number,
		default: 20
	},
	location: {
		type: String,
		default: "123 Main Street, Apt 4B, Cityville, State 12345, USA",
	},
	spotsRemaining: {
		type: Number,
	},
	maxCapacity: {
		type: Number,
		default: 20,
	},
	studentsSignedUp: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	customDescription: String,
});

YogaClassSchema.pre("save", function (next) {
	if (!this.spotsRemaining) {
		this.spotsRemaining = this.maxCapacity;
	}
	next();
});

YogaClassSchema.virtual("description").get(function () {
	const descriptions = {
		Power:
			"A dynamic and energetic form of yoga that combines strength, flexibility, and breath control in a flowing sequence.",
		Nidra:
			"Achieve conscious relaxation through guided meditation, leading to deep relaxation and rejuvenation.",
		Vinyasa:
			"Flowing sequences and coordinated breath emphasize the smooth transition between poses, promoting a meditative and dynamic practice.",
		Hatha:
			"A foundational practice that focuses on physical postures (asanas) and breath control, aiming to create balance and alignment in the body and mind.",
		Iyengar:
			"Props and detailed instructions to help practitioners achieve optimal body positioning in each pose.",
		Kundalini:
			"A spiritual and dynamic practice that aims to awaken the dormant energy (kundalini) within, incorporating movement, breathwork, and meditation.",
		Ashtanga:
			"A rigorous and structured practice involving a set series of poses performed in a specific order, combined with breath control, promoting strength, flexibility, and focus.",
		Bikram:
			"Practiced in a heated room, a set sequence of 26 postures and two breathing exercises to enhance flexibility and detoxification.",
		Yin: "A slow-paced style that involves holding passive poses for an extended duration, targeting connective tissues and promoting deep relaxation and flexibility.",
	};

	return this.customDescription || descriptions[this.classType] || "";
});

YogaClassSchema.virtual("classId").get(function () {
	return this._id.toHexString();
  });  

const YogaClass = mongoose.model("YogaClass", YogaClassSchema);

module.exports = YogaClass;
