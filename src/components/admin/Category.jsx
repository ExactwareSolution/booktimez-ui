import React, { useState, useEffect, useMemo } from "react";
import DataTable from "./DataTable";
import AddCategoryModal from "./models/AddCategory";
import api from "../../services/api";

const Category = () => {
  const [data, setData] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddSuccess = (newCategory) => {
    setData((prev) => [...prev, newCategory]);
  };

  const token = useMemo(() => {
    try {
      const auth = localStorage.getItem("btz_auth");
      if (!auth) return null;
      const parsed = JSON.parse(auth);
      return parsed?.token || null;
    } catch (e) {
      return null;
    }
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      if (!token) {
        setFetchError("Not authenticated.");
        return;
      }
      try {
        setFetchError(null);
        const res = await fetch("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err.error || `Failed to fetch categories (${res.status})`
          );
        }
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data.categories || [];
        setData(arr);
      } catch (err) {
        console.error("fetchCategories:", err);
        setFetchError("Failed to load categories. Refresh or try again later.");
      }
    }
    fetchCategories();
  }, [token]);

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
          { header: "Id", accessor: "id" },
          { header: "Category Name", accessor: "name" },
          { header: "Description", accessor: "description" },
          { header: "Action", accessor: "action" },
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
