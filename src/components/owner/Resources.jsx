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
} from "lucide-react";

import api from "../../services/api";

const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = firstDayOfMonth.getDay();
  const days = [];
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  for (let i = startDay === 0 ? 6 : startDay - 1; i > 0; i--) {
    days.push({ date: prevMonthLastDay - i + 1, currentMonth: false });
  }
  for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
    days.push({ date: d, currentMonth: true });
  }
  while (days.length < 42) {
    days.push({ date: days.length + 1, currentMonth: false });
  }
  return days;
};

const Resources = () => {
  const { token } = useAuth() || {};
  const { t } = useLocalization();

  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [availabilities, setAvailabilities] = useState([]);
  const [loadingAvail, setLoadingAvail] = useState(false);

  const [weekday, setWeekday] = useState(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(30);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [resources, setResources] = useState([]);
  const [selectedResourceIds, setSelectedResourceIds] = useState([]);
  const [newResourceName, setNewResourceName] = useState("");
  const [resourceLoading, setResourceLoading] = useState(false);
  const [showResourceDropdown, setShowResourceDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  // Define weekdaysMap for the modal dropdown
  const weekdaysMap = [
    t("sunday"),
    t("monday"),
    t("tuesday"),
    t("wednesday"),
    t("thursday"),
    t("friday"),
    t("saturday"),
  ];

  const handleEditClick = (slot) => {
    setEditingSlot(slot);
    setIsEditModalOpen(true);
  };

  const fetchAvailabilities = async () => {
    if (!token || !selectedBusinessId) return;
    setLoadingAvail(true);
    try {
      const aRes = await api.listBusinessAvailabilities(
        token,
        selectedBusinessId
      );
      if (aRes && aRes.availabilities) {
        setAvailabilities(aRes.availabilities);
      } else if (Array.isArray(aRes)) {
        setAvailabilities(aRes);
      } else {
        setAvailabilities([]);
      }
      if (aRes?.resources) {
        setResources(aRes.resources);
      }
    } catch (e) {
      console.error("fetchAvailabilities Error:", e);
      setAvailabilities([]);
    } finally {
      setLoadingAvail(false);
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
        const arr = res?.categories || [];
        setCategories(arr);
        if (arr.length && !selectedCategoryId) setSelectedCategoryId(arr[0].id);

        const rRes = await api.listBusinessResources(token, selectedBusinessId);
        setResources(rRes || []);

        fetchAvailabilities();
      } catch (e) {
        console.error("loadInitialData", e);
      }
    })();
  }, [token, selectedBusinessId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowResourceDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleResource = (id) => {
    const idStr = String(id);
    setSelectedResourceIds((prev) =>
      prev.includes(idStr) ? prev.filter((i) => i !== idStr) : [...prev, idStr]
    );
  };

  const handleAddResource = async (e) => {
    e?.preventDefault();
    if (!token || !selectedBusinessId || !newResourceName.trim()) return;
    setResourceLoading(true);
    setErrorMsg("");
    try {
      const resource = await api.createResource(token, selectedBusinessId, {
        name: newResourceName.trim(),
      });
      if (!resource || !resource.id) throw new Error(t("failedAddResource"));
      setResources((prev) => [...prev, resource]);
      setSelectedResourceIds((prev) => [...prev, String(resource.id)]);
      setNewResourceName("");
      setSuccessMsg(t("resourceAdded"));
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.message || t("failedAddResource"));
    } finally {
      setResourceLoading(false);
    }
  };

  const doCreateAvailability = async (e) => {
    e?.preventDefault();
    if (!token || !selectedBusinessId) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.createAvailability(token, selectedBusinessId, {
        categoryId: selectedCategoryId,
        resourceIds: selectedResourceIds.length
          ? selectedResourceIds
          : undefined,
        weekday: Number(weekday),
        startTime,
        endTime,
        slotDurationMinutes: Number(slotDurationMinutes),
      });
      setSuccessMsg(t("availabilitySaved"));
      await fetchAvailabilities();
      setSelectedResourceIds([]);
    } catch (err) {
      setErrorMsg(err.message || t("failedCreateAvailability"));
    } finally {
      setTimeout(() => {
        setErrorMsg("");
        setSuccessMsg("");
      }, 4000);
    }
  };

  const handleDeleteAvailability = async (availabilityId) => {
    if (!token || !selectedBusinessId) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      await api.deleteAvailability(token, selectedBusinessId, availabilityId);

      // Update state locally for instant UI feedback
      setAvailabilities((prev) => prev.filter((a) => a.id !== availabilityId));

      setSuccessMsg(t("availabilityDeleted"));
    } catch (err) {
      console.error("deleteAvailability error:", err);
      setErrorMsg(t("failedDeleteAvailability"));
    } finally {
      setTimeout(() => {
        setErrorMsg("");
        setSuccessMsg("");
      }, 3000);
    }
  };

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

        {/* LIST SECTION */}
        <div className="border border-violet-600 rounded-md p-3 bg-gray-50">
          {loadingAvail ? (
            <div className="text-sm text-gray-500">
              {t("loadingAvailabilities")}
            </div>
          ) : availabilities.length ? (
            <div className="space-y-2">
              {availabilities.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between bg-white p-2 rounded-md border border-violet-600"
                >
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">
                      {a.Category ? a.Category.name : t("categoryLabel")} —{" "}
                      {
                        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                          a.weekday
                        ]
                      }
                    </div>
                    <div className="text-xs text-gray-500">
                      {a.startTime} — {a.endTime}{" "}
                      {a.slotDurationMinutes
                        ? `· ${a.slotDurationMinutes}m slots`
                        : ""}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(a)}
                      className="text-sm text-violet-600 px-5 py-1 border border-violet-200 rounded-md hover:bg-violet-50 transition-colors"
                    >
                      {t("update")}
                    </button>
                    <button
                      onClick={() => handleDeleteAvailability(a.id)}
                      className="text-sm text-red-600 px-4 py-1 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                    >
                      {t("delete")}
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
        </div>
      </div>

      {/* UPDATE MODAL - Moved inside the return, kept your UI */}
      {isEditModalOpen && editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-violet-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {t("updateSlot")}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await api.updateAvailability(
                    token,
                    selectedBusinessId,
                    editingSlot.id,
                    {
                      weekday: Number(editingSlot.weekday),
                      startTime: editingSlot.startTime,
                      endTime: editingSlot.endTime,
                      slotDurationMinutes: Number(
                        editingSlot.slotDurationMinutes
                      ),
                    }
                  );
                  setSuccessMsg(t("updatedSuccessfully"));
                  setIsEditModalOpen(false);
                  fetchAvailabilities();
                } catch (err) {
                  setErrorMsg(t("updateFailed"));
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("weekday")}
                </label>
                <select
                  value={editingSlot.weekday}
                  onChange={(e) =>
                    setEditingSlot({ ...editingSlot, weekday: e.target.value })
                  }
                  className="w-full p-2 border border-violet-300 rounded-md focus:ring-2 focus:ring-violet-500 outline-none"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                    <option key={d} value={d}>
                      {weekdaysMap[d]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("startTime")}
                  </label>
                  <input
                    type="time"
                    value={editingSlot.startTime}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-violet-300 rounded-md outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("endTime")}
                  </label>
                  <input
                    type="time"
                    value={editingSlot.endTime}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-violet-300 rounded-md outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("slotDuration")}
                </label>
                <input
                  type="number"
                  value={editingSlot.slotDurationMinutes}
                  onChange={(e) =>
                    setEditingSlot({
                      ...editingSlot,
                      slotDurationMinutes: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-violet-300 rounded-md outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 shadow-md"
                >
                  {t("saveChanges")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
