const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");


const protect = asyncHandler(async (req, res, next) => {
	try {
		const token = req.headers.authorization.replace("Bearer ", "");
		// token = req.cookies.jwt;
		const decoded = jwt.verify(token, process.env.JWTSecret);
		req.user = decoded;
		req.user.isAdmin = decoded
		next();
	} catch (err) {
		return res.status(401).json({
			message: "Authentification Failed - No Token",
		});
	}
});

const admin = asyncHandler((req, res, next) => {
	if (req.user && req.user.isAdmin) {
	  next();
	} else {
		console.log(req.user)
		console.log(req.user.isAdmin)
	  res.status(401);
	  throw new Error("Not authorized as admin");	
	}
  });
  

module.exports = { protect, admin };
