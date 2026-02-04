// import React, { useState, useEffect, useRef } from "react";
// import "react-datepicker/dist/react-datepicker.css";
// import { useAuth } from "../../contexts/AuthContext";
// import { useLocalization } from "../../contexts/LocalizationContext";
// import {
//   CalendarDays,
//   Clock,
//   Plus,
//   List,
//   Calendar,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   Check,
// } from "lucide-react";

// import api from "../../services/api";

// const Resources = () => {
//   const { token } = useAuth() || {};
//   const { t } = useLocalization();

//   const [businesses, setBusinesses] = useState([]);
//   const [selectedBusinessId, setSelectedBusinessId] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");
//   const [availabilities, setAvailabilities] = useState([]);
//   const [loadingAvail, setLoadingAvail] = useState(false);

//   const [weekday, setWeekday] = useState(1);
//   const [startTime, setStartTime] = useState("09:00");
//   const [endTime, setEndTime] = useState("17:00");
//   const [slotDurationMinutes, setSlotDurationMinutes] = useState(30);

//   const [successMsg, setSuccessMsg] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");

//   const [resources, setResources] = useState([]);
//   const [selectedResourceIds, setSelectedResourceIds] = useState([]);
//   const [newResourceName, setNewResourceName] = useState("");
//   const [resourceLoading, setResourceLoading] = useState(false);
//   const [showResourceDropdown, setShowResourceDropdown] = useState(false);
//   const dropdownRef = useRef(null);

//   const [editingResource, setEditingResource] = useState(null);

//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editingSlot, setEditingSlot] = useState(null);

//   const weekdayMap = {
//     1: "Monday",
//     2: "Tuesday",
//     3: "Wednesday",
//     4: "Thursday",
//     5: "Friday",
//     6: "Saturday",
//     7: "Sunday",
//   };

//   const handleEditClick = (slot) => {
//     setEditingSlot(slot);
//     setIsEditModalOpen(true);
//   };

//   // ------------------ RESOURCES CRUD ------------------

//   const fetchResources = async () => {
//     if (!token || !selectedBusinessId) return;
//     try {
//       const res = await api.getResource(token, selectedBusinessId);
//       // res is array of resources
//       setResources(res || []);
//       console.log("----------------->", res);
//     } catch (err) {
//       console.error("fetchResources error:", err);
//       setResources([]);
//     }
//   };

//   const handleAddResource = async (e) => {
//     e?.preventDefault();
//     if (!token || !selectedBusinessId || !newResourceName.trim()) return;
//     setResourceLoading(true);
//     setErrorMsg("");
//     try {
//       const resource = await api.createResource(token, selectedBusinessId, {
//         name: newResourceName.trim(),
//       });
//       setResources((prev) => [...prev, resource]);
//       setSelectedResourceIds((prev) => [...prev, String(resource.id)]);
//       setNewResourceName("");
//       setSuccessMsg(t("resourceAdded"));
//       setTimeout(() => setSuccessMsg(""), 3000);
//     } catch (err) {
//       setErrorMsg(err.message || t("failedAddResource"));
//     } finally {
//       setResourceLoading(false);
//     }
//   };

//   const handleUpdateResource = async (id, name) => {
//     if (!token || !name.trim()) return;
//     try {
//       await api.updateResource(token, id, { name }); // fixed

//       setResources((prev) =>
//         prev.map((r) => (r.id === id ? { ...r, name } : r)),
//       );

//       setSuccessMsg(t("updatedSuccessfully"));
//       setTimeout(() => setSuccessMsg(""), 3000);
//     } catch (err) {
//       setErrorMsg(err.message || t("updateFailed"));
//     }
//   };

//   const handleDeleteResource = async (id) => {
//     if (!token || !selectedBusinessId) return;
//     if (!window.confirm(t("confirmDeleteResource"))) return;

//     try {
//       await api.deleteResource(token, selectedBusinessId, id);
//       setResources((prev) => prev.filter((r) => r.id !== id));
//       setSuccessMsg(t("resourceDeleted"));
//       setTimeout(() => setSuccessMsg(""), 3000);
//     } catch (err) {
//       setErrorMsg(err.message || t("failedDeleteResource"));
//     }
//   };

//   // ------------------ AVAILABILITY ------------------

//   // ------------------ BUSINESS & CATEGORIES ------------------

