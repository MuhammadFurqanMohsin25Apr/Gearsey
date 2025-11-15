import React, { useEffect, useState } from "react";
import { Search, Filter, Users as UsersIcon } from "lucide-react";
import { authClient } from "~/lib/auth-client";

export default function Users() {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch users from Better Auth
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const allUsersData = await authClient.admin.listUsers({
          query: {},
        });

        if (allUsersData && allUsersData.data && allUsersData.data.users) {
          const formattedUsers = allUsersData.data.users.map((u: any) => ({
            id: u.id,
            name: u.name || "Unknown",
            email: u.email,
            role: u.role || "user",
            joinDate: u.createdAt
              ? new Date(u.createdAt).toISOString().split("T")[0]
              : "N/A",
            verified: u.emailVerified ? "Verified" : "Pending",
          }));
          setAllUsers(formattedUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await authClient.admin.removeUser({ userId });
        setAllUsers(allUsers.filter((u) => u.id !== userId));
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">User Management</h3>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all registered users in the marketplace
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Role
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Join Date
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {allUsers
                .filter(
                  (u) =>
                    searchQuery === "" ||
                    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {user.name ? user.name[0].toUpperCase() : "U"}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || "Unknown User"}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-flex px-3 py-1 text-xs rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {user.role || "User"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {user.joinDate}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                          View
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 hover:underline transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {allUsers.filter(
          (u) =>
            searchQuery === "" ||
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        ).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <UsersIcon className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No users found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
