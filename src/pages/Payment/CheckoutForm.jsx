import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const CheckoutForm = ({
  sessionId,
  sessionTitle,
  registrationFee,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return toast.error("Stripe.js has not loaded yet.");
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return toast.error("Card Element not found.");
    }

    setIsProcessing(true);

    try {
      // Step 1: Create PaymentIntent
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-payment-intent`,
        {
          amount: registrationFee,
          sessionId,
        }
      );

      // console.log("PaymentIntent created:", data);

      // Step 2: Confirm Payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card,
            billing_details: {
              name: user?.displayName || "User",
              email: user?.email,
            },
          },
        }
      );

      // console.log("Payment confirmation result:", { paymentIntent, error });

      if (error) {
        setIsProcessing(false);
        toast.error(`Payment failed: ${error.message}`);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Step 3: Book Session
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/confirm-payment`,
          {
            sessionId,
            sessionTitle, // Ensure this is passed
            studentEmail: user?.email,
            registrationFee, // Ensure this is passed
            transactionId: paymentIntent.id,
          }
        );

        // console.log("Session booking response:", response.data);

        if (response.data.success) {
          toast.success("Payment successful! Session booked.");
          onSuccess(); // Redirect or show success message
        } else {
          toast.error(response.data.message || "Failed to book session.");
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while processing your payment."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#9e2146" },
          },
        }}
      />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
