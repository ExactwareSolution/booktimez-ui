import React from "react";
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

const stats = [
  { title: "Total Users", value: "1,245" },
  { title: "Total Businesses", value: "342" },
  { title: "Total Bookings", value: "8,921" },
  { title: "Active Plans", value: "4" },
];

const bookingData = [
  { month: "Jan", bookings: 400 },
  { month: "Feb", bookings: 650 },
  { month: "Mar", bookings: 900 },
  { month: "Apr", bookings: 1200 },
  { month: "May", bookings: 1600 },
  { month: "Jun", bookings: 2000 },
];

const planData = [
  { name: "Free", users: 500 },
  { name: "Basic", users: 420 },
  { name: "Pro", users: 260 },
  { name: "Enterprise", users: 65 },
];

const AdminDashboard = () => {
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
          <div key={index} className="rounded-xl bg-white border p-5 shadow-sm">
            <p className="text-sm text-gray-500">{item.title}</p>
            <p className="mt-2 text-2xl font-bold text-purple-600">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Chart */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
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

        {/* Plans Chart */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
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
