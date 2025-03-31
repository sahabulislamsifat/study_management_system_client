import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const CreateNote = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;

    // student info
    const student = {
      studentName: user?.displayName,
      studentEmail: user?.email,
      studentPhoto: user?.photoURL,
    };

    const noteData = { title, description, student };

    // save note in db
    try {
      // post req
      await axios.post(`${import.meta.env.VITE_API_URL}/create-note`, noteData);
      toast.success("Material Upload Successfully!");
      navigate("/dashboard/manage_notes");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div
      data-aos="zoom-in"
      className="max-w-3xl mx-auto mt-20 p-6 dark:bg-slate-900 bg-white shadow-sm rounded"
    >
      <Helmet>
        <title>Session Sync | Create Note</title>
      </Helmet>
      <h1 className="text-3xl md:text-start text-center font-bold text-blue-500 mb-4">
        Create Note
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Email Field (Read-Only) */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block font-semibold dark:text-slate-300 text-gray-600"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={user?.email}
            readOnly
            className="mt-1 block w-full bg-base-300 border-none focus:outline-none dark:bg-slate-300 dark:text-slate-800 rounded-sm"
          />
        </div>

        {/* Title Field */}
        <div className="mb-4">
          <label htmlFor="title" className="block dark:text-slate-300 font-semibold text-gray-600">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Enter note title"
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
          />
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block dark:text-slate-300 font-semibold text-gray-600"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            placeholder="Enter note description"
            rows="4"
            className="focus:outline-none dark:text-black mt-1 dark:bg-slate-300 block w-full bg-base-300 border-none rounded-sm"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
          >
            Save Note
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNote;
