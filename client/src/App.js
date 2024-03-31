import "./App.css";
import React from "react";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const stripePromise = loadStripe(
	"pk_test_51NX9SUEiiZIWZaNhAhoBF1kNCwBCTulCOKEKWMrg9gV5KFSmAym807cN9zqT7i5s3KAN0unjAGR7KdhGfHj2TEGa00y53Gl4x6"
);

function App() {
	
	return (
		<div>
			<Nav />
			<Elements stripe={stripePromise}>
				<Outlet />
			</Elements>
			<ToastContainer position="top-right" autoClose={2000} theme="dark" />
			<Footer />
		</div>
	);
}

export default App;
