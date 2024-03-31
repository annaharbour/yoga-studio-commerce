import { useBookClassMutation } from "../../slices/bookingSlice";
import React, { useState } from "react";
import { useLocation, useNavigate, redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const Checkout = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const stripe = useStripe();
	const elements = useElements();
	const [formData, setFormData] = useState({
		fullName: "",
		billingAddress: "",
	});
	const [processingPayment, setProcessingPayment] = useState(false);
	const [bookClass] = useBookClassMutation();


	const { state } = useLocation();
	const { classType, startTime, endTime, price, classId } = state;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!stripe || !elements) {
			return;
		}

		setProcessingPayment(true);

		const cardElement = elements.getElement(CardElement);

		try {
			const { token } = await stripe.createToken(cardElement);

			if (token) {
				const res = await bookClass({
					classId,
					formData,
					token: token.id, // Send the stripe token ID to the server
				}).unwrap();
				dispatch(bookClass({ ...res }));
			} else {
				throw new Error("Error creating token");
			}
		} catch (err) {
			console.log(err.message)
		} finally {
			setProcessingPayment(false);
			navigate('/schedule');
			console.log('success')
		}
	};

	const appearance = {
		style: {
			base: {
				iconColor: "#449084",
				fontWeight: "500",
				fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
				fontSize: "25px",
				fontSmoothing: "never",
				":-webkit-autofill": {
					color: "#69a69d",
				},
				"::placeholder": {
					color: "#449084",
				},
			},
		},
	};

	return (
		<div className="form">
			<h3>
				{classType} from {startTime} - {endTime} for ${price}
			</h3>

			<form onSubmit={handleSubmit}>
				<label>
					Name:
					<input
						type="text"
						name="fullName"
						value={formData.fullName}
						onChange={handleChange}
						required
					/>
				</label>
				<label>
					Billing Address:
					<input
						type="text"
						name="billingAddress"
						value={formData.billingAddress}
						onChange={handleChange}
						required
					/>
				</label>
				<label>
					Card Details:
					<CardElement options={appearance} />
				</label>
				<button className="submit-button" type="submit" disabled={processingPayment}>
					{processingPayment ? "Processing Payment..." : "Pay Now"}
				</button>
			</form>
		</div>
	);
};

export default Checkout;
