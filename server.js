const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const routes = require("./routes/index");
const cookieParser = require("cookie-parser");
const cors = require('cors');


dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());


const port = process.env.PORT || 4000;
const mongoURI = process.env.mongoURI;

mongoose
	.connect(mongoURI)
	.then((result) => {
		app.use(routes);
		app.listen(port, () => {
			console.log(`Server running at http://localhost:${port}/`);
		});
	})
	.catch((err) => console.log(err));
