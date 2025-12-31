import React from "react";
import DataTable from "./DataTable";

const Users = () => {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "Active",
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@btz.com",
      role: "admin",
      status: "Active",
    },
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "Active",
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@btz.com",
      role: "admin",
      status: "Active",
    },
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "Active",
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@btz.com",
      role: "admin",
      status: "Active",
    },
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "Active",
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@btz.com",
      role: "admin",
      status: "Active",
    },
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "Active",
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@btz.com",
      role: "admin",
      status: "Active",
    },
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "Active",
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@btz.com",
      role: "admin",
      status: "Active",
    },
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "Active",
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@btz.com",
      role: "admin",
      status: "Active",
    },
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "Active",
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@btz.com",
      role: "admin",
      status: "Active",
    },
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "Active",
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@btz.com",
      role: "admin",
      status: "Active",
    },
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "Active",
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@btz.com",
      role: "admin",
      status: "Active",
    },
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "Active",
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@btz.com",
      role: "admin",
      status: "Active",
    },
  ];

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "View",
      className: "bg-blue-100 text-blue-700",
      onClick: (row) => console.log("View", row),
    },
    {
      label: "Edit",
      className: "bg-yellow-100 text-yellow-700",
      onClick: (row) => console.log("Edit", row),
    },
    {
      label: "Delete",
      className: "bg-red-100 text-red-700",
      onClick: (row) => console.log("Delete", row),
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-900">Users</h2>

      <DataTable
        columns={columns}
        data={users}
        pageSizeOptions={[5, 10, 25]}
        actions={actions}
      />
    </div>
  );
};

export default Users;
