// Updated Appointments.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLocalization } from "../../contexts/LocalizationContext";
import api from "../../services/api";

const PRIMARY_COLOR = "violet-600";

export default function Appointments() {
  const { token } = useAuth();
  const { t } = useLocalization();
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const availablePageLimits = [5, 10, 25, 50];

  const availableStatuses = ["All", "booked", "cancelled", "completed"];

  // --- Fetch Appointments ---
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) return;

      try {
        // 1. Fetch all businesses for the user
        const businessesRes = await api.listMyBusinesses(token);
        const businesses = (businessesRes || []).map((b) => b.business || b);

        const allAppointments = [];

        // 2. Fetch appointments for each business
        await Promise.all(
          businesses.map(async (b) => {
            try {
              const apptsRes = await api.listBusinessAppointments(token, b.id);
              (apptsRes?.appointments || []).forEach((appt) =>
                allAppointments.push({
                  ...appt,
                  _bizId: b.id,
                  businessName: b.name,
                })
              );
            } catch (err) {
              console.error(
                `Error loading appointments for business ${b.id}:`,
                err
              );
            }
          })
        );

        // 3. Normalize appointments
        const normalized = allAppointments.map((a) => ({
          id: a.id,
          client: a.customerName || "Guest",
          category: a.category || a.service || "Service",
          dateTime: a.startAt,
          status: a.status || "Upcoming",
          link: `#${a.id}`,
          businessId: a._bizId,
          businessName: a.businessName,
        }));

        setAppointments(normalized);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [token]);

  // --- Filtering Logic ---
  const filteredAppointments = useMemo(() => {
    setCurrentPage(1);
    return appointments?.filter((appointment) => {
      const matchesSearch =
        appointment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (appointment.category || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "All" || appointment.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, filterStatus]);

  // --- Pagination Calculations ---
  const totalItems = filteredAppointments?.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const appointmentsOnPage = filteredAppointments?.slice(startIndex, endIndex);

  // --- Status Chip Styles ---
  const getStatusStyle = (status) => {
    switch (status) {
      case "booked":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      case "completed":
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
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="w-full md:w-1/3 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-600" />
            <input
              type="text"
              placeholder={t("searchClientCategory")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-violet-600 rounded-lg text-sm focus:ring-2 focus:ring-violet-600 focus:border-violet-600"
            />
          </div>

          <div className="w-full md:w-auto relative">
            <Filter className="w-4 h-4 text-violet-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full appearance-none pl-9 pr-8 py-2 border border-violet-600 rounded-lg text-sm focus:ring-2 focus:ring-violet-600 focus:border-violet-600 bg-white`}
            >
              {availableStatuses.map((statusKey) => (
                <option key={statusKey} value={statusKey}>
                  {statusKey === "All"
                    ? t("filterByStatus")
                    : t(statusKey.toLowerCase())}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto">
          {appointmentsOnPage.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
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
                        {t(app.status.toLowerCase())}
                      </span>
                    </td>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-700 mb-3 md:mb-0">
              {t("showing")}{" "}
              <span className="font-semibold">{startIndex + 1}</span> {t("to")}{" "}
              <span className="font-semibold">
                {Math.min(endIndex, totalItems)}
              </span>{" "}
              {t("of")} <span className="font-semibold">{totalItems}</span>{" "}
              {t("results")}
            </div>

            <div className="flex items-center space-x-4">
              {/* Items per page */}
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <span>{t("itemsPerPage")}</span>
                <select
                  value={itemsPerPage}
                  onChange={handlePageLimitChange}
                  className="ml-2 border border-violet-600 rounded-lg px-2 py-1 text-sm"
                >
                  {availablePageLimits.map((limit) => (
                    <option key={limit} value={limit}>
                      {limit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page Navigation */}
              <div className="flex space-x-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="flex items-center px-3 py-1 text-sm font-medium text-gray-700">
                  {t("page")} {currentPage} {t("of")} {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