//   useEffect(() => {
//     if (!token) return;
//     (async () => {
//       try {
//         const res = await api.listMyBusinesses(token);
//         const arr = Array.isArray(res) ? res : res?.businesses || [];
//         const normalized = arr.map((b) => (b.business ? b.business : b));
//         setBusinesses(normalized);
//         if (normalized.length) setSelectedBusinessId(normalized[0].id);
//       } catch (e) {
//         console.error("loadBusinesses", e);
//       }
//     })();
//   }, [token]);

//   useEffect(() => {
//     if (!token || !selectedBusinessId) return;
//     (async () => {
//       try {
//         const res = await api.listBusinessCategories(token, selectedBusinessId);
//         const arr = res?.categories || [];
//         setCategories(arr);
//         if (arr.length && !selectedCategoryId) setSelectedCategoryId(arr[0].id);

//         fetchResources();
//       } catch (e) {
//         console.error("loadInitialData", e);
//       }
//     })();
//   }, [token, selectedBusinessId]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowResourceDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleResource = (id) => {
//     const idStr = String(id);
//     setSelectedResourceIds((prev) =>
//       prev.includes(idStr) ? prev.filter((i) => i !== idStr) : [...prev, idStr],
//     );
//   };

//   // ------------------ RETURN UI ------------------

//   return (
//     <div className="space-y-8 p-4 md:p-6">
//       <h2 className="text-2xl font-bold">{t("myResources")}</h2>

//       <div className="bg-white p-6 rounded-xl border border-violet-600 shadow">
//         {/* RESOURCE FORM */}
//         <form
//           onSubmit={handleAddResource}
//           className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-4"
//         >
//           <div className="md:col-span-5">
//             <input
//               value={newResourceName}
//               onChange={(e) => setNewResourceName(e.target.value)}
//               placeholder={t("resourceName")}
//               className="w-full p-2 border border-violet-600 rounded"
//             />
//           </div>
//           <div className="md:col-span-2 text-right">
//             <button
//               type="submit"
//               disabled={resourceLoading}
//               className="px-4 py-2 bg-violet-600 text-white rounded font-medium hover:bg-violet-700 transition-colors"
//             >
//               {resourceLoading ? t("adding") : t("addResource")}
//             </button>
//           </div>
//         </form>

//         {(successMsg || errorMsg) && (
//           <div className="mb-3">
//             {successMsg && (
//               <div className="bg-green-50 border border-green-200 p-2 rounded text-sm text-green-700">
//                 {successMsg}
//               </div>
//             )}
//             {errorMsg && (
//               <div className="bg-red-50 border border-red-200 p-2 rounded text-sm text-red-700">
//                 {errorMsg}
//               </div>
//             )}
//           </div>
//         )}

//         {/* RESOURCE LIST */}
//         <div className="border border-violet-600 rounded-md p-3 bg-gray-50">
//           {resources.length ? (
//             <div className="space-y-2">
//               {resources.map((r) => (
//                 <div
//                   key={r.id}
//                   className="flex items-center justify-between bg-white p-2 rounded-md border border-violet-600"
//                 >
//                   <input
//                     defaultValue={r.name}
//                     onBlur={(e) => handleUpdateResource(r.id, e.target.value)}
//                     className="border px-2 py-1 rounded w-64"
//                   />
//                   <button
//                     onClick={() => handleDeleteResource(r.id)}
//                     className="text-red-600 px-4 py-1 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
//                   >
//                     {t("delete")}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-sm text-gray-500">
//               {t("noSpecificResourcesFound")}
//             </div>
//           )}
//         </div>

//         {/* AVAILABILITY LIST */}
//         <div className="mt-6 border border-violet-600 rounded-md p-3 bg-gray-50">
//           {loadingAvail ? (
//             <div className="text-sm text-gray-500">
//               {t("loadingAvailabilities")}
//             </div>
//           ) : availabilities.length ? (
//             <div className="space-y-2">
//               {availabilities.map((a) => (
//                 <div
//                   key={a.id}
//                   className="flex items-center justify-between bg-white p-2 rounded-md border border-violet-600"
//                 >
//                   <div className="text-sm text-gray-700">
//                     <div className="font-medium">
//                       {a.Category ? a.Category.name : t("categoryLabel")} —{" "}
//                       {
//                         ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
//                           a.weekday
//                         ]
//                       }
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {a.startTime} — {a.endTime}{" "}
//                       {a.slotDurationMinutes
//                         ? `· ${a.slotDurationMinutes}m slots`
//                         : ""}
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleEditClick(a)}
//                       className="text-sm text-violet-600 px-5 py-1 border border-violet-200 rounded-md hover:bg-violet-50 transition-colors"
//                     >
//                       {t("update")}
//                     </button>
//                     <button
//                       onClick={() => handleDeleteAvailability(a.id)}
//                       className="text-sm text-red-600 px-4 py-1 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
//                     >
//                       {t("delete")}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-sm text-gray-500">
//               {t("noSpecificResourcesFound")}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Resources;

