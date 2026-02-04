// import React, { useEffect, useState } from "react";
// import DataTable from "./DataTable";
// import api from "../../services/api";
// import { useAuth } from "../../contexts/AuthContext";

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState(null);
//   const { token } = useAuth() || {};

//   // Fetch users
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setError(null);

//       const res = await api.getAllUsers(token);

//       // Supports: [] OR { users: [] }
//       const list = Array.isArray(res) ? res : res?.users || [];
//       setUsers(list);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load users");
//     }
//   };

//   // Columns
//   const columns = [
//     { header: "Name", accessor: "name" },
//     { header: "Email", accessor: "email" },

//     {
//       header: "Role",
//       accessor: "role",
//       render: (v) => <span className="capitalize">{v}</span>,
//     },

//     {
//       header: "Status",
//       accessor: "isActive",
//       render: (v) => (
//         <span
//           className={`px-2 py-1 text-xs rounded-full
//         ${v ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
//         >
//           {v ? "Active" : "Inactive"}
//         </span>
//       ),
//     },
//   ];

//   // Row Actions
//   const actions = [
//     {
//       label: "View",
//       className: "bg-blue-100 text-blue-700",
//       onClick: (row) => console.log("View user:", row),
//     },
//     {
//       label: "Edit",
//       className: "bg-yellow-100 text-yellow-700",
//       onClick: (row) => console.log("Edit user:", row),
//     },
//     {
//       label: "Delete",
//       className: "bg-red-100 text-red-700",
//       onClick: (row) => console.log("Delete user:", row),
//     },
//   ];

//   return (
//     <div className="space-y-6 p-4 md:p-6">
//       <h2 className="text-2xl font-bold">Users</h2>

//       {error && <p className="text-red-500">{error}</p>}

//       <DataTable
//         columns={columns}
//         data={users}
//         pageSizeOptions={[5, 10, 25]}
//         actions={actions}
//       />
//     </div>
//   );
// };

// export default Users;

import React, { useEffect, useState } from "react";
import DataTable from "./DataTable";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import EditUserModal from "./models/EditUserModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { token } = useAuth() || {};

  // Modal States
  const [selectedUser, setSelectedUser] = useState(null); // For View Profile
  const [editUser, setEditUser] = useState(null); // For Edit Modal
  const [deleteId, setDeleteId] = useState(null); // For Delete Confirmation

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setError(null);
      const res = await api.getAllUsers(token);
      const list = Array.isArray(res) ? res : res?.users || [];
      setUsers(list);
    } catch (err) {
      console.error(err);
      setError("Failed to load users from the server.");
    }
  };

  const handleDelete = async (id) => {
    try {
      // await api.deleteUser(id, token);
      setUsers(users.filter((u) => u.id !== id));
      setDeleteId(null);
    } catch (err) {
      alert("Error deleting user");
    }
  };

  // Table Column Definitions
  const columns = [
    {
      header: "#",
      accessor: "id",
      render: (_, __, index) => (
        <span className="text-gray-400 font-black">{index + 1}</span>
      ),
    },
    {
      header: "User info",
      accessor: "name",
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 leading-tight">
            {row.name}
          </span>
          <span className="text-[11px] text-gray-500 font-medium lowercase">
            {row.email}
          </span>
        </div>
      ),
    },
    {
      header: "Current Plan",
      accessor: "plan",
      render: (v) => (
        <span
          className={`font-black tracking-tight ${v ? "text-violet-700" : "text-gray-300"}`}
        >
          {v?.name || "N/A"}
        </span>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      render: (v) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
            v === "admin"
              ? "bg-orange-50 text-orange-600 border-orange-100"
              : "bg-blue-50 text-blue-600 border-blue-100"
          }`}
        >
          {v}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "isActive",
      render: (v) => (
        <span
          className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest
            ${v ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {v ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  // Table Action Buttons
  const actions = [
    {
      label: "View",
      className:
        "bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all",
      onClick: (row) => setSelectedUser(row),
    },
    {
      label: "Edit",
      className:
        "bg-amber-50 text-amber-600 hover:bg-amber-100 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all",
      onClick: (row) => setEditUser(row),
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase italic">
            User Management
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Manage your platform users and their subscription roles.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl font-bold text-sm">
          {error}
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={users} actions={actions} />
      </div>

      {/* --- EDIT MODAL --- */}
      <EditUserModal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        userData={editUser}
        onSuccess={(updatedUser) => {
          setUsers(
            users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
          );
          setEditUser(null);
        }}
      />

      {/* --- VIEW MODAL (Violet Premium Style) --- */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-violet-900/10 backdrop-blur-sm">
          <div className="bg-white border-2 border-violet-600 rounded-xl shadow-2xl p-0 w-full max-w-xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-violet-50/30">
              <h3 className="text-xl font-black italic text-gray-900 tracking-tighter uppercase">
                User Summary
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-red-500 text-3xl font-light"
              >
                &times;
              </button>
            </div>

            <div className="p-8 grid grid-cols-2 gap-y-6 gap-x-8">
              <DetailItem label="Full Name" value={selectedUser.name} />
              <DetailItem label="Email Address" value={selectedUser.email} />
              <DetailItem label="Role" value={selectedUser.role} isCaps />
              <DetailItem
                label="Status"
                value={selectedUser.isActive ? "ACTIVE" : "INACTIVE"}
                isBadge
                badgeColor={
                  selectedUser.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
              />

              <hr className="col-span-2 border-gray-50" />

              <DetailItem
                label="Current Plan"
                value={selectedUser.plan?.name || "Free/None"}
                isCurrency
              />
              <DetailItem
                label="Plan Price"
                value={selectedUser.plan ? `₹${selectedUser.plan.price}` : "—"}
              />
              <DetailItem
                label="Expiry Date"
                value={
                  selectedUser.planExpiresAt
                    ? new Date(selectedUser.planExpiresAt).toLocaleDateString()
                    : "Lifetime / No Plan"
                }
              />
              <DetailItem
                label="Member Since"
                value={new Date(selectedUser.createdAt).toLocaleDateString()}
              />

              <div className="col-span-2 py-4 border-t border-gray-50">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                  Internal UID
                </label>
                <code className="text-[10px] bg-gray-50 p-2 rounded block text-gray-500 break-all">
                  {selectedUser.id}
                </code>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-4 bg-violet-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-violet-700 transition-all active:scale-95 shadow-lg shadow-violet-100"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION --- */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/10 backdrop-blur-sm">
          <div className="bg-white border-2 border-red-600 rounded-xl p-8 shadow-2xl max-w-sm text-center animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-black text-gray-900">Are you sure?</h3>
            <p className="text-sm text-gray-500 mt-2 font-medium leading-relaxed">
              This will permanently remove the user from the database. This
              action cannot be undone.
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 bg-red-600 rounded-xl font-bold text-white shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95"
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

// Reusable Detail Item for consistency
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
        className={`text-[14px] font-bold text-gray-900 ${isCurrency ? "text-violet-700 font-black" : ""} ${isCaps ? "uppercase" : ""}`}
      >
        {value || "—"}
      </p>
    )}
  </div>
);

export default Users;
