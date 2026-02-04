// import React,{useEffect} from "react";
// import { AuthProvider } from "../../contexts/AuthContext";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// import api from "../../services/api";

// const stats = [
//   { title: "Total Users", value: "1,245" },
//   { title: "Total Businesses", value: "342" },
//   { title: "Total Bookings", value: "8,921" },
//   { title: "Active Plans", value: "4" },
// ];

// const bookingData = [
//   { month: "Jan", bookings: 400 },
//   { month: "Feb", bookings: 650 },
//   { month: "Mar", bookings: 900 },
//   { month: "Apr", bookings: 1200 },
//   { month: "May", bookings: 1600 },
//   { month: "Jun", bookings: 2000 },
//   { month: "Jul", bookings: 2200 },
//   { month: "Aug", bookings: 2500 },
//   { month: "Sept", bookings: 2700 },
//   { month: "Oct", bookings: 3000 },
//   { month: "Nov", bookings: 3400 },
//   { month: "Dec", bookings: 3800 },
// ];

// const planData = [
//   { name: "Free", users: 500 },
//   { name: "Basic", users: 420 },
//   { name: "Pro", users: 260 },
// ];

// const AdminDashboard = () => {
//   const auth = React.useContext(AuthProvider);
//   useEffect(() => {
//     // Fetch dashboard analytics data
//     const fetchAnalytics = async () => {
//       try {
//         const response = await api.getAnalyticsSummary({
//           headers: {
//             Authorization: `Bearer ${auth.token}`,
//           },
//         });
//         console.log("Dashboard Analytics:", response.data);
//         // You can set the fetched data to state here to update the UI
//       } catch (error) {
//         console.error("Error fetching dashboard analytics:", error);
//       }
//     };

//   return (
//     <div className="space-y-8">
//       {/* Page Title */}
//       <div>
//         <h1 className="text-2xl font-semibold text-gray-800">
//           Admin Dashboard
//         </h1>
//         <p className="text-sm text-gray-500">Platform overview & analytics</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((item, index) => (
//           <div
//             key={index}
//             className="rounded-xl bg-white border border-violet-600 p-5 shadow-sm"
//           >
//             <p className="text-sm text-gray-500">{item.title}</p>
//             <p className="mt-2 text-2xl font-bold text-purple-600">
//               {item.value}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Bookings Chart */}
//         <div className="bg-white border border-violet-600 rounded-xl p-5 shadow-sm">
//           <h2 className="text-lg font-semibold text-gray-700 mb-4">
//             Monthly Bookings
//           </h2>

//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={bookingData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="bookings"
//                 stroke="#7c3aed"
//                 strokeWidth={3}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Plans Chart */}
//         <div className="bg-white border border-violet-600 rounded-xl p-5 shadow-sm">
//           <h2 className="text-lg font-semibold text-gray-700 mb-4">
//             Users by Plan
//           </h2>

//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={planData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="users" fill="#a855f7" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// // export default AdminDashboard;
// import React, { useEffect, useState, useContext } from "react";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// import { useAuth } from "../../contexts/AuthContext";
// import { getDashboardAnalytics } from "../../services/api";

// const AdminDashboard = () => {
//   const { token } = useAuth();
//   const [stats, setStats] = useState([]);
//   const [bookingData, setBookingData] = useState([]);
//   const [planData, setPlanData] = useState([]);

//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       try {
//         const data = await getDashboardAnalytics(token);

//         // Stats cards
//         setStats([
//           { title: "Total Users", value: data.overview.totalUsers },
//           { title: "Total Businesses", value: data.overview.totalBusinesses },
//           { title: "Total Bookings", value: data.overview.totalBookings },
//           { title: "Active Plans", value: data.overview.activePlans },
//         ]);

//         // Monthly bookings
//         setBookingData(
//           data.monthlyBookings.map((b) => ({
//             month: b.month,
//             bookings: b.count,
//           }))
//         );

//         // Users by plan
//         setPlanData(
//           data.usersByPlan.map((p) => ({
//             name: p.plan,
//             users: p.users,
//           }))
//         );
//       } catch (err) {
//         console.error("Analytics error:", err);
//       }
//     };

