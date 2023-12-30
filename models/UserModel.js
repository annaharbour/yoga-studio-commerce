const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		userId: {
			type: String,
		},
		firstName: {
			type: String,
			required: true,
			maxLength: 20,
		},
		lastName: {
			type: String,
			required: true,
			maxLength: 20,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			maxLength: 30,
			minLength: 3,
		},
		phoneNr: {
			type: String,
			required: true,
			unique: true,
			match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
		},
		password: {
			type: String,
			required: true,
		},
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        }
	},
	{
		timestamps: true,
	}
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

module.exports = mongoose.model("User", UserSchema);