import React, { useState, useEffect, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../contexts/AuthContext";
import { useLocalization } from "../../contexts/LocalizationContext";
import {
  CalendarDays,
  Clock,
  Plus,
  List,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Edit2,
  Trash2,
} from "lucide-react";

import api from "../../services/api";

// --- SUB-COMPONENT: EDIT MODAL ---
const EditResourceModal = ({
  isOpen,
  onClose,
  resource,
  onSave,
  t,
  weekdayMap,
}) => {
  const [name, setName] = useState("");
  const [availabilities, setAvailabilities] = useState([]);

  useEffect(() => {
    if (resource) {
      setName(resource.name || "");
      setAvailabilities(resource.availabilities || []);
    }
  }, [resource]);

  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-violet-50">
          <h3 className="text-xl font-bold text-violet-900">
            {t("editResource")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t("resourceName")}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-violet-600 rounded focus:ring-2 focus:ring-violet-200 outline-none"
            />
          </div>

          <div>
            <h4 className="text-md font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar size={18} /> {t("weeklyAvailabilities")}
            </h4>
            <div className="space-y-3">
              {availabilities.length > 0 ? (
                availabilities.map((avail) => (
                  <div
                    key={avail.id}
                    className="p-3 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-2 md:grid-cols-4 gap-3 items-center"
                  >
                    <div>
                      <span className="text-xs text-gray-500 block">
                        {t("day")}
                      </span>
                      <span className="font-medium text-sm">
                        {weekdayMap[avail.weekday]}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">
                        {t("time")}
                      </span>
                      <span className="font-medium text-sm">
                        {avail.startTime} - {avail.endTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">
                        {t("duration")}
                      </span>
                      <span className="font-medium text-sm">
                        {avail.slotDurationMinutes}m
                      </span>
                    </div>
                    <div className="text-right">
                      {/* Future enhancement: individual slot deletion */}
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  {t("noAvailabilitiesSet")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={() => onSave(resource.id, { name })}
            className="px-6 py-2 bg-violet-600 text-white rounded font-medium hover:bg-violet-700 transition-colors"
          >
            {t("saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const Resources = () => {
  const { token } = useAuth() || {};
  const { t } = useLocalization();

  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [availabilities, setAvailabilities] = useState([]);
  const [loadingAvail, setLoadingAvail] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [resources, setResources] = useState([]);
  const [newResourceName, setNewResourceName] = useState("");
  const [resourceLoading, setResourceLoading] = useState(false);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const weekdayMap = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday",
  };

  const fetchResources = async () => {
    if (!token || !selectedBusinessId) return;
    try {
      const res = await api.getResource(token, selectedBusinessId);
      setResources(res || []);
    } catch (err) {
      console.error("fetchResources error:", err);
      setResources([]);
    }
  };

  const handleAddResource = async (e) => {
    e?.preventDefault();
    if (!token || !selectedBusinessId || !newResourceName.trim()) return;
    setResourceLoading(true);
    try {
      const resource = await api.createResource(token, selectedBusinessId, {
        name: newResourceName.trim(),
      });
      setResources((prev) => [...prev, resource]);
      setNewResourceName("");
      setSuccessMsg(t("resourceAdded"));
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.message || t("failedAddResource"));
    } finally {
      setResourceLoading(false);
    }
  };

  const openUpdateModal = (resource) => {
    setEditingResource(resource);
    setIsEditModalOpen(true);
  };

  const handleUpdateResource = async (id, data) => {
    if (!token || !data.name.trim()) return;
    try {
      await api.updateResource(token, id, data);
      setResources((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data } : r)),
      );
      setSuccessMsg(t("updatedSuccessfully"));
      setIsEditModalOpen(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.message || t("updateFailed"));
    }
  };

  const handleDeleteResource = async (id) => {
    if (!token || !selectedBusinessId) return;
    if (!window.confirm(t("confirmDeleteResource"))) return;
    try {
      await api.deleteResource(token, selectedBusinessId, id);
      setResources((prev) => prev.filter((r) => r.id !== id));
      setSuccessMsg(t("resourceDeleted"));
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.message || t("failedDeleteResource"));
    }
  };

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await api.listMyBusinesses(token);
        const arr = Array.isArray(res) ? res : res?.businesses || [];
        const normalized = arr.map((b) => (b.business ? b.business : b));
        setBusinesses(normalized);
        if (normalized.length) setSelectedBusinessId(normalized[0].id);
      } catch (e) {
        console.error("loadBusinesses", e);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!token || !selectedBusinessId) return;
    (async () => {
      try {
        const res = await api.listBusinessCategories(token, selectedBusinessId);
        setCategories(res?.categories || []);
        fetchResources();
      } catch (e) {
        console.error("loadInitialData", e);
      }
    })();
  }, [token, selectedBusinessId]);

  return (
    <div className="space-y-8 p-4 md:p-6">
      <h2 className="text-2xl font-bold">{t("myResources")}</h2>

      <div className="bg-white p-6 rounded-xl border border-violet-600 shadow">
        {/* RESOURCE FORM */}
        <form
          onSubmit={handleAddResource}
          className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-4"
        >
          <div className="md:col-span-5">
            <input
              value={newResourceName}
              onChange={(e) => setNewResourceName(e.target.value)}
              placeholder={t("resourceName")}
              className="w-full p-2 border border-violet-600 rounded"
            />
          </div>
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              disabled={resourceLoading}
              className="px-4 py-2 bg-violet-600 text-white rounded font-medium hover:bg-violet-700 transition-colors"
            >
              {/* <Plus size={18} />{" "} */}
              {resourceLoading ? t("adding") : t("addResource")}
            </button>
          </div>
        </form>

        {(successMsg || errorMsg) && (
          <div className="mb-3">
            {successMsg && (
              <div className="bg-green-50 border border-green-200 p-2 rounded text-sm text-green-700">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 p-2 rounded text-sm text-red-700">
                {errorMsg}
              </div>
            )}
          </div>
        )}

        {/* RESOURCE LIST */}
        {/* <div className="border border-violet-600 rounded-md p-3 bg-gray-50">
          {resources.length ? (
            <div className="space-y-2">
              {resources.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between bg-white p-3 rounded-md border border-violet-600"
                >
                  <div>
                    <span className="font-semibold text-gray-800">
                      {r.name}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {r.name}
                    </span>
                    <p className="text-xs text-gray-500">
                      {r.availabilities?.length || 0} {t("availabilities")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openUpdateModal(r)}
                      className="flex items-center gap-1 text-violet-600 px-3 py-1 border border-violet-200 rounded-md hover:bg-violet-50 transition-colors"
                    >
                      <Edit2 size={14} /> {t("edit")}
                    </button>
                    <button
                      onClick={() => handleDeleteResource(r.id)}
                      className="flex items-center gap-1 text-red-600 px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} /> {t("delete")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              {t("noSpecificResourcesFound")}
            </div>
          )}
        </div> */}

        {/* RESOURCE LIST */}
        <div className="border border-violet-600 rounded-md p-3 bg-gray-50">
          {resources.length ? (
            <div className="space-y-2">
              {resources.map((r) => {
                // Map availabilities to weekday numbers for this resource
                const activeWeekdays =
                  r.availabilities?.map((a) => a.weekday) || [];

                // Short labels for weekdays
                const weekdayLabels = [
                  { num: 1, label: "M" },
                  { num: 2, label: "T" },
                  { num: 3, label: "W" },
                  { num: 4, label: "T" },
                  { num: 5, label: "F" },
                  { num: 6, label: "S" },
                  { num: 7, label: "S" },
                ];

                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between bg-white p-3 rounded-md border border-violet-600"
                  >
                    {/* Name + Weekdays */}
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-800 w-40 truncate">
                        {r.name}
                      </span>

                      <div className="flex gap-1">
                        {weekdayLabels.map((d) => (
                          <div
                            key={d.num}
                            className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border ${
                              activeWeekdays.includes(d.num)
                                ? "bg-violet-600 text-white border-violet-600"
                                : "bg-gray-100 text-gray-400 border-gray-300"
                            }`}
                          >
                            {d.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openUpdateModal(r)}
                        className="flex items-center gap-1 text-violet-600 px-3 py-1 border border-violet-200 rounded-md hover:bg-violet-50 transition-colors"
                      >
                        <Edit2 size={14} /> {t("edit")}
                      </button>
                      <button
                        onClick={() => handleDeleteResource(r.id)}
                        className="flex items-center gap-1 text-red-600 px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} /> {t("delete")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              {t("noSpecificResourcesFound")}
            </div>
          )}
        </div>
      </div>

      {/* UPDATE MODAL */}
      <EditResourceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        resource={editingResource}
        onSave={handleUpdateResource}
        t={t}
        weekdayMap={weekdayMap}
      />
    </div>
  );
};

export default Resources;