//     fetchAnalytics();
//   }, [token]);

//   return (
//     <div className="space-y-8">
//       {/* Page Title */}
//       <div>
//         <h1 className="text-2xl font-semibold text-gray-800">
//           Admin Dashboard
//         </h1>
//         <p className="text-sm text-gray-500">Platform overview & analytics</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((item, index) => (
//           <div
//             key={index}
//             className="rounded-xl bg-white border border-violet-600 p-5 shadow-sm"
//           >
//             <p className="text-sm text-gray-500">{item.title}</p>
//             <p className="mt-2 text-2xl font-bold text-purple-600">
//               {item.value}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Monthly Bookings */}
//         <div className="bg-white border border-violet-600 rounded-xl p-5 shadow-sm">
//           <h2 className="text-lg font-semibold text-gray-700 mb-4">
//             Monthly Bookings
//           </h2>

//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={bookingData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="bookings"
//                 stroke="#7c3aed"
//                 strokeWidth={3}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Users by Plan */}
//         <div className="bg-white border border-violet-600 rounded-xl p-5 shadow-sm">
//           <h2 className="text-lg font-semibold text-gray-700 mb-4">
//             Users by Plan
//           </h2>

//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={planData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="users" fill="#a855f7" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { useAuth } from "../../contexts/AuthContext";
import { getDashboardAnalytics } from "../../services/api";

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [planData, setPlanData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getDashboardAnalytics(token);

        // Premium Stats Mapping
        setStats([
          {
            title: "Total Users",
            value: data.overview.totalUsers,
            growth: "+12%",
          },
          {
            title: "Businesses",
            value: data.overview.totalBusinesses,
            growth: "+5%",
          },
          {
            title: "Total Bookings",
            value: data.overview.totalBookings,
            growth: "+18%",
          },
          {
            title: "Active Plans",
            value: data.overview.activePlans,
            growth: "Stable",
          },
        ]);

        setBookingData(
          data.monthlyBookings.map((b) => ({
            month: b.month.substring(0, 3), // Short month names
            bookings: b.count,
          })),
        );

        setPlanData(
          data.usersByPlan.map((p) => ({
            name: p.plan,
            users: p.users,
          })),
        );
      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );

  return (
    <div className="p-6 space-y-8 font-sans antialiased">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-gray-900 uppercase italic">
            Platform Analytics
          </h1>
          <p className="text-xs font-bold text-violet-600 uppercase tracking-widest">
            Real-time performance monitoring
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase">
            Live System
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl bg-white border-2 border-violet-600/10 p-6 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {item.title}
              </p>
              <span className="text-[9px] font-bold text-green-500">
                {item.growth}
              </span>
            </div>
            <p className="mt-2 text-3xl font-black text-gray-900 group-hover:text-violet-600 transition-colors">
              {item.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Bookings - Premium Line Chart */}
        <div className="bg-white border-2 border-violet-600 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-tighter italic">
              Booking Velocity
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase">
              Last 6 Months
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={bookingData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: "bold", fill: "#9ca3af" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: "bold", fill: "#9ca3af" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#7c3aed"
                strokeWidth={4}
                dot={{ r: 6, fill: "#7c3aed", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Users by Plan - Premium Bar Chart */}
        <div className="bg-white border-2 border-violet-600/20 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-tighter italic">
              Plan Distribution
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase">
              Total Subscriber Base
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={planData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: "bold", fill: "#9ca3af" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: "bold", fill: "#9ca3af" }}
              />
              <Tooltip
                cursor={{ fill: "#f5f3ff" }}
                content={<CustomTooltip />}
              />
              <Bar dataKey="users" radius={[6, 6, 0, 0]} barSize={40}>
                {planData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 2 === 0 ? "#7c3aed" : "#a78bfa"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-800 p-3 rounded-xl shadow-2xl">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-sm font-bold text-white">
          {payload[0].value}{" "}
          <span className="text-[10px] text-violet-400 uppercase">
            {payload[0].name}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default AdminDashboard;
