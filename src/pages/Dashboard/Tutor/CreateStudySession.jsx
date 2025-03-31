import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const CreateStudySession = () => {
  const { user } = useAuth(); // Get logged-in user data
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the logged-in user is an admin
    if (user?.role === "Admin") {
      setIsAdmin(true);
    }
  }, [user]);

  // Handle form submission
  const onSubmit = async (data) => {
    setIsLoading(true);

    // Add tutor email and name (read-only fields)
    data.tutorEmail = user?.email;
    data.tutorName = user?.displayName;
    // Add admin email and name (read-only fields)
    data.adminEmail = user?.email;
    data.adminName = user?.displayName;
    data.status = "pending"; // Default status
    data.registrationFee = isAdmin ? data.registrationFee : 0; // Only admin can modify the fee

    try {
      // Send data to the server
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-session`,
        data
      );

      if (response.data.insertedId) {
        toast.success("Your study session has been created successfully.");
        reset(); // Reset the form
      }
    } catch (error) {
      toast.error("An error occurred while creating the session.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      data-aos="zoom-in"
      className="max-w-3xl mx-auto p-6 rounded-sm shadow-sm mt-5"
    >
      <Helmet>
        <title>Session Sync | Create Session</title>
      </Helmet>
      <h1 className="text-3xl text-center md:text-start font-bold mt-8 mb-5 text-blue-500">
        Create New Session
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Session Title */}
        <div className="mb-4">
          <label className="block dark:text-slate-300 font-medium mb-2">
            Session Title
          </label>
          <input
            type="text"
            {...register("sessionTitle", { required: true })}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            placeholder="Enter session title"
          />
        </div>

        {/* Tutor Name (Read-only) */}
        <div className="mb-4">
          <label className="block font-medium mb-2 dark:text-slate-300">
            Tutor Name
          </label>
          <input
            type="text"
            value={user?.displayName || ""}
            readOnly
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
          />
        </div>

        {/* Tutor Email (Read-only) */}
        <div className="mb-4">
          <label className="block font-medium mb-2 dark:text-slate-300">
            Tutor Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
          />
        </div>

        {/* Session Description */}
        <div className="mb-4">
          <label className="block font-medium mb-2 dark:text-slate-300">
            Session Description
          </label>
          <textarea
            {...register("sessionDescription", { required: true })}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            rows="4"
            placeholder="Enter session description"
          />
        </div>

        {/* Registration Start Date */}
        <div className="mb-4">
          <label className="block dark:text-slate-300 font-medium mb-2">
            Registration Start Date
          </label>
          <input
            type="date"
            {...register("registrationStartDate", { required: true })}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
          />
        </div>

        {/* Registration End Date */}
        <div className="mb-4">
          <label className="block dark:text-slate-300 font-medium mb-2">
            Registration End Date
          </label>
          <input
            type="date"
            {...register("registrationEndDate", { required: true })}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
          />
        </div>

        {/* Class Start Date */}
        <div className="mb-4">
          <label className="block dark:text-slate-300 font-medium mb-2">
            Class Start Date
          </label>
          <input
            type="date"
            {...register("classStartDate", { required: true })}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
          />
        </div>

        {/* Class End Date */}
        <div className="mb-4">
          <label className="block dark:text-slate-300 font-medium mb-2">
            Class End Date
          </label>
          <input
            type="date"
            {...register("classEndDate", { required: true })}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
          />
        </div>

        {/* Session Duration */}
        <div className="mb-4">
          <label className="block dark:text-slate-300 font-medium mb-2">
            Session Duration
          </label>
          <input
            type="text"
            {...register("sessionDuration", { required: true })}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            placeholder="Enter session duration"
          />
        </div>

        {/* Registration Fee */}
        <div className="mb-4">
          <label className="block dark:text-slate-300 font-medium mb-2">
            Registration Fee
          </label>
          <input
            type="number"
            {...register("registrationFee")}
            defaultValue={0} // Default value set to 0
            readOnly={!isAdmin} // Only admin can edit
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            placeholder="Enter session fee"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {isLoading ? "Creating Session..." : "Create Session"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStudySession;
