const Membership = require('../models/MembershipModel')
const User = require('../models/UserModel')
const asyncHandler = require("express-async-handler");
  

module.exports.updateMembership = asyncHandler(async (req, res) => {
	const {id} = req.params
	const {membershipType} = req.body

	try {
		let membership = await Membership.findOne({membershipType})

        if(!membership){
            membership = await Membership.create({membershipType, price: 0})
        }

        const user = await User.findByIdAndUpdate(
            id,
            {membership: membership._id},
            {new: true, runValidators: true}
        )

    
        if(!user){
            return res.status(404).json({msg: 'User not found'})
        }
        
        return res.status(200).json({msg: 'Membership updated successfully'})
	} catch(err){
		return res.status(500).json({msg: err.message})
	}

})

module.exports.getMembership = asyncHandler(async (req, res) => {

})