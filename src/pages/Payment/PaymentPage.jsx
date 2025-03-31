import { useLocation, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Helmet } from "react-helmet-async";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId, tutorEmail, registrationFee, sessionTitle } =
    location.state;

  return (
    <div
      data-aos="zoom-out"
      className="container mx-auto p-6 pt-32 min-h-screen max-w-3xl"
    >
      <Helmet>
        <title>Session Sync | Payment</title>
      </Helmet>
      <h1 className="text-3xl text-center md:text-start  font-bold text-blue-600 my-10">
        Payment Page
      </h1>

      {/* Session Details */}
      <div className="mb-8">
        <h2 className="text-xl dark:text-slate-300 font-semibold text-gray-700 mb-4">
          Session Details
        </h2>
        <p className="text-gray-600 dark:text-slate-300">
          <span className="font-semibold">Session ID:</span> {sessionId}
        </p>
        <p className="text-gray-600 dark:text-slate-300">
          <span className="font-semibold">Tutor Email:</span> {tutorEmail}
        </p>
        <p className="text-gray-600 dark:text-slate-300">
          <span className="font-semibold">Registration Fee:</span> $
          {registrationFee}
        </p>
      </div>

      {/* Stripe Elements */}
      <Elements stripe={stripePromise}>
        <CheckoutForm
          sessionId={sessionId}
          sessionTitle={sessionTitle}
          tutorEmail={tutorEmail}
          registrationFee={registrationFee}
          onSuccess={() =>
            navigate("/payment_confirmation", {
              state: {
                sessionId,
                tutorEmail,
                registrationFee,
              },
            })
          }
        />
      </Elements>
    </div>
  );
};

export default PaymentPage;
