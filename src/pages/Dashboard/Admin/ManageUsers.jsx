import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import useAuth from "../../../hooks/useAuth";
import { Helmet } from "react-helmet-async";

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const { user } = useAuth();

  // Fetch all users
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/all-users/${user?.email}`
        );
        return response.data;
      } catch (err) {
        throw new Error("Failed to fetch users");
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // Handle user role update
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      setUpdatingUserId(userId);
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/update-user-role/${userId}`,
        { role: newRole }
      );
    },
    onSuccess: () => {
      toast.success("User role updated successfully!");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      toast.error("Error updating user role. Please try again.");
    },
    onSettled: () => {
      setUpdatingUserId(null);
    },
  });

  const handleRoleUpdate = (userId, newRole) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change this user's role to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateUserRoleMutation.mutate({ userId, newRole });
      }
    });
  };

  // Filter users based on search input
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <div className="text-red-500">Error: {error.message}</div>;
  if (users.length === 0)
    return <div className="text-gray-500 text-center py-4">No users found</div>;

  return (
    <div data-aos="fade-down" className="container mx-auto p-4 max-w-7xl">
      <Helmet>
        <title>Session Sync | Manage Users</title>
      </Helmet>
      <h1 className="text-3xl text-center md:text-start font-bold mt-10 mb-5 text-blue-500">
        Manage Users
      </h1>

      {/* Search Bar */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-2">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 mt-1 block focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-sm shadow-md">
        <table className="w-full">
          <thead className="bg-gradient-to-l from-blue-300 via-white to-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600">
                Avatar
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600">
                Role
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-3 text-sm">
                  <img
                    src={user?.image || "https://via.placeholder.com/40"}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-3 text-sm">{user?.name}</td>
                <td className="px-4 py-3 text-sm">{user?.email}</td>
                <td className="px-4 py-3 text-sm">{user?.role}</td>
                <td className="px-4 py-3 text-sm">
                  <select
                    value={user?.role}
                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                    disabled={updatingUserId === user._id}
                    className="px-2 py-1 border border-gray-300 rounded bg-transparent  dark:text-slate-200 dark:border-slate-500 text-sm"
                  >
                    <option className="dark:text-black" value="Student">
                      Student
                    </option>
                    <option className="dark:text-black" value="Tutor">
                      Tutor
                    </option>
                    <option className="dark:text-black" value="Admin">
                      Admin
                    </option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
