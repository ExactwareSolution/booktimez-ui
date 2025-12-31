import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLocalization } from "../../contexts/LocalizationContext";
import * as api from "../../services/api";
import {
  Link,
  Clipboard,
  CalendarDays,
  Clock,
  User,
  ExternalLink,
  ChevronDown,
  FileText,
  Filter,
  Search,
} from "lucide-react";

/* ---------------- Utils ---------------- */
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatTime = (date) =>
  new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const STATUS_STYLES = {
  booked: "bg-violet-100 text-violet-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

/* ---------------- Component ---------------- */
const MyBookings = () => {
  const { token } = useAuth();
  const { t } = useLocalization();
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const [copyMsgs, setCopyMsgs] = useState({});
  const [bookings, setBookings] = useState([]);

  /* UI State */
  const [activeTab, setActiveTab] = useState("upcoming");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* Pagination */
  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);

  /* ---------------- Load data ---------------- */
  /* ---------------- Load data ---------------- */
  useEffect(() => {
    async function load() {
      if (!token) return;

      try {
        // START LOADING HERE
        setLoading(true);
        const res = await api.listMyBusinesses(token);
        const normalized = (res || []).map((b) =>
          b.business ? b.business : b
        );
        setBusinesses(normalized);

        const map = {};
        const all = [];

        // Use map to create an array of promises for concurrent fetching
        await Promise.all(
          normalized.map(async (b) => {
            try {
              // 1. Fetch Categories/Services for this business
              const s = await api.listBusinessCategories(token, b.id);

              map[b.id] = s?.categories || [];

              // 2. Fetch Appointments for this business
              const a = await api.listBusinessAppointments(token, b.id);
              (a?.appointments || []).forEach((x) =>
                all.push({ ...x, _bizId: b.id })
              );
            } catch (err) {
              console.error(`Error loading data for business ${b.id}:`, err);
            }
          })
        );

        setServicesMap(map);

        const normalizedBookings = all.map((a) => {
          const cats = map[a._bizId] || [];
          const cat = cats.find((c) => String(c.id) === String(a.categoryId));

          return {
            id: a.id,
            clientName: a.customerName || "Guest",
            serviceName: cat?.name || "Service",
            startTime: a.startAt || a.start || a.date,
            phone: a.customerPhone || "N/A",
            status: a.status || "booked",
          };
        });

        setBookings(
          normalizedBookings.sort(
            (a, b) => new Date(a.startTime) - new Date(b.startTime)
          )
        );
      } catch (error) {
        console.error("Main load error:", error);
      } finally {
        setLoading(false); // STOP LOADING HERE (always runs)
      }
    }

    load();
  }, [token]);
  
  const ROOT_DOMAIN = import.meta.env.VITE_ROOT_DOMAIN;

  const isLocal = import.meta.env.VITE_ENV === "local";

  const buildPublicUrl = (biz) => {
    const protocol = isLocal ? "http" : "https";
    const port = isLocal ? ":5173" : "";

    return `${protocol}://${biz.slug}.${ROOT_DOMAIN}${port}/booking`;
  };

  // const buildPublicUrl = (biz) =>
  //   `${frontBase.replace(/\/$/, "")}/business/${biz.slug}/${biz.id}`;

  const handleCopy = async (bizId, url) => {
    await navigator.clipboard.writeText(url);
    setCopyMsgs((m) => ({ ...m, [bizId]: t("copied") }));
    setTimeout(() => setCopyMsgs((m) => ({ ...m, [bizId]: "" })), 2000);
  };

  /* ---------------- Filters ---------------- */
  const filteredBookings = useMemo(() => {
    let data = [...bookings];

    // Tab logic
    if (activeTab === "upcoming") {
      data = data.filter((b) => b.status === "booked");
    } else {
      data = data.filter((b) => b.status !== "booked");
    }

    // Status filter
    if (statusFilter !== "all") {
      data = data.filter((b) => b.status === statusFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (b) =>
          b.clientName.toLowerCase().includes(q) ||
          b.serviceName.toLowerCase().includes(q)
      );
    }

    setPage(1);
    return data;
  }, [bookings, activeTab, search, statusFilter]);

  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);

  const paginatedBookings = filteredBookings.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );

  /* ---------------- Render ---------------- */
  return (
    <div className="space-y-8 p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {t("bookingDashboard")}
      </h2>

      {/* ================= Booking Link Cards ================= */}
      {businesses.map((biz) => {
        const svcs = servicesMap[biz.id] || [];
        const publicUrl = buildPublicUrl(biz);

        return (
          <div
            key={biz.id}
            className="bg-white p-6 rounded-xl shadow-md border border-violet-600"
          >
            <div className="text-sm text-gray-500 flex items-center mb-2">
              <Link className="w-4 h-4 mr-2" />
              {t("bookingPageFor")} {biz.name || biz.slug}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-50 border border-violet-600 rounded-lg p-3">
              <input
                readOnly
                value={publicUrl}
                className="flex-1 h-10 px-3 text-sm rounded-md border bg-white text-violet-600 truncate"
              />

              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3 flex items-center text-sm border rounded-md text-violet-600 hover:bg-violet-50"
              >
                {t("open")} <ExternalLink className="w-4 h-4 ml-1" />
              </a>

              <button
                onClick={() => handleCopy(biz.id, publicUrl)}
                className="h-10 px-4 flex items-center text-sm font-semibold bg-violet-600 text-white rounded-md"
              >
                <Clipboard className="w-4 h-4 mr-2" />
                {t("copy")}
              </button>

              {copyMsgs[biz.id] && (
                <span className="text-sm text-green-600">
                  {copyMsgs[biz.id]}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {svcs.map((s) => (
                <span
                  key={s.id}
                  className="px-3 py-1 text-xs bg-gray-100 border rounded-full flex items-center"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        );
      })}

      {/* ================= BOOKINGS TABLE ================= */}
      <div className="bg-white rounded-xl shadow-md border border-violet-600 overflow-x-auto">
        {/* Header */}
        <div className="p-4 border-b  space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-4">
            {["upcoming", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-semibold capitalize ${
                  activeTab === tab
                    ? "text-violet-600 border-b-2 border-violet-600"
                    : "text-gray-500"
                }`}
              >
                {t(tab)} {t("bookingsLabel")}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="pl-9 pr-3 py-2 border border-violet-600 rounded-md text-sm"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-violet-600 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">{t("allStatus")}</option>
              <option value="booked">{t("booked")}</option>
              <option value="completed">{t("completed")}</option>
              <option value="cancelled">{t("cancelled")}</option>
            </select>

            <button className="flex items-center px-3 py-2 border border-violet-600 bg-violet-600 text-white rounded-md text-sm">
              <FileText className="w-4 h-4 mr-1" /> {t("export")}
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {t("serviceLabel")}
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {t("clientLabel")}
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {t("dateTimeLabel")}
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {t("phoneLabel")}
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {t("statusLabel")}
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {t("actionsLabel")}
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {paginatedBookings.length ? (
              paginatedBookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t last:border-b hover:bg-gray-50 transition-colors"
                >
                  {/* Service */}
                  <td className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {b.serviceName}
                  </td>

                  {/* Client */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      {/* <User className="w-4 h-4 text-gray-400" /> */}
                      <span className="font-medium">{b.clientName}</span>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {/* <CalendarDays className="w-4 h-4 text-gray-400" /> */}
                      <span>
                        {formatDate(b.startTime)} · {formatTime(b.startTime)}
                      </span>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-4 font-medium text-gray-700 whitespace-nowrap">
                    {b.phone || "—"}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        STATUS_STYLES[b.status]
                      }`}
                    >
                      {t(b.status)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    {b.status === "booked" ? (
                      <div className="inline-flex items-center gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-violet-600 border border-violet-600 rounded-md hover:bg-violet-50 transition">
                          {t("view")}
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50 transition">
                          {t("reschedule")}
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition">
                          {t("cancel")}
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-xs">
                        {t("noActions")}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-16 text-center text-gray-500 text-sm"
                >
                  {t("noBookingsFound")}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex justify-between items-center">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              {t("previous")}
            </button>

            <span className="text-sm text-gray-600">
              {t("pageText")} {page} {t("ofText")} {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
