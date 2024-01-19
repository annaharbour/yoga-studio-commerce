import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./store";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Plans from "./components/memberships/Plans";
import Retreats from './components/schedule/Retreats'
import Classes from "./components/schedule/Classes";
import Profile from './components/auth/Profile'

const router = (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<App />}>
				<Route index={true} path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/memberships" element={<Plans />} />
				<Route path="/retreats" element={<Retreats />} />
				<Route path="/schedule" element={<Classes />} />
				<Route path="/account" element={<Profile />} />


			</Route>
		</Routes>
	</BrowserRouter>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<HelmetProvider>
			<Provider store={store}>
				{router}
			</Provider>
		</HelmetProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
