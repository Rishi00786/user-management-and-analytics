/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, ChangeEvent, MouseEvent } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, setAllUsers, deleteUser, setLoading } from "../../../redux/Slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

interface User {
  id: string;
  username: string;
  email: string;
  location: string;
  status: boolean;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state: any) => state.users);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showInfoIndex, setShowInfoIndex] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  // Fetch paginated users for display
  const fetchUsers = async () => {
    try {
      dispatch(setLoading(true));
      const url = new URL("https://675724bec0a427baf94be42c.mockapi.io/api/users");
      url.searchParams.append("page", currentPage.toString());
      url.searchParams.append("limit", "5");
      if (searchQuery) {
        url.searchParams.append("username", searchQuery);
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data: User[] = await response.json();
      dispatch(setUsers(data));

      if (data.length < 5) setTotalPages(currentPage);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Fetch all users for analytics
  const fetchAllUsers = async () => {
    try {
      const response = await fetch("https://675724bec0a427baf94be42c.mockapi.io/api/users");
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data: User[] = await response.json();
      dispatch(setAllUsers(data));
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAllUsers();
  }, [currentPage, searchQuery]);

  const handleFilterUsers = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const url = `https://675724bec0a427baf94be42c.mockapi.io/api/users/${id}`;
      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) throw new Error(`Failed to delete user: ${response.status}`);
      dispatch(deleteUser(id));
      console.log(`User with ID ${id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const navigate = useNavigate();
  const handleLogout = () => navigate("/");

  return (
    <div className="flex flex-col items-center justify-start gap-8 w-full min-h-screen bg-slate-200">
      {/* Header */}
      <div className="w-full flex items-center justify-between bg-slate-100 h-auto p-4">
        <div className="text-lg sm:text-2xl md:text-3xl font-bold font-serif">User&apos;s Dashboard</div>
        <button
          onClick={handleLogout}
          className="px-4 md:px-6 py-2 bg-green-600 shadow-lg text-white rounded-xl hover:bg-green-700 transition"
        >
          Logout
        </button>
      </div>

      {/* User Management Section */}
      <div className="w-[90%] md:w-[80%] flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl md:text-4xl font-mono underline text-center md:text-left">Our Users</h1>
        <Link to="/analytics-dashboard">
          <button className="bg-slate-200 px-4 py-2 shadow-xl rounded-lg text-lg md:text-2xl font-serif font-medium">
            Analytics
          </button>
        </Link>
        <div className="flex items-center gap-4 border border-gray-600 rounded-lg w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by username"
            className="p-2 rounded-lg w-full md:w-[300px] text-black"
            onChange={handleFilterUsers}
          />
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          {users.length > 0 ? (
            users.map((user, index) => (
              <div key={user.id} className="relative w-[90%] md:w-[80%]">
                {showInfoIndex === index && showInfo && (
                  <div className="absolute bg-slate-800 text-neutral-100 p-2 shadow-lg rounded-lg text-sm h-auto w-auto -mt-44 md:mt-0  md:mb-24 z-10  md:left-[35vw] lg:left-[45vw]">
                    <div className="font-bold mb-2 underline">User Details</div>
                    <div className="mb-2">
                      <span className="font-medium">Username:</span> {user.username}
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Email:</span> {user.email}
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Country:</span> {user.location}
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Active:</span> {user.status.toString()}
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Created At:</span> {user.createdAt}
                    </div>
                  </div>
                )}
                <div className="flex flex-col md:flex-row items-center justify-between bg-stone-200 rounded-xl shadow-xl p-4 gap-4">
                  <div className="font-semibold font-serif text-lg md:text-xl">{user.username}</div>
                  <div className="flex items-center gap-4">
                    <button
                      className="p-1 cursor-pointer"
                      onClick={() => {
                        setShowInfoIndex(index);
                        setShowInfo(!showInfo);
                      }}
                    >
                      <IoInformationCircleOutline className="text-2xl" />
                    </button>
                    <button
                      className="p-1 cursor-pointer"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <MdDeleteOutline className="text-2xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No users found</div>
          )}
          <div className="flex items-center justify-between w-full md:w-[30%] mt-4 px-4">
            <button
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-gray-700"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <span>
              Page {currentPage} {totalPages > 1 && `of ${totalPages}`}
            </span>
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
