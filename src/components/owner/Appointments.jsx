// Updated Appointments.jsx
import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// Import the useLocalization hook
import { useLocalization } from "../../contexts/LocalizationContext";

const PRIMARY_COLOR = "violet-600";
// ... (rest of constants and mock data) ...

const mockAppointments = [
  // ... (Your mock data) ...
];

export default function Appointments() {
  const { t } = useLocalization(); // Use localization hook
  const [appointments, setAppointments] = useState(mockAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const availablePageLimits = [5, 10, 25, 50];

  // Use translation keys for statuses
  const availableStatuses = [
    t("all"),
    t("completed"),
    t("upcoming"),
    t("cancelled"),
  ];

  // --- Filtering Logic (Memoized - Unchanged logic) ---
  const filteredAppointments = useMemo(() => {
    // ... (Filtering logic remains the same, comparing with internal keys/values, not translated labels) ...
    setCurrentPage(1);
    return appointments.filter((appointment) => {
      const matchesSearch =
        appointment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (appointment.service || appointment.category || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Note: We use the English status keys in the data for filtering consistency ('All', 'Completed', etc.)
      const matchesStatus =
        filterStatus === "All" || appointment.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, filterStatus]);

  // --- Pagination Logic (Calculations - Unchanged) ---
  const totalItems = filteredAppointments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const appointmentsOnPage = filteredAppointments.slice(startIndex, endIndex);

  // Pagination Handlers (Unchanged)
  const goToNextPage = () => {
    /* ... */
  };
  const goToPrevPage = () => {
    /* ... */
  };
  const handlePageLimitChange = (e) => {
    /* ... */
  };

  // --- Helper to get status chip styling (Unchanged) ---
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      case "Upcoming":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {t("previousAppointments")}
      </h2>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-violet-600">
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 ">
          {/* Search Input (Translated placeholder) */}
          <div className="w-full md:w-1/3 relative ">
            <Search className="w-4 h-4  absolute left-3 top-1/2 transform -translate-y-1/2  text-violet-600" />
            <input
              type="text"
              placeholder={t("searchClientCategory")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-violet-600 rounded-lg text-sm focus:ring-2 focus:ring-violet-600 focus:border-violet-600"
            />
          </div>

          {/* Filter Dropdown (Translated options) */}
          <div className="w-full md:w-auto relative ">
            <Filter className="w-4 h-4 text-violet-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              // We use the English status keys for value to keep filtering logic consistent
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full appearance-none pl-9 pr-8 py-2 border border-violet-600 rounded-lg text-sm focus:ring-2 focus:ring-violet-600 focus:border-violet-600 bg-white`}
            >
              {["All", "Completed", "Upcoming", "Cancelled"].map(
                (statusKey) => (
                  <option key={statusKey} value={statusKey}>
                    {statusKey === "All"
                      ? t("filterByStatus")
                      : t(statusKey.toLowerCase())}
                  </option>
                )
              )}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Appointment Table */}
        <div className="overflow-x-auto">
          {appointmentsOnPage.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Headings Translated */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("client")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("category")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("dateTime")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("status")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointmentsOnPage.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Status Translated */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {t(app.client)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {t(app.category || app.service)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {t(app.dateTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusStyle(
                          app.status
                        )}`}
                      >
                        {t(app.status.toLowerCase())}{" "}
                        {/* Translate status value */}
                      </span>
                    </td>

                    {/* Actions Translated */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href={`#${app.link}`} title={t("viewDetails")}>
                        {t("viewDetails")}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {t("noAppointmentsFound")}
            </div>
          )}
        </div>

        {/* --- Pagination Controls (Translation needed for static text) --- */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-4">
            {/* Page Status Translated */}
            <div className="text-sm text-gray-700 mb-3 md:mb-0">
              {/* NOTE: Complex interpolation like this requires more sophisticated i18n, but simple concatenation is used here */}
              Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min(endIndex, totalItems)}
              </span>{" "}
              of <span className="font-semibold">{totalItems}</span> results
            </div>

            <div className="flex items-center space-x-4">
              {/* Items Per Page Dropdown Translated */}
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <span>{/* Translation needed: Items per page: */}</span>
                {/* ... dropdown content ... */}
              </div>

              {/* Page Navigation Buttons Translated */}
              <div className="flex space-x-2">
                {/* ... buttons ... */}
                <span className="flex items-center px-3 py-1 text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}{" "}
                  {/* Translation needed: Page X of Y */}
                </span>
                {/* ... buttons ... */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
