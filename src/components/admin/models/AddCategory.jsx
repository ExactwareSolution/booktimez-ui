import React, { useState, useRef } from "react";
import axios from "axios";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const AddCategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const validateAndSetFile = (file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only PNG and JPG images are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 2MB");
      return;
    }

    setError("");
    setForm((prev) => ({ ...prev, icon: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      if (form.icon) formData.append("icon", form.icon);

      const res = await axios.post("/api/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess && onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const resetIcon = () => {
    setForm((prev) => ({ ...prev, icon: null }));
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-4">Add Category</h3>

        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Category Name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            required
            className="w-full border px-3 py-2 rounded focus:ring-1 focus:ring-purple-500"
          />

          {/* Description */}
          <textarea
            placeholder="Short description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            className="w-full border px-3 py-2 rounded focus:ring-1 focus:ring-purple-500"
          />

          {/* Icon Upload */}
          <div>
            <label className="block mb-1 font-medium">Category Icon</label>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition"
            >
              {preview ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <span className="text-sm text-gray-600">
                    Click or drag to replace
                  </span>
                </div>
              ) : (
                <div className="text-gray-500">
                  <p className="font-medium">Click to upload</p>
                  <p className="text-sm">or drag & drop (PNG/JPG, max 2MB)</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(e) => validateAndSetFile(e.target.files[0])}
              className="hidden"
            />

            {preview && (
              <button
                type="button"
                onClick={resetIcon}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                Remove icon
              </button>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "+ Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
