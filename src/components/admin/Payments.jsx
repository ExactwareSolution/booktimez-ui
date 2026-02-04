// import React from "react";
// import DataTable from "./DataTable";
// import api from "../../services/api";

// const Payments = () => {
//   const data = [
//     {
//       id: 1,
//       user: "Khan Salon",
//       plan: "Pro",
//       amount: 1499,
//       status: "Success",
//       date: "16 Dec 2025",
//     },
//     {
//       id: 2,
//       user: "Nadira Clinic",
//       plan: "Starter",
//       amount: 499,
//       status: "Pending",
//       date: "15 Dec 2025",
//     },
//   ];

//   const columns = [
//     { header: "Business", accessor: "user" },
//     { header: "Plan", accessor: "plan" },
//     {
//       header: "Amount",
//       accessor: "amount",
//       render: (v) => <span className="font-medium">₹{v}</span>,
//     },
//     {
//       header: "Status",
//       accessor: "status",
//       render: (v) => (
//         <span
//           className={`px-2 py-1 text-xs rounded-full ${
//             v === "Success"
//               ? "bg-green-100 text-green-700"
//               : v === "Pending"
//               ? "bg-yellow-100 text-yellow-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {v}
//         </span>
//       ),
//     },
//     { header: "Date", accessor: "date" },
//   ];

//   const actions = [
//     {
//       label: "View",
//       className: "bg-blue-100 text-blue-700",
//       onClick: (row) => console.log("View payment", row),
//     },
//     {
//       label: "Refund",
//       className: "bg-red-100 text-red-700",
//       onClick: (row) => console.log("Refund", row),
//     },
//   ];

//   return (
//     <div className="space-y-8 p-4 md:p-6">
//       <h2 className="text-2xl font-bold text-gray-900">Payments</h2>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
//         <Stat title="Total Revenue" value="₹1,24,500" />
//         <Stat title="Success" value="342" />
//         <Stat title="Pending" value="18" />
//         <Stat title="Failed" value="9" />
//       </div>

//       {/* Table */}
//       <DataTable
//         columns={columns}
//         data={data}
//         pageSizeOptions={[5, 10, 25]}
//         actions={actions}
//       />
//     </div>
//   );
// };

// const Stat = ({ title, value }) => (
//   <div className="bg-white border border-violet-600 rounded-xl shadow p-5">
//     <p className="text-sm text-gray-500">{title}</p>
//     <p className="text-2xl font-semibold mt-1">{value}</p>
//   </div>
// );

// export default Payments;

// src/pages/Payments.jsx
import React, { useState, useEffect, useMemo } from "react";
import DataTable from "./DataTable";
import api from "../../services/api";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const auth = JSON.parse(localStorage.getItem("btz_auth") || "{}");
  const token = auth?.token;

  const fetchPayments = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await api.listMyPayments(token);
      setPayments(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [token]);

  const stats = useMemo(() => {
    const totalRevenuePaise = payments
      .filter((p) => p.status === "paid")
      .reduce((sum, curr) => sum + (Number(curr.amountInPaise) || 0), 0);

    return {
      revenue: `₹ ${(totalRevenuePaise / 100).toLocaleString()}`,
      success: payments.filter((p) => p.status === "paid").length,
      pending: payments.filter((p) => p.status === "pending").length,
      failed: payments.filter((p) => p.status === "failed").length,
    };
  }, [payments]);

  const columns = [
    {
      header: "#",
      accessor: "id",
      // FIX: Use row index properly. If your DataTable doesn't provide it,
      // map the data before passing it to the table.
      render: (_, row, index) => (
        <span className="text-gray-600 font-semibold text-sm">{index + 1}</span>
      ),
    },
    {
      header: "Business",
      accessor: "Business",
      render: (b) => (
        <span className="text-gray-800 font-medium text-sm">
          {b?.name || "Personal"}
        </span>
      ),
    },
    {
      header: "Plan",
      accessor: "metadata",
      render: (m) => (
        <span className="capitalize font-bold text-violet-600 text-sm tracking-tight">
          {m?.planCode || "Standard"}
        </span>
      ),
    },
    {
      header: "Amount",
      accessor: "amountInPaise",
      render: (v) => (
        <span className="font-bold text-gray-900 text-sm">₹{v / 100}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (v) => (
        <span
          className={`px-3 py-1 text-[10px] rounded-md font-black uppercase tracking-widest ${
            v === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {v}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      render: (v) => (
        <span className="text-gray-500 font-medium text-sm">
          {new Date(v).toLocaleDateString("en-IN")}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "View Details",
      // UI FIX: Centering and Font
      className:
        "bg-violet-100 text-violet-700 hover:bg-violet-200 text-[11px] font-bold px-4 py-1.5 rounded-lg transition-all mx-auto block",
      onClick: (row) => setSelectedPayment(row),
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-6 font-sans antialiased text-gray-900">
      <h1 className="text-2xl font-black tracking-tighter text-gray-900 uppercase italic">
        Payments
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat title="Total Revenue" value={stats.revenue} />
        <Stat title="Success" value={stats.success} />
        <Stat title="Pending" value={stats.pending} />
        <Stat title="Failed" value={stats.failed} />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
        <DataTable
          columns={columns}
          data={payments}
          pageSizeOptions={[5, 10, 25]}
          actions={actions}
          // If your DataTable supports a custom cell class:
          cellClassName="py-4 px-6 text-center align-middle"
        />
      </div>

      {/* Modal - Improved Typography and Colors */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-violet-900/10 backdrop-blur-md">
          <div className="bg-white border-2 border-violet-600 rounded-2xl shadow-2xl p-0 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-violet-50/30">
              <h3 className="text-xl font-black italic text-gray-900 tracking-tighter">
                Payment Summary
              </h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-400 hover:text-red-500 text-2xl font-light"
              >
                &times;
              </button>
            </div>

            <div className="p-8 grid grid-cols-2 gap-8 bg-white">
              <DetailItem
                label="Client / Business"
                value={selectedPayment.Business?.name || "Personal"}
              />
              <DetailItem
                label="Plan Name"
                value={selectedPayment.metadata?.planCode}
              />
              <DetailItem
                label="Paid Amount"
                value={`₹ ${selectedPayment.amountInPaise / 100}`}
                isCurrency
              />
              <DetailItem
                label="Gateway"
                value={selectedPayment.provider}
                isCaps
              />
              <DetailItem
                label="Order ID"
                value={selectedPayment.providerOrderId}
                isMuted
              />
              <DetailItem
                label="Transaction ID"
                value={selectedPayment.providerPaymentId}
                isMuted
              />

              <div className="col-span-2 pt-6 border-t border-gray-50">
                <DetailItem
                  label="Payment Timestamp"
                  value={new Date(selectedPayment.createdAt).toLocaleString()}
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50/50">
              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full py-4 bg-violet-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all active:scale-95"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components with sharpened typography
const DetailItem = ({ label, value, isCurrency, isCaps, isMuted }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
      {label}
    </label>
    <p
      className={`text-[15px] font-bold ${isMuted ? "text-gray-500 font-mono text-xs" : "text-gray-900"} ${isCaps ? "uppercase" : ""} `}
    >
      {value || "—"}
    </p>
  </div>
);

const Stat = ({ title, value }) => (
  <div className="bg-white border border-violet-600 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
      {title}
    </p>
    <p className="text-2xl font-black text-gray-900 mt-1 tracking-tight">
      {value}
    </p>
  </div>
);

export default Payments;
