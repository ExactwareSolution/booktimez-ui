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

// export default AdminDashboard;
import React, { useEffect, useState, useContext } from "react";
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
} from "recharts";

import { useAuth } from "../../contexts/AuthContext";
import { getDashboardAnalytics } from "../../services/api";

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [planData, setPlanData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getDashboardAnalytics(token);

        // Stats cards
        setStats([
          { title: "Total Users", value: data.overview.totalUsers },
          { title: "Total Businesses", value: data.overview.totalBusinesses },
          { title: "Total Bookings", value: data.overview.totalBookings },
          { title: "Active Plans", value: data.overview.activePlans },
        ]);

        // Monthly bookings
        setBookingData(
          data.monthlyBookings.map((b) => ({
            month: b.month,
            bookings: b.count,
          }))
        );

        // Users by plan
        setPlanData(
          data.usersByPlan.map((p) => ({
            name: p.plan,
            users: p.users,
          }))
        );
      } catch (err) {
        console.error("Analytics error:", err);
      }
    };

    fetchAnalytics();
  }, [token]);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">Platform overview & analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="rounded-xl bg-white border border-violet-600 p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{item.title}</p>
            <p className="mt-2 text-2xl font-bold text-purple-600">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bookings */}
        <div className="bg-white border border-violet-600 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Monthly Bookings
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#7c3aed"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Users by Plan */}
        <div className="bg-white border border-violet-600 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Users by Plan
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={planData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
