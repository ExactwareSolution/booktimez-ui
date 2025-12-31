import React, { useState } from "react";
import DataTable from "./DataTable";
import AddCategoryModal from "./models/AddCategory";

const Category = () => {
  const [data, setData] = useState([
    { id: 1, name: "Salon", businesses: 12, status: "Active" },
    { id: 2, name: "Clinic", businesses: 8, status: "Inactive" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddSuccess = (newCategory) => {
    setData((prev) => [...prev, newCategory]);
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Categories</h2>

        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Category
        </button>
      </div>

      <DataTable
        columns={[
          { header: "Category Name", accessor: "name" },
          { header: "Businesses", accessor: "businesses" },
          { header: "Status", accessor: "status" },
        ]}
        data={data}
      />

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default Category;
