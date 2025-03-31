import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const ApproveModal = ({ session, onClose, onApprove }) => {
  const [isPaid, setIsPaid] = useState(false);
  const [amount, setAmount] = useState("");

  const handleApprove = () => {
    if (isPaid) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount)) {
        alert("Please enter a valid amount.");
        return;
      }
      if (parsedAmount <= 0) {
        alert("Amount must be greater than 0.");
        return;
      }
    }
    onApprove({
      sessionId: session._id,
      isPaid,
      amount: isPaid ? parseFloat(amount) : 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
      <div className="dark:bg-gray-900 rounded w-1/3 bg-gray-400 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl md:text-2xl dark:text-slate-300 font-semibold text-gray-800">
            Approve Session
          </h3>
          <button onClick={onClose} className="text-gray-600">
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label
            htmlFor="sessionTitle"
            className="block dark:text-slate-300 font-medium text-gray-700"
          >
            Session Title
          </label>
          <input
            id="sessionTitle"
            type="text"
            value={session.sessionTitle}
            disabled
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="sessionDescription"
            className="block dark:text-slate-300 font-medium text-gray-700"
          >
            Session Description
          </label>
          <textarea
            id="sessionDescription"
            rows="4"
            value={session.sessionDescription}
            disabled
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="isPaid"
            className="inline-flex items-center dark:text-slate-300"
          >
            <input
              type="checkbox"
              id="isPaid"
              checked={isPaid}
              onChange={() => setIsPaid(!isPaid)}
              className="mr-2"
            />
            Mark as Paid
          </label>
        </div>

        {isPaid && (
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium dark:text-slate-300 text-gray-700"
            >
              Amount Paid
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveModal;
