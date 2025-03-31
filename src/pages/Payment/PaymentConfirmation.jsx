import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const PaymentConfirmation = () => {
  const location = useLocation();

  useEffect(() => {
    // console.log("Received State:", location.state);
  }, [location.state]);

  const sessionId = location.state?.sessionId || "N/A";
  const tutorEmail = location.state?.tutorEmail || "N/A";
  const registrationFee = location.state?.registrationFee || 0;

  return (
    <div className="container mx-auto p-6 pt-32 min-h-screen max-w-3xl">
      <Helmet>
        <title>Session Sync | Payment Confirmation</title>
      </Helmet>
      <h1 className="text-3xl text-center md:text-start  font-bold text-blue-600 my-10">
        Payment Confirmation
      </h1>
      <div>
        <h2 className="text-xl dark:text-slate-300 font-semibold text-gray-700 mb-4">
          Payment Details
        </h2>
        <p className="text-gray-600 dark:text-slate-300">
          <span className="font-semibold">Session ID:</span> {sessionId}
        </p>
        <p className="text-gray-600 dark:text-slate-300">
          <span className="font-semibold">Tutor Email:</span> {tutorEmail}
        </p>
        <p className="text-gray-600 dark:text-slate-300">
          <span className="font-semibold">Amount Paid:</span> ${registrationFee}
        </p>
        <p className="text-green-500 font-semibold mt-4">
          Your payment was successful! Thank you for booking the session.
        </p>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
