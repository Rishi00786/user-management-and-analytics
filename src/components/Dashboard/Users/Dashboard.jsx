/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";

const Dashboard = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showInfoIndex, setShowInfoIndex] = useState(null);
    const [showInfo, setShowInfo] = useState(false);

    const fetchUsers = async () => {
        try {
            const url = new URL("https://675724bec0a427baf94be42c.mockapi.io/api/users");
            url.searchParams.append("page", currentPage);
            url.searchParams.append("limit", 10);
            if (searchQuery) {
                url.searchParams.append("username", searchQuery);
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data);

            if (data.length < 10) {
                setTotalPages(currentPage);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, fetchUsers, searchQuery]);

    const handleFilterUsers = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when filtering
    };

    const handleLogout = () => {
        navigate("/");
    };

    const handleDeleteUser = async (id) => {
        try {
            const url = `https://675724bec0a427baf94be42c.mockapi.io/api/users/${id}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete user: ${response.status}`);
            }

            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            console.log(`User with ID ${id} deleted successfully`);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };


    return (
        <div className="flex flex-col items-center justify-start gap-8 w-[100vw] min-h-[100vh] bg-neutral-700 text-white">
            <div className="w-full flex items-center justify-between bg-slate-700 h-auto p-2">
                <div className="text-3xl font-bold font-serif">User&apos;s Dashboard</div>
                <div className="flex items-center justify-center">
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-green-600 shadow-lg text-white rounded-xl hover:bg-green-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
            <div className="w-[80vw] flex items-center justify-between">
                <h1 className="text-4xl text-white font-mono underline">Our Users</h1>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by username"
                        className="p-2 rounded-lg w-[300px] text-black"
                        onChange={handleFilterUsers}
                    />
                </div>
            </div>
            <div>
                {users.length > 0 && (
                    <div className="flex flex-col items-center justify-center gap-4">
                        {users.map((user, index) => (
                            <div key={index} className="flex flex-col items-center justify-center">
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
                                        <div>
                                            <span className="font-medium">Created At:</span> {user.createdAt}
                                        </div>
                                    </div>
                                )}
                                <div className="w-[80vw] h-auto p-4 flex items-center justify-between bg-neutral-900 rounded-xl shadow-xl">
                                    <div className="font-semibold font-serif text-xl">
                                        {user.username}
                                    </div>
                                    <div className="flex items-center justify-center gap-4">
                                        <div
                                            className="p-1 cursor-pointer"
                                            onClick={() => {
                                                setShowInfoIndex(index);
                                                setShowInfo(!showInfo);
                                            }}
                                        >
                                            <IoInformationCircleOutline className="text-2xl " />
                                        </div>
                                        <div className="p-1 cursor-pointer" onClick={() => handleDeleteUser(user.id)}>
                                            <MdDeleteOutline className="text-2xl cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
                        disabled={users.length < 10}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;