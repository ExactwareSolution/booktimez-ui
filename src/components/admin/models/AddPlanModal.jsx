import React, { useState } from "react";
import axios from "axios";

const AddPlanModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    code: "",
    name: "",
    price: 0,
    maxBookingsPerMonth: "",
    maxBusinesses: "",
    maxCategories: "",
    languages: ["en"], // ✅ array
    brandingRemoved: false,
    notificationsIncluded: true,
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        maxBookingsPerMonth: form.maxBookingsPerMonth
          ? Number(form.maxBookingsPerMonth)
          : null,
        maxBusinesses: form.maxBusinesses ? Number(form.maxBusinesses) : null,
        maxCategories: form.maxCategories ? Number(form.maxCategories) : null,
        languages: form.languages, // ✅ already array
      };

      const res = await axios.post("/api/plans", payload);
      onSuccess && onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-4">Add Plan</h3>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plan Code */}
          <input
            name="code"
            placeholder="Plan Code (FREE, PRO, STARTER)"
            value={form.code}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          {/* Plan Name */}
          <input
            name="name"
            placeholder="Plan Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          {/* Limits */}
          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              name="maxBookingsPerMonth"
              placeholder="Bookings / month"
              value={form.maxBookingsPerMonth}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />

            <input
              type="number"
              name="maxBusinesses"
              placeholder="Businesses"
              value={form.maxBusinesses}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />

            <input
              type="number"
              name="maxCategories"
              placeholder="Categories"
              value={form.maxCategories}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />
          </div>

          {/* Languages Dropdown */}
          <div>
            <label className="block mb-2 font-medium">
              Supported Languages
            </label>

            <div className="flex items-center gap-6">
              {[
                { label: "English", value: "en" },
                { label: "Hindi", value: "hi" },
                { label: "Arabic", value: "ar" },
              ].map((lang) => (
                <label
                  key={lang.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.languages.includes(lang.value)}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        languages: e.target.checked
                          ? [...prev.languages, lang.value]
                          : prev.languages.filter((l) => l !== lang.value),
                      }));
                    }}
                    className="accent-purple-600"
                  />
                  <span className="text-sm">
                    {lang.label} ({lang.value})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="brandingRemoved"
                checked={form.brandingRemoved}
                onChange={handleChange}
              />
              Branding Removed
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="notificationsIncluded"
                checked={form.notificationsIncluded}
                onChange={handleChange}
              />
              Notifications Enabled
            </label>
          </div>

          {/* Status */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            {loading ? "Creating Plan..." : "+ Create Plan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlanModal;
