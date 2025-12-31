import React, { useState } from "react";
import DataTable from "./DataTable";
import AddPlanModal from "./models/AddPlanModal";

const Plans = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Free",
      price: 0,
      duration: "Monthly",
      maxServices: 1,
      status: "Active",
    },
    {
      id: 2,
      name: "Starter",
      price: 499,
      duration: "Monthly",
      maxServices: 5,
      status: "Active",
    },
    {
      id: 3,
      name: "Pro",
      price: 1499,
      duration: "Monthly",
      maxServices: 20,
      status: "Inactive",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddSuccess = (newPlan) => {
    setPlans((prev) => [...prev, newPlan]);
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-900">Plans</h2>

      <button
        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700"
        onClick={() => setIsModalOpen(true)}
      >
        + Add Plan
      </button>

      <DataTable
        columns={[
          { header: "Plan Name", accessor: "name" },
          { header: "Price", accessor: "price" },
          { header: "Billing", accessor: "duration" },
          { header: "Max Services", accessor: "maxServices" },
          { header: "Status", accessor: "status" },
        ]}
        data={plans}
      />

      <AddPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default Plans;
