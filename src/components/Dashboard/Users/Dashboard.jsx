import { useEffect, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";


const Dashboard = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([])

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
            <div className="">
                <h1 className="text-4xl text-white font-mono underline">Our Users</h1>
            </div>
            <div>
                {users.length > 0 && (
                    <div className="flex flex-col items-center justify-center gap-4">
                        {users.map((user , index) => (
                            <div key={index}  className="w-[80vw] h-auto p-4 flex items-center justify-between bg-neutral-900 rounded-xl shadow-xl">
                                <div className="font-semibold font-serif text-xl">
                                    {user.username}
                                </div>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="p-1 cursor-pointer"
                                    onMouseEnter={()=>{setShowInfoIndex(index)}}
                                    onMouseLeave={()=>{setShowInfoIndex(null)}}
                                    >
                                        <IoInformationCircleOutline className="text-2xl " />
                                    </div>
                                    <div className="p-1 cursor-pointer">
                                        <MdDeleteOutline className="text-2xl cursor-pointer" />
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