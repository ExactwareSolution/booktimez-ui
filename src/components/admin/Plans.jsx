// import React, { useState } from "react";
// import DataTable from "./DataTable";
// import AddPlanModal from "./models/AddPlanModal";
// import api from "../../services/api";

// const Plans = () => {
//   const [plans, setPlans] = useState([
//     {
//       id: 1,
//       name: "Free",
//       price: 0,
//       duration: "Monthly",
//       maxServices: 1,
//       status: "Active",
//     },
//     {
//       id: 2,
//       name: "Starter",
//       price: 499,
//       duration: "Monthly",
//       maxServices: 5,
//       status: "Active",
//     },
//     {
//       id: 3,
//       name: "Pro",
//       price: 1499,
//       duration: "Monthly",
//       maxServices: 20,
//       status: "Inactive",
//     },
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleAddSuccess = (newPlan) => {
//     setPlans((prev) => [...prev, newPlan]);
//   };

//   return (
//     <div className="space-y-8 p-4 md:p-6">
//       <h2 className="text-2xl font-bold text-gray-900">Plans</h2>

//       <button
//         className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700"
//         onClick={() => setIsModalOpen(true)}
//       >
//         + Add Plan
//       </button>

//       <DataTable
//         columns={[
//           { header: "Plan Name", accessor: "name" },
//           { header: "Price", accessor: "price" },
//           { header: "Billing", accessor: "duration" },
//           { header: "Max Services", accessor: "maxServices" },
//           { header: "Status", accessor: "status" },
//         ]}
//         data={plans}
//       />

//       <AddPlanModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSuccess={handleAddSuccess}
//       />
//     </div>
//   );
// };

// export default Plans;

// import React, { useEffect, useState } from "react";
// import DataTable from "./DataTable";
// import AddPlanModal from "./models/AddPlanModal";
// import api from "../../services/api";

// const Plans = () => {
//   const [plans, setPlans] = useState([]);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Fetch plans
//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   const fetchPlans = async () => {
//     try {
//       setError(null);
//       const res = await api.getAllPlans();

//       const list = Array.isArray(res) ? res : res?.plans || [];
//       setPlans(list);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load plans");
//     }
//   };

//   // After add
//   const handleAddSuccess = (newPlan) => {
//     setPlans((prev) => [...prev, newPlan]);
//   };

//   // Columns
//   const columns = [
//     { header: "Name", accessor: "name" },

//     {
//       header: "Price",
//       accessor: "price",
//       render: (v) => `₹${v}`,
//     },

//     {
//       header: "Max Bookings",
//       accessor: "maxBookingsPerMonth",
//     },

//     {
//       header: "Categories",
//       accessor: "maxCategories",
//     },

//     {
//       header: "Resources",
//       accessor: "maxResources",
//     },

//     {
//       header: "Branding",
//       accessor: "brandingRemoved",
//       render: (v) => (
//         <span
//           className={`px-2 py-1 rounded-full text-xs font-medium
//             ${v ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}
//         >
//           {v ? "Yes" : "No"}
//         </span>
//       ),
//     },

//     {
//       header: "Notifications",
//       accessor: "notificationsIncluded",
//       render: (v) => (
//         <span
//           className={`px-2 py-1 rounded-full text-xs font-medium
//             ${v ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}
//         >
//           {v ? "Yes" : "No"}
//         </span>
//       ),
//     },

//     {
//       header: "Status",
//       accessor: "status",
//       render: (v) => (
//         <span
//           className={`px-2 py-1 rounded-full text-xs font-medium
//             ${
//               v === "Active"
//                 ? "bg-green-100 text-green-700"
//                 : "bg-red-100 text-red-700"
//             }`}
//         >
//           {v}
//         </span>
//       ),
//     },
//   ];

//   // Actions column buttons
//   const actions = [
//     {
//       label: "Edit",
//       className: "bg-blue-100 text-blue-700",
//       onClick: (row) => {
//         console.log("Edit", row);
//       },
//     },
//     {
//       label: "Delete",
//       className: "bg-red-100 text-red-700",
//       onClick: (row) => {
//         console.log("Delete", row);
//       },
//     },
//   ];

//   return (
//     <div className="p-6 space-y-5">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Plans</h2>

//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm"
//         >
//           + Add Plan
//         </button>
//       </div>

//       {error && <p className="text-red-500">{error}</p>}

//       <DataTable columns={columns} data={plans} actions={actions} />

//       <AddPlanModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSuccess={handleAddSuccess}
//       />
//     </div>
//   );
// };

// export default Plans;

import React, { useEffect, useState } from "react";
import DataTable from "./DataTable";
import AddPlanModal from "./models/AddPlanModal";
import EditPlanModal from "./EditPlanModal";
import api from "../../services/api";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Modal States
  const [selectedPlan, setSelectedPlan] = useState(null); // For View Details
  const [editPlan, setEditPlan] = useState(null); // For Edit Modal
  const [deleteId, setDeleteId] = useState(null); // For Delete Confirmation

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setError(null);
      const res = await api.getAllPlans();
      const list = Array.isArray(res) ? res : res?.plans || [];
      setPlans(list);
    } catch (err) {
      setError("Failed to load plans");
    }
  };

  const handleDelete = async (id) => {
    try {
      // await api.deletePlan(id);
      setPlans(plans.filter((p) => p.id !== id));
      setDeleteId(null);
    } catch (err) {
      alert("Error deleting plan");
    }
  };

  const columns = [
    {
      header: "#",
      accessor: "id",
      render: (_, __, index) => (
        <span className="text-gray-400 font-black">{index + 1}</span>
      ),
    },
    {
      header: "Name",
      accessor: "name",
      render: (v) => <span className="font-bold text-gray-900">{v}</span>,
    },
    {
      header: "Price",
      accessor: "price",
      render: (v) => <span className="font-black text-violet-700">₹{v}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      render: (v) => (
        <span
          className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest
            ${v === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {v}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "View",
      className:
        "bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all",
      onClick: (row) => setSelectedPlan(row),
    },
    {
      label: "Edit",
      className:
        "bg-amber-50 text-amber-600 hover:bg-amber-100 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all",
      onClick: (row) => setEditPlan(row),
    },
    {
      label: "Delete",
      className:
        "bg-red-50 text-red-600 hover:bg-red-100 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all",
      onClick: (row) => setDeleteId(row.id),
    },
  ];

  return (
    <div className="p-6 space-y-8 font-sans antialiased">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase italic">
          Subscription Plans
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all active:scale-95"
        >
          + Add Plan
        </button>
      </div>

      {error && (
        <p className="p-4 bg-red-50 text-red-500 rounded-xl font-bold border border-red-100">
          {error}
        </p>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={plans} actions={actions} />
      </div>

      {/* Add Modal */}
      <AddPlanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(newPlan) => setPlans([...plans, newPlan])}
      />

      {/* Edit Modal */}
      <EditPlanModal
        isOpen={!!editPlan}
        onClose={() => setEditPlan(null)}
        planData={editPlan}
        onSuccess={(updated) => {
          setPlans(plans.map((p) => (p.id === updated.id ? updated : p)));
          setEditPlan(null);
        }}
      />

      {/* View Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-violet-900/10 backdrop-blur-sm">
          <div className="bg-white border-2 border-violet-600 rounded-xl shadow-2xl p-0 w-full max-w-xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-violet-50/30">
              <h3 className="text-xl font-black italic text-gray-900 tracking-tighter">
                Plan Summary
              </h3>
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-gray-400 hover:text-red-500 text-3xl font-light"
              >
                &times;
              </button>
            </div>

            <div className="p-8 grid grid-cols-2 gap-y-6 gap-x-8">
              <DetailItem label="Plan Name" value={selectedPlan.name} />
              <DetailItem label="Plan Code" value={selectedPlan.code} isCaps />
              <DetailItem
                label="Price"
                value={`₹${selectedPlan.price}`}
                isCurrency
              />
              <DetailItem
                label="Status"
                value={selectedPlan.status}
                isBadge
                badgeColor={
                  selectedPlan.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
              />

              <hr className="col-span-2 border-gray-50" />

              <DetailItem
                label="Max Bookings"
                value={selectedPlan.maxBookingsPerMonth}
              />
              <DetailItem
                label="Max Categories"
                value={selectedPlan.maxCategories}
              />
              <DetailItem
                label="Max Resources"
                value={selectedPlan.maxResources}
              />
              <DetailItem
                label="Languages"
                value={selectedPlan.languages?.join(", ")}
                isCaps
              />

              <div className="col-span-2 py-4 border-y border-gray-50 grid grid-cols-2 gap-4">
                <DetailItem
                  label="Branding"
                  value={selectedPlan.brandingRemoved ? "REMOVED" : "VISIBLE"}
                  isBadge
                  badgeColor={
                    selectedPlan.brandingRemoved
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }
                />
                <DetailItem
                  label="Notifications"
                  value={
                    selectedPlan.notificationsIncluded ? "ENABLED" : "DISABLED"
                  }
                  isBadge
                  badgeColor={
                    selectedPlan.notificationsIncluded
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50/50">
              <button
                onClick={() => setSelectedPlan(null)}
                className="w-full py-4 bg-violet-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-violet-700 transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/10 backdrop-blur-sm">
          <div className="bg-white border-2 border-red-600 rounded-xl p-8 shadow-2xl max-w-sm text-center">
            <h3 className="text-xl font-black text-gray-900">Are you sure?</h3>
            <p className="text-sm text-gray-500 mt-2">
              This action is permanent.
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({
  label,
  value,
  isCurrency,
  isCaps,
  isBadge,
  badgeColor,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
      {label}
    </label>
    {isBadge ? (
      <span
        className={`inline-block w-fit px-3 py-1 rounded text-[10px] font-black uppercase tracking-tighter mt-1 ${badgeColor}`}
      >
        {value}
      </span>
    ) : (
      <p
        className={`text-[15px] font-bold text-gray-900 ${isCurrency ? "text-violet-700 font-black" : ""} ${isCaps ? "uppercase font-mono" : ""}`}
      >
        {value || "—"}
      </p>
    )}
  </div>
);

export default Plans;
