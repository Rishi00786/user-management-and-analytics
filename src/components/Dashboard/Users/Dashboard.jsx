/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, setAllUsers, deleteUser, setLoading } from "../../../redux/Slices/userSlice.ts";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.users);

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showInfoIndex, setShowInfoIndex] = useState(null);
    const [showInfo, setShowInfo] = useState(false);

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
            const data = await response.json();
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
            const data = await response.json();
            dispatch(setAllUsers(data));
        } catch (error) {
            console.error("Error fetching all users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchAllUsers();
    }, [currentPage, searchQuery]);

    const handleFilterUsers = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleDeleteUser = async (id) => {
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
        <div className="flex flex-col items-center justify-start gap-8 w-[100vw] min-h-[100vh] bg-slate-200">
            {/* Header */}
            <div className="w-full flex items-center justify-between bg-slate-100 h-auto p-2">
                <div className="text-3xl font-bold font-serif">User&apos;s Dashboard</div>
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-green-600 shadow-lg text-white rounded-xl hover:bg-green-700 transition"
                >
                    Logout
                </button>
            </div>

            {/* User Management Section */}
            <div className="w-[80vw] flex items-center justify-between">
                <h1 className="text-4xl font-mono underline">Our Users</h1>
                <Link to="/analytics-dashboard">
                    <button className="bg-slate-200 p-3 shadow-xl rounded-lg text-2xl font-serif font-medium">
                        Analytics
                    </button>
                </Link>
                <div className="flex items-center gap-4 border border-gray-600 rounded-lg">
                    <input
                        type="text"
                        placeholder="Search by username"
                        className="p-2 rounded-lg w-[300px] text-black"
                        onChange={handleFilterUsers}
                    />
                </div>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className="flex flex-col items-center justify-center gap-4">
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <div key={user.id} className="flex flex-col items-center">
                                    {showInfoIndex === index && showInfo && (
                                        <div className="absolute bg-slate-800 text-neutral-100 p-2 shadow-lg rounded-lg text-sm h-auto w-[370px] mb-24 z-10 left-[55vw]">
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
                                    <div className="w-[80vw] h-auto p-4 flex items-center justify-between bg-stone-200 rounded-xl shadow-xl">
                                        <div className="font-semibold font-serif text-xl">{user.username}</div>
                                        <div className="flex items-center justify-center gap-4">
                                            <div
                                                className="p-1 cursor-pointer"
                                                onClick={() => {
                                                    setShowInfoIndex(index);
                                                    setShowInfo(!showInfo);
                                                }}
                                            >
                                                <IoInformationCircleOutline className="text-2xl" />
                                            </div>
                                            <div
                                                className="p-1 cursor-pointer"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                <MdDeleteOutline className="text-2xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>No users found</div>
                        )}
                        <div className="flex items-center justify-between w-[30vw] mt-4">
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
                </>
            )}
        </div>
    );
};

export default Dashboard;
