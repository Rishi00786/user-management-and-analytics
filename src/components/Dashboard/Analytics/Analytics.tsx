/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaUsers, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { RootState, AppDispatch } from '../../../redux/store.ts';
import { setFilteredUsers } from '../../../redux/Slices/analyticsSlice.ts';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

interface BoxProps {
  number: number;
  info: string;
  icon: React.ReactNode;
}

const Box = ({ number, info, icon }: BoxProps) => {
  return (
    <div className="md:w-52 sm:w-36 w-[70vw] sm:h-24 h-16 bg-white flex items-center justify-center sm:gap-2 gap-1 shadow-lg rounded-md">
      <div className="sm:text-2xl text-xl text-blue-500">{icon}</div>
      <div className="flex flex-col items-start justify-center">
        <div className="sm:text-xl text-lg font-bold">{number}</div>
        <div className="text-xs sm:text-sm text-gray-500 font-semibold">{info}</div>
      </div>
    </div>
  );
};

const Analytics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredUsers } = useSelector((state: RootState) => state.analytics);
  const { allUsers, deletedUsers } = useSelector((state: RootState) => state.users);


  const [startMonth, setStartMonth] = useState<string>('July');
  const [endMonth, setEndMonth] = useState<string>('December');
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const monthMapping: { [key: string]: number } = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const filterData = () => {
    let users = allUsers;
    console.log(users)

    if (startMonth && endMonth) {
      const startMonthNumber = monthMapping[startMonth];
      const endMonthNumber = monthMapping[endMonth];

      users = users.filter((user) => {
        const userMonth = monthMapping[user.createdAt];
        return userMonth >= startMonthNumber && userMonth <= endMonthNumber;
      });
    }

    if (selectedRegion) {
      users = users.filter((user) => user.location === selectedRegion);
    }

    dispatch(setFilteredUsers(users));
  };

  useEffect(() => {
    filterData();
  }, [startMonth, endMonth, selectedRegion, allUsers, dispatch]);

  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter((user) => user.status).length;
  const inactiveUsers = filteredUsers.length - activeUsers;

  const registrationData = filteredUsers.reduce((acc, user) => {
    const monthNumber = monthMapping[user.createdAt];
    if (monthNumber) {
      const monthName = new Date(2024, monthNumber - 1).toLocaleString('default', { month: 'short' });
      acc[monthName] = (acc[monthName] || 0) + 1;
    }
    return acc;
  }, {});

  const currentMonth = new Date().getMonth();
  // console.log(currentMonth)
  const lastSixMonths: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    // console.log(monthIndex)
    lastSixMonths.push(new Date(2024, monthIndex, 1).toLocaleString('default', { month: 'short' }));
    // console.log(lastSixMonths)
  }

  const trendLabels = (() => {
    const startMonthNumber = monthMapping[startMonth];
    const endMonthNumber = monthMapping[endMonth];
    const labels: string[] = [];

    for (let i = startMonthNumber; i <= endMonthNumber; i++) {
      const monthIndex = (i - 1) % 12;
      labels.push(new Date(2024, monthIndex).toLocaleString('default', { month: 'short' }));
    }

    return labels;
  })();

  const trendData = trendLabels.map((month) => registrationData[month] || 0);

  const registrationTrendData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'User Registrations',
        data: trendData,
        borderColor: '#4bc0c0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const activeVsInactiveData = {
    labels: ['Active Users', 'Inactive Users'],
    datasets: [
      {
        label: 'Users',
        data: [activeUsers, inactiveUsers],
        backgroundColor: ['#33FF57', '#FF5733'],
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
        label: 'Users by Region',
        data: Object.values(regionData),
        backgroundColor: ['#FF5733', '#33FF57', '#5733FF', '#FF33A1'],
      },
    ],
  };

  const chartOptions: {
    responsive: boolean;
    plugins: {
      legend: {
        position: 'top' | 'center' | 'left' | 'right' | 'bottom' | 'chartArea';
      };
    };
    scales: {
      x: {
        type: 'category';
      };
      y: {
        beginAtZero: boolean;
      };
    };
  } = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };


  const regions = Array.from(new Set(allUsers.map((user) => user.location)));

  return (
    <div className="w-[100vw] flex flex-col items-center justify-start gap-12 bg-slate-200 min-h-[100vh] py-12">
      <h1 className="text-xl sm:text-3xl font-bold text-gray-700">Analytics Dashboard</h1>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
        <div className="flex-1 sm:w-full w-[70vw]">
          <label className="block text-sm font-medium text-gray-700">Start Month</label>
          <select
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
            className="p-2 border rounded w-full"
          >
            {Object.keys(monthMapping).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 sm:w-full w-[70vw]">
          <label className="block text-sm font-medium text-gray-700">End Month</label>
          <select
            value={endMonth}
            onChange={(e) => setEndMonth(e.target.value)}
            className="p-2 border rounded w-full"
          >
            {Object.keys(monthMapping).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 sm:w-full w-[70vw]">
          <label className="block text-sm font-medium text-gray-700">Region</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="p-2 border rounded w-full"
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
          className="px-4 py-2 bg-blue-500 text-white rounded-md self-start sm:self-center"
        >
          Filter
        </button>
      </div>

      <div className="sm:flex-row flex flex-col items-center justify-center gap-8 mt-8">
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
