import React from "react";
import DataTable from "./DataTable";

const Payments = () => {
  const data = [
    {
      id: 1,
      user: "Khan Salon",
      plan: "Pro",
      amount: 1499,
      status: "Success",
      date: "16 Dec 2025",
    },
    {
      id: 2,
      user: "Nadira Clinic",
      plan: "Starter",
      amount: 499,
      status: "Pending",
      date: "15 Dec 2025",
    },
  ];

  const columns = [
    { header: "Business", accessor: "user" },
    { header: "Plan", accessor: "plan" },
    {
      header: "Amount",
      accessor: "amount",
      render: (v) => <span className="font-medium">₹{v}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      render: (v) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            v === "Success"
              ? "bg-green-100 text-green-700"
              : v === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {v}
        </span>
      ),
    },
    { header: "Date", accessor: "date" },
  ];

  const actions = [
    {
      label: "View",
      className: "bg-blue-100 text-blue-700",
      onClick: (row) => console.log("View payment", row),
    },
    {
      label: "Refund",
      className: "bg-red-100 text-red-700",
      onClick: (row) => console.log("Refund", row),
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-900">Payments</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
        <Stat title="Total Revenue" value="₹1,24,500" />
        <Stat title="Success" value="342" />
        <Stat title="Pending" value="18" />
        <Stat title="Failed" value="9" />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        pageSizeOptions={[5, 10, 25]}
        actions={actions}
      />
    </div>
  );
};

const Stat = ({ title, value }) => (
  <div className="bg-white border border-violet-600 rounded-xl shadow p-5">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-semibold mt-1">{value}</p>
  </div>
);

export default Payments;
