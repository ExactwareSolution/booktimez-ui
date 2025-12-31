import React, { useState, useEffect } from "react";
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
} from "lucide-react";

// NOTE: Tailwind JIT does not support string interpolation for classes.
// We must use the full class names directly.
const PRIMARY_COLOR_CLASS = "text-violet-600";
const PRIMARY_COLOR_BORDER = "border-violet-600";
const HOVER_BG_CLASS = "hover:bg-violet-50";

// --- Custom Calendar Helpers (Unchanged) ---
const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = firstDayOfMonth.getDay();
  const days = [];
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  for (let i = startDay === 0 ? 6 : startDay - 1; i > 0; i--) {
    days.push({
      date: prevMonthLastDay - i + 1,
      currentMonth: false,
      time: "8:00am - 8:00pm",
    });
  }
  for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
    days.push({ date: d, currentMonth: true, time: "8:00am - 8:00pm" });
  }
  const totalCells = days.length;
  for (let i = 1; i <= 42 - totalCells; i++) {
    days.push({ date: i, currentMonth: false, time: "8:00am - 8:00pm" });
  }

  return days.slice(0, 42);
};
const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// --- Availability Component ---

const Availability = () => {
  const { token } = useAuth() || {};
  const { t } = useLocalization();
  // owner businesses and availabilities
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [weekday, setWeekday] = useState(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(30);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadBusinesses() {
      try {
        if (!token) return;
        const res = await (
          await import("../../services/api")
        ).listMyBusinesses(token);
        const arr = Array.isArray(res) ? res : res?.businesses || [];
        const normalized = arr.map((b) => (b.business ? b.business : b));
        setBusinesses(normalized);
        if (normalized.length > 0) setSelectedBusinessId(normalized[0].id);
      } catch (e) {
        console.error("loadBusinesses", e);
      }
    }
    loadBusinesses();
  }, [token]);

  // load categories for selected business
  useEffect(() => {
    async function loadCategories() {
      if (!token || !selectedBusinessId) return;
      try {
        const res = await (
          await import("../../services/api")
        ).listBusinessCategories(token, selectedBusinessId);
        const arr = res && res.categories ? res.categories : [];
        setCategories(arr);
        if (arr && arr.length && !selectedCategoryId)
          setSelectedCategoryId(arr[0].id);
      } catch (e) {
        console.error("loadCategories", e);
        setCategories([]);
      }
    }
    loadCategories();
  }, [token, selectedBusinessId]);

  useEffect(() => {
    async function loadAvail() {
      if (!token || !selectedBusinessId) return;
      setLoadingAvail(true);
      try {
        const res = await (
          await import("../../services/api")
        ).listBusinessAvailabilities(token, selectedBusinessId);
        const items = res && res.availabilities ? res.availabilities : [];
        setAvailabilities(items);
      } catch (e) {
        console.error("loadAvailabilities", e);
        setAvailabilities([]);
      }
      setLoadingAvail(false);
    }
    loadAvail();
  }, [token, selectedBusinessId]);

  const handleDeleteAvailability = async (id) => {
    if (!token || !selectedBusinessId) return;
    try {
      const res = await (
        await import("../../services/api")
      ).deleteAvailability(token, selectedBusinessId, id);
      if (res && res.success) {
        setAvailabilities((a) => a.filter((x) => String(x.id) !== String(id)));
        setSuccessMsg(t("availabilityDeleted"));
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg((res && res.error) || t("failedDeleteAvailability"));
        setTimeout(() => setErrorMsg(""), 4000);
      }
    } catch (e) {
      console.error("deleteAvailability", e);
      setErrorMsg(t("failedDeleteAvailability"));
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  const doCreateAvailability = async (e) => {
    e && e.preventDefault && e.preventDefault();
    if (!token || !selectedBusinessId)
      return alert(t("selectOrCreateBusinessFirst"));
    const payload = {
      categoryId: selectedCategoryId || (categories[0] && categories[0].id),
      weekday: Number(weekday),
      startTime,
      endTime,
      slotDurationMinutes: Number(slotDurationMinutes) || undefined,
    };
    try {
      const res = await (
        await import("../../services/api")
      ).createAvailability(token, selectedBusinessId, payload);
      if (res && res.error) {
        setErrorMsg(res.error || t("failedCreateAvailability"));
        setTimeout(() => setErrorMsg(""), 4000);
      } else {
        setSuccessMsg(t("availabilitySaved"));
        setTimeout(() => setSuccessMsg(""), 3000);
        // refresh list
        const listRes = await (
          await import("../../services/api")
        ).listBusinessAvailabilities(token, selectedBusinessId);
        setAvailabilities(
          listRes && listRes.availabilities ? listRes.availabilities : []
        );
      }
    } catch (err) {
      console.error("createAvailability", err);
      setErrorMsg("Failed to create availability");
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };
  // FIX 1: Initial state uses 24-hour format ("HH:MM") for <input type="time"> compatibility
  const [weeklyHours, setWeeklyHours] = useState([
    { day: "M", active: true, slots: [{ start: "09:00", end: "17:00" }] },
    { day: "T", active: true, slots: [{ start: "09:00", end: "17:00" }] },
    { day: "W", active: true, slots: [{ start: "09:00", end: "17:00" }] },
    { day: "T", active: true, slots: [{ start: "09:00", end: "17:00" }] },
    { day: "F", active: true, slots: [{ start: "09:00", end: "17:00" }] },
    { day: "S", active: false, slots: [{ start: "09:00", end: "17:00" }] },
    { day: "S", active: false, slots: [{ start: "09:00", end: "17:00" }] },
  ]);

  const [calendarMode, setCalendarMode] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // --- Handlers ---
  const toggleDayActive = (dayIndex) => {
    const newHours = [...weeklyHours];
    newHours[dayIndex].active = !newHours[dayIndex].active;
    setWeeklyHours(newHours);
  };

  // New slots use the 24-hour format
  const addTimeSlot = (dayIndex) => {
    const newHours = [...weeklyHours];
    newHours[dayIndex].slots.push({ start: "12:00", end: "13:00" });
    setWeeklyHours(newHours);
  };

  const removeTimeSlot = (dayIndex, slotIndex) => {
    const newHours = [...weeklyHours];
    if (newHours[dayIndex].slots.length > 1) {
      newHours[dayIndex].slots.splice(slotIndex, 1);
      setWeeklyHours(newHours);
    } else {
      // If only one slot remains, toggle the day off instead of removing the last slot
      toggleDayActive(dayIndex);
    }
  };

  // FIX 2: updateTimeSlot handler is clean for direct time input values
  const updateTimeSlot = (dayIndex, slotIndex, field, value) => {
    const newHours = [...weeklyHours];
    newHours[dayIndex].slots[slotIndex][field] = value;
    setWeeklyHours(newHours);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };
  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };
  const calendarDays = getDaysInMonth(currentMonth);

  return (
    <div className="space-y-8 p-4 md:p-6 ">
      <h2 className="text-2xl font-bold text-gray-900">
        {t("availabilitySchedules")}
      </h2>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md  border border-violet-600">
        {/* Business selector & Availabilities list */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                {t("manageAvailabilities")}
              </h4>
              <p className="text-xs text-gray-500">{t("manageAvailDesc")}</p>
            </div>
            <div>
              {businesses.length > 0 ? (
                <select
                  value={selectedBusinessId || ""}
                  onChange={(e) => setSelectedBusinessId(e.target.value)}
                  className="px-3 py-2 border border-violet-600 rounded-md text-sm"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name || b.slug || b.id}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-sm text-gray-500">
                  {t("noBusinessesFound")}
                </span>
              )}
            </div>
          </div>

          <form
            onSubmit={doCreateAvailability}
            className="mb-3 grid grid-cols-1 md:grid-cols-6 gap-2 items-end"
          >
            {/* Inline messages */}
            {(successMsg || errorMsg) && (
              <div className="md:col-span-6">
                {successMsg && (
                  <div className="mb-2 px-3 py-2 rounded text-sm bg-green-50 text-green-800 border border-green-100">
                    {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div className="mb-2 px-3 py-2 rounded text-sm bg-red-50 text-red-800 border border-red-100">
                    {errorMsg}
                  </div>
                )}
              </div>
            )}
            <div className="md:col-span-1">
              <label className="text-xs text-gray-600">{t("day")}</label>
              <select
                className="w-full p-2 border border-violet-600 rounded"
                value={weekday}
                onChange={(e) => setWeekday(e.target.value)}
              >
                <option value={0}>{t("sunday")}</option>
                <option value={1}>{t("monday")}</option>
                <option value={2}>{t("tuesday")}</option>
                <option value={3}>{t("wednesday")}</option>
                <option value={4}>{t("thursday")}</option>
                <option value={5}>{t("friday")}</option>
                <option value={6}>{t("saturday")}</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-600">
                {t("categoryLabel")}
              </label>
              <select
                className="w-full p-2 border border-violet-600 rounded"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                {categories && categories.length ? (
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <option value="">{t("noBusinessesFound")}</option>
                )}
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="text-xs text-gray-600">
                {t("startLabelShort")}
              </label>
              <input
                type="time"
                className="w-full p-2 border border-violet-600 rounded"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="md:col-span-1">
              <label className="text-xs text-gray-600">
                {t("endLabelShort")}
              </label>
              <input
                type="time"
                className="w-full p-2 border border-violet-600 rounded"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="md:col-span-1">
              <label className="text-xs text-gray-600">{t("slotMin")}</label>
              <input
                type="number"
                min={1}
                className="w-full p-2 border border-violet-600 rounded"
                value={slotDurationMinutes}
                onChange={(e) => setSlotDurationMinutes(e.target.value)}
              />
            </div>

            <div className="md:col-span-6 text-right">
              <button className="mt-1 px-3 py-1 bg-violet-600 border border-violet-600 text-white rounded">
                {t("addAvailability")}
              </button>
            </div>
          </form>

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
                    <div>
                      <button
                        onClick={() => handleDeleteAvailability(a.id)}
                        className="text-sm text-red-600 px-3 py-1 border border-red-200 rounded-md hover:bg-red-50"
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 ">
                {t("noSpecificAvailabilities")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;
