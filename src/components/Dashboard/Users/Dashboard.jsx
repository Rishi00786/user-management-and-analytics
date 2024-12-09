import { useEffect, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";


const Dashboard = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(
                    "https://675724bec0a427baf94be42c.mockapi.io/api/users"
                );
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchUsers();
    }, [])

    const handleLogout = () => {
        navigate("/");
    };

    const [showInfoIndex, setShowInfoIndex] = useState(null);
    const [showInfo, setShowInfo] = useState(false);

    const handleFilterUsers = (e) => {
        const searchValue = e.target.value.toLowerCase();

        if (searchValue === "") {
            setFilteredUsers(users); // Reset to full list
        } else {
            const filtered = users.filter(
                (user) =>
                    user.username.toLowerCase().includes(searchValue) ||
                    user.email.toLowerCase().includes(searchValue)
            );
            setFilteredUsers(filtered);
        }
    }

    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    // const handleDeleteUser = async (id) => {
    //     try {
    //         const response = await fetch(
    //             `https://675724bec0a427baf94be42c.mockapi.io/api/users/${id}`,
    //             {
    //                 method: 'DELETE',
    //             }
    //         );

    //         if (response.ok) {
    //             setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    //             setFilteredUsers((prevFiltered) =>
    //                 prevFiltered.filter((user) => user.id !== id)
    //             );
    //         } else {
    //             console.error("Failed to delete user");
    //         }
    //     } catch (error) {
    //         console.error("Error deleting user:", error);
    //     }
    // };



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
                        placeholder="Search by username or email"
                        className="p-2 rounded-lg w-[300px] text-black"
                        onChange={handleFilterUsers}
                    />
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={() => {
                            console.log("Final value logged!");
                        }}
                    >
                        Search
                    </button>
                </div>

            </div>
            <div>
                {users.length > 0 && (
                    <div className="flex flex-col items-center justify-center gap-4">
                        {filteredUsers.map((user, index) => (
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
                                            <span className="font-medium">Created At:</span> {(user.createdAt)}
                                        </div>
                                    </div>
                                )}
                                <div className="w-[80vw] h-auto p-4 flex items-center justify-between bg-neutral-900 rounded-xl shadow-xl">
                                    <div className="font-semibold font-serif text-xl">
                                        {user.username}
                                    </div>
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="p-1 cursor-pointer"
                                            onClick={() => { setShowInfoIndex(index); setShowInfo(!showInfo) }}
                                        >
                                            <IoInformationCircleOutline className="text-2xl " />
                                        </div>
                                        <div className="p-1 cursor-pointer" 
                                        // onClick={handleDeleteUser(user.id)}
                                        >
                                            <MdDeleteOutline className="text-2xl cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;