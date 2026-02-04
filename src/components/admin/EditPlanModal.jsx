// import React, { useState, useEffect } from "react";

// const EditPlanModal = ({ isOpen, onClose, planData, onSuccess }) => {
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     if (planData) setFormData({ ...planData });
//   }, [planData]);

//   if (!isOpen) return null;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Here you would call your api.updatePlan(formData.id, formData)
//     onSuccess(formData);
//   };

//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-violet-900/20 backdrop-blur-md">
//       <div className="bg-white border-2 border-violet-600 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in duration-200">
//         {/* Header */}
//         <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-violet-50/50">
//           <div>
//             <h3 className="text-xl font-black italic text-gray-900 tracking-tighter uppercase">
//               Edit Plan Details
//             </h3>
//             <p className="text-[10px] font-bold text-violet-600">
//               ID: {formData.id}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-red-500 text-3xl font-light"
//           >
//             &times;
//           </button>
//         </div>

//         {/* Form Body */}
//         <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
//           <div className="grid grid-cols-2 gap-6">
//             <InputField
//               label="Plan Name"
//               value={formData.name}
//               onChange={(v) => setFormData({ ...formData, name: v })}
//             />

//             <InputField
//               label="Plan Code (Unique)"
//               value={formData.code}
//               onChange={(v) => setFormData({ ...formData, code: v })}
//             />

//             <InputField
//               label="Price (₹)"
//               type="number"
//               value={formData.price}
//               onChange={(v) => setFormData({ ...formData, price: v })}
//             />

//             <InputField
//               label="Max Bookings"
//               type="number"
//               value={formData.maxBookingsPerMonth}
//               onChange={(v) =>
//                 setFormData({ ...formData, maxBookingsPerMonth: v })
//               }
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
//             <InputField
//               label="Max Categories"
//               type="number"
//               value={formData.maxCategories}
//               onChange={(v) => setFormData({ ...formData, maxCategories: v })}
//             />
//             <InputField
//               label="Max Resources"
//               type="number"
//               value={formData.maxResources}
//               onChange={(v) => setFormData({ ...formData, maxResources: v })}
//             />
//           </div>

//           <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
//             <ToggleButton
//               label="Branding"
//               active={formData.brandingRemoved}
//               onClick={() =>
//                 setFormData({
//                   ...formData,
//                   brandingRemoved: !formData.brandingRemoved,
//                 })
//               }
//             />

//             <ToggleButton
//               label="Notifications"
//               active={formData.notificationsIncluded}
//               onClick={() =>
//                 setFormData({
//                   ...formData,
//                   notificationsIncluded: !formData.notificationsIncluded,
//                 })
//               }
//             />

//             <div className="flex flex-col gap-2">
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                 Status
//               </label>
//               <select
//                 value={formData.status}
//                 onChange={(e) =>
//                   setFormData({ ...formData, status: e.target.value })
//                 }
//                 className="bg-white border border-gray-200 rounded-lg p-2 text-xs font-bold outline-none focus:border-violet-600 cursor-pointer"
//               >
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//             </div>
//           </div>
//         </form>

//         {/* Footer */}
//         <div className="p-6 bg-white border-t border-gray-50 flex gap-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className="flex-1 py-4 text-gray-400 font-black uppercase tracking-widest text-[11px] hover:text-gray-600 transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="flex-1 py-4 bg-violet-600 text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all active:scale-95"
//           >
//             Update Plan
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Internal Styled Input
// const InputField = ({ label, value, onChange, type = "text" }) => (
//   <div className="flex flex-col gap-1.5">
//     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
//       {label}
//     </label>
//     <input
//       type={type}
//       value={value || ""}
//       onChange={(e) => onChange(e.target.value)}
//       className="border-2 border-gray-50 bg-gray-50/30 p-3 rounded-xl text-sm font-bold text-gray-900 outline-none focus:border-violet-600 focus:bg-white transition-all shadow-sm"
//     />
//   </div>
// );

// // Internal Styled Toggle
// const ToggleButton = ({ label, active, onClick }) => (
//   <div className="flex flex-col gap-2">
//     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
//       {label}
//     </label>
//     <button
//       type="button"
//       onClick={onClick}
//       className={`py-2 px-3 rounded-lg text-[9px] font-black uppercase transition-all border-2 ${active ? "bg-green-50 border-green-200 text-green-700" : "bg-white border-gray-100 text-gray-300"}`}
//     >
//       {active ? "Removed" : "Visible"}
//     </button>
//   </div>
// );

// export default EditPlanModal;

import React, { useState, useEffect } from "react";
import axios from "axios";

const EditPlanModal = ({ isOpen, onClose, planData, onSuccess }) => {
  const [form, setForm] = useState({
    code: "",
    name: "",
    price: "",
    maxBookingsPerMonth: "",
    maxBusinesses: "",
    maxCategories: "",
    languages: ["en"],
    brandingRemoved: false,
    notificationsIncluded: true,
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when planData changes or modal opens
  useEffect(() => {
    if (planData) {
      setForm({
        code: planData.code || "",
        name: planData.name || "",
        price: planData.price || 0,
        maxBookingsPerMonth: planData.maxBookingsPerMonth || "",
        maxBusinesses: planData.maxBusinesses || "",
        maxCategories: planData.maxCategories || "",
        languages: planData.languages || ["en"],
        brandingRemoved: planData.brandingRemoved || false,
        notificationsIncluded: planData.notificationsIncluded || false,
        status: planData.status || "Active",
      });
    }
  }, [planData, isOpen]);

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
      };

      // Assuming your API follows /api/plans/:id
      const res = await axios.put(`/api/plans/${planData.id}`, payload);

      onSuccess && onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit Plan</h3>

        {error && (
          <p className="text-red-600 mb-3 text-sm font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plan Code (Often disabled in Edit to prevent breaking references) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Plan Code
            </label>
            <input
              name="code"
              placeholder="Plan Code (FREE, PRO)"
              value={form.code}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded bg-gray-50 cursor-not-allowed"
              disabled
            />
          </div>

          {/* Plan Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Display Name
            </label>
            <input
              name="name"
              placeholder="Plan Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Price (INR)
            </label>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Limits Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">
                Bookings
              </label>
              <input
                type="number"
                name="maxBookingsPerMonth"
                value={form.maxBookingsPerMonth}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">
                Businesses
              </label>
              <input
                type="number"
                name="maxBusinesses"
                value={form.maxBusinesses}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">
                Categories
              </label>
              <input
                type="number"
                name="maxCategories"
                value={form.maxCategories}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded text-sm"
              />
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Supported Languages
            </label>
            <div className="flex items-center gap-4 flex-wrap">
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
                    className="accent-purple-600 h-4 w-4"
                  />
                  <span className="text-sm text-gray-600">{lang.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                name="brandingRemoved"
                checked={form.brandingRemoved}
                onChange={handleChange}
                className="accent-purple-600"
              />
              Remove Branding
            </label>

            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                name="notificationsIncluded"
                checked={form.notificationsIncluded}
                onChange={handleChange}
                className="accent-purple-600"
              />
              Enable Notifications
            </label>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Plan Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded font-medium"
            >
              <option value="Active" className="text-green-600">
                Active
              </option>
              <option value="Inactive" className="text-red-600">
                Inactive
              </option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 font-bold shadow-lg shadow-purple-100 disabled:opacity-50"
            >
              {loading ? "Saving Changes..." : "Update Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlanModal;
