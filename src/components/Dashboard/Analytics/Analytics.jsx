/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { useSelector } from "react-redux";
import { FaUsers, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const Box = ({ number, info, icon }) => {
  return (
    <div className="w-52 h-24 bg-white flex items-center justify-center gap-2 shadow-lg rounded-md">
      <div className="text-2xl text-blue-500">{icon}</div>
      <div className="flex flex-col items-start justify-center">
        <div className="text-xl font-bold">{number}</div>
        <div className="text-sm text-gray-500 font-semibold">{info}</div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const { allUsers, deletedUsers } = useSelector((state) => state.users);

  const [startMonth, setStartMonth] = useState("July");
  const [endMonth, setEndMonth] = useState("December");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(allUsers);

  const monthMapping = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12,
  };

  const filterData = () => {
    let users = allUsers;

    if (startMonth && endMonth) {
      const startMonthNumber = monthMapping[startMonth];
      const endMonthNumber = monthMapping[endMonth];

      users = users.filter((user) => {
        const userMonth = new Date(user.createdAt).getMonth() + 1;
        return userMonth >= startMonthNumber && userMonth <= endMonthNumber;
      });
    }

    if (selectedRegion) {
      users = users.filter((user) => user.location === selectedRegion);
    }

    setFilteredUsers(users);
  };

  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter((user) => user.status).length;
  const inactiveUsers = filteredUsers.length - activeUsers;

  const registrationData = filteredUsers.reduce((acc, user) => {
    const monthNumber = monthMapping[user.createdAt];
    if (monthNumber) {
      const monthName = new Date(2024, monthNumber - 1).toLocaleString("default", { month: "short" });
      acc[monthName] = (acc[monthName] || 0) + 1;
    }
    return acc;
  }, {});

  const currentMonth = new Date().getMonth(); // 0-based (0 = January)
  const lastSixMonths = [];
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    lastSixMonths.push(new Date(2024, monthIndex).toLocaleString("default", { month: "short" }));
  }

  const registrationTrendData = {
    labels: lastSixMonths,
    datasets: [
      {
        label: "User Registrations",
        data: lastSixMonths.map((month) => registrationData[month] || 0),
        borderColor: "#4bc0c0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const activeVsInactiveData = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        label: "Users",
        data: [activeUsers, inactiveUsers],
        backgroundColor: ["#33FF57", "#FF5733"],
      },
    ],
  };

  const regionData = filteredUsers.reduce((acc, user) => {
    const region = user.location;
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {});
  const usersByRegionData = {
    labels: Object.keys(regionData),
    datasets: [
      {
        label: "Users by Region",
        data: Object.values(regionData),
        backgroundColor: ["#FF5733", "#33FF57", "#5733FF", "#FF33A1"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        type: "category",
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const regions = Array.from(new Set(allUsers.map((user) => user.location)));

  return (
    <div className="w-[100vw] flex flex-col items-center justify-start gap-12 bg-slate-200 min-h-[100vh] py-12">
      <h1 className="text-3xl font-bold text-gray-700">Analytics Dashboard</h1>

      <div className="flex gap-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Month</label>
          <select
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
            className="p-2 border rounded"
          >
            {Object.keys(monthMapping).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Month</label>
          <select
            value={endMonth}
            onChange={(e) => setEndMonth(e.target.value)}
            className="p-2 border rounded"
          >
            {Object.keys(monthMapping).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Region</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={filterData}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Filter
        </button>
      </div>

      <div className="flex items-center justify-center gap-8 mt-8">
        <Box number={totalUsers} info="Total Users" icon={<FaUsers />} />
        <Box number={activeUsers} info="Active Users" icon={<FaUserCheck />} />
        <Box number={deletedUsers} info="Deleted Users" icon={<FaUserTimes />} />
      </div>

      <div className="w-[80%] flex flex-col gap-12 mt-12">
        <div className="bg-white shadow-lg rounded-md p-6">
          <h2 className="text-xl font-semibold mb-4">User Registration Trend (Last 6 Months)</h2>
          <Line data={registrationTrendData} options={chartOptions} />
        </div>

        <div className="bg-white shadow-lg rounded-md p-6">
          <h2 className="text-xl font-semibold mb-4">Active vs Inactive Users</h2>
          <Pie data={activeVsInactiveData} />
        </div>

        <div className="bg-white shadow-lg rounded-md p-6">
          <h2 className="text-xl font-semibold mb-4">Users by Region</h2>
          <Bar data={usersByRegionData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
