// import React, { useState, useEffect, useMemo } from "react";
// import DataTable from "./DataTable";
// import AddCategoryModal from "./models/AddCategory";
// import api from "../../services/api";

// const Category = () => {
//   const [data, setData] = useState([]);
//   const [fetchError, setFetchError] = useState(null);

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleAddSuccess = (newCategory) => {
//     setData((prev) => [...prev, newCategory]);
//   };

//   const token = useMemo(() => {
//     try {
//       const auth = localStorage.getItem("btz_auth");
//       if (!auth) return null;
//       const parsed = JSON.parse(auth);
//       return parsed?.token || null;
//     } catch (e) {
//       return null;
//     }
//   }, []);

//   useEffect(() => {
//     async function fetchCategories() {
//       if (!token) {
//         setFetchError("Not authenticated.");
//         return;
//       }

//       try {
//         setFetchError(null);

//         const res = await api.getAllCategories(); // 👈 no token needed here

//         // if backend sends { error: "..." }
//         if (res?.error) {
//           throw new Error(res.error);
//         }

//         const arr = Array.isArray(res) ? res : res.categories || [];
//         setData(arr);
//       } catch (err) {
//         console.error("fetchCategories:", err);
//         setFetchError("Failed to load categories. Refresh or try again later.");
//       }
//     }

//     fetchCategories();
//   }, [token]);

//   return (
//     <div className="space-y-8 p-4 md:p-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-gray-900">Categories</h2>

//         <button
//           className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700"
//           onClick={() => setIsModalOpen(true)}
//         >
//           + Add Category
//         </button>
//       </div>

//       <DataTable
//         columns={[
//           { header: "Id", accessor: "id" },
//           { header: "Category Name", accessor: "name" },
//           { header: "Description", accessor: "description" },
//           { header: "Action", accessor: "action" },
//         ]}
//         data={data}
//       />

//       <AddCategoryModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSuccess={handleAddSuccess}
//       />
//     </div>
//   );
// };

// export default Category;

import React, { useEffect, useState, useMemo } from "react";
import DataTable from "./DataTable";
import AddCategoryModal from "./models/AddCategory";
import EditCategoryModal from "./models/EditCategoryModal"; // We will create this next
import api from "../../services/api";

const Category = () => {
  const [data, setData] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // For View
  const [editCategory, setEditCategory] = useState(null); // For Edit
  const [deleteId, setDeleteId] = useState(null); // For Delete

  const token = useMemo(() => {
    try {
      const auth = localStorage.getItem("btz_auth");
      return auth ? JSON.parse(auth)?.token : null;
    } catch (e) {
      return null;
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [token]);

  const fetchCategories = async () => {
    if (!token) {
      setFetchError("Not authenticated.");
      return;
    }
    try {
      setFetchError(null);
      const res = await api.getAllCategories();
      const arr = Array.isArray(res) ? res : res.categories || [];
      setData(arr);
    } catch (err) {
      setFetchError("Failed to load categories.");
    }
  };

  const handleDelete = async (id) => {
    try {
      // await api.deleteCategory(id);
      setData(data.filter((item) => item.id !== id));
      setDeleteId(null);
    } catch (err) {
      alert("Error deleting category");
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
      header: "Category Name",
      accessor: "name",
      render: (v) => <span className="font-bold text-gray-900">{v}</span>,
    },
    {
      header: "Description",
      accessor: "description",
      render: (v) => (
        <span className="text-gray-500 text-sm truncate max-w-xs block">
          {v || "No description"}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "View",
      className:
        "bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold px-3 py-1.5 rounded-lg",
      onClick: (row) => setSelectedCategory(row),
    },
    {
      label: "Edit",
      className:
        "bg-amber-50 text-amber-600 hover:bg-amber-100 text-[11px] font-bold px-3 py-1.5 rounded-lg",
      onClick: (row) => setEditCategory(row),
    },
    {
      label: "Delete",
      className:
        "bg-red-50 text-red-600 hover:bg-red-100 text-[11px] font-bold px-3 py-1.5 rounded-lg",
      onClick: (row) => setDeleteId(row.id),
    },
  ];

  return (
    <div className="p-6 space-y-8 font-sans antialiased">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase italic">
          Categories
        </h2>
        <button
          className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all active:scale-95"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Category
        </button>
      </div>

      {fetchError && <p className="text-red-500 font-bold">{fetchError}</p>}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={data} actions={actions} />
      </div>

      {/* Add Modal */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(newItem) => setData([...data, newItem])}
      />

      {/* Edit Modal */}
      <EditCategoryModal
        isOpen={!!editCategory}
        onClose={() => setEditCategory(null)}
        categoryData={editCategory}
        onSuccess={(updated) => {
          setData(
            data.map((item) => (item.id === updated.id ? updated : item)),
          );
          setEditCategory(null);
        }}
      />

      {/* View Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-900/10 backdrop-blur-sm">
          <div className="bg-white border-2 border-purple-600 rounded-xl shadow-2xl p-0 w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-purple-50/30">
              <h3 className="text-xl font-black italic text-gray-900 uppercase">
                Category Details
              </h3>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-gray-400 hover:text-red-500 text-3xl font-light"
              >
                &times;
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                  Name
                </label>
                <p className="text-lg font-bold text-gray-900">
                  {selectedCategory.name}
                </p>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                  Description
                </label>
                <p className="text-gray-600 leading-relaxed">
                  {selectedCategory.description || "No description provided."}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-50">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                  Internal ID
                </label>
                <code className="text-[10px] bg-gray-50 p-2 rounded block text-gray-400">
                  {selectedCategory.id}
                </code>
              </div>
            </div>
            <div className="p-6 bg-gray-50/50">
              <button
                onClick={() => setSelectedCategory(null)}
                className="w-full py-4 bg-purple-600 text-white font-black uppercase tracking-widest rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/10 backdrop-blur-sm">
          <div className="bg-white border-2 border-red-600 rounded-xl p-8 shadow-2xl max-w-sm text-center">
            <h3 className="text-xl font-black text-gray-900">
              Delete Category?
            </h3>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              This may affect resources linked to this category.
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 bg-red-600 rounded-xl font-bold text-white shadow-lg shadow-red-200"
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

export default Category;
