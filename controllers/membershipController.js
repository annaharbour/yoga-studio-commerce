const Membership = require('../models/MembershipModel')
const User = require('../models/UserModel')
const asyncHandler = require("express-async-handler");
  

module.exports.updateMembership = asyncHandler(async (req, res) => {
	const {userId} = req.params
	const {membershipType} = req.body

	try {
		let membership = await Membership.findOne({membershipType})

        if(!membership){
            membership = await Membership.create({membershipType, price: 0})
        }

        const user = await User.findByIdAndUpdate(
            userId,
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

module.exports.getMembers = asyncHandler(async (req, res) => {
    try {
        const members = await User.find({ membership: { $exists: true } }).populate('membership');
        return res.status(200).json({ members });
      } catch (error) {
        return res.status(500).json({ msg: error.message });
      }
});
