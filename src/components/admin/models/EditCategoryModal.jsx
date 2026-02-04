import React, { useState, useEffect } from "react";
import axios from "axios";

const EditCategoryModal = ({ isOpen, onClose, categoryData, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (categoryData) {
      setForm({
        name: categoryData.name || "",
        description: categoryData.description || "",
      });
    }
  }, [categoryData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // const res = await axios.put(`/api/categories/${categoryData.id}`, form);
      // onSuccess && onSuccess(res.data);

      onSuccess({ ...categoryData, ...form }); // Simulated success
      onClose();
    } catch (err) {
      setError("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Edit Category
        </h3>
        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Category Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="e.g. Beauty & Wellness"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Description
            </label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Brief description of the category..."
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-purple-200 outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 font-bold shadow-lg shadow-purple-100 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
