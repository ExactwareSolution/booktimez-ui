import React, { useState, useEffect } from "react";
// Import useSearchParams from react-router-dom
import {
  Outlet,
  NavLink,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import bg from "../../assets/bg.png";

import {
  Calendar,
  Settings,
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  Zap,
  Clock3,
  DollarSign,
  CalendarCheck,
  BriefcaseBusiness,
  Bell,
  User,
} from "lucide-react";
import { GrPlan } from "react-icons/gr";
import { BiCategoryAlt } from "react-icons/bi";

// Import the UpgradeModal component
import UpgradeModal from "./UpgradeModal";

// Tailwind-safe static classes
const PRIMARY_COLOR = "text-violet-600";
const BORDER_PRIMARY = "border-violet-600";
const HOVER_BG = "hover:bg-violet-50";
const ACTIVE_BG = "bg-violet-100";
const ACTIVE_TEXT = "text-violet-700";
const PLAN_BG = "bg-yellow-100"; // Light yellow for fixed plan button
const PLAN_TEXT = "text-gray-700";

export default function DashboardLayout() {
  const { user, logout, token } = useAuth();

  console.log(user);
  const navigate = useNavigate();

  // 1. Use useSearchParams to control modal visibility based on URL
  const [searchParams, setSearchParams] = useSearchParams();
  const isUpgradeModalOpen = searchParams.get("planSelection") === "true";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [businessName, setBusinessName] = useState(null);

  // Fetch business name (Logic unchanged)
  useEffect(() => {
    async function loadBusiness() {
      if (!token) return;

      try {
        // NOTE: Placeholder fetch logic kept as provided by the user
        const res = await fetch(
          `${
            import.meta.env.VITE_API_BASE ||
            "https://zd4hf92j-5000.inc1.devtunnels.ms/api"
          }/business`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        if (data?.businesses?.length) {
          const first = data.businesses[0].business || data.businesses[0];
          setBusinessName(first.name || first.slug);
        }
      } catch (e) {}
    }

    loadBusiness();
  }, [token]);

  // User Initial (Logic unchanged)
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "U");
  const userInitial = getInitial(user?.name);

  const role = user?.role || "owner";

  // Sidebar links (Logic unchanged)
  const baseLinks = [
    { to: "/dashboard/bookings", label: "Bookings", icon: Clock3 },
    { to: "/dashboard/availability", label: "Availability", icon: Calendar },
    {
      to: "/dashboard/appointments",
      label: "Appointments",
      icon: CalendarCheck,
    },
  ];

  const ownerLinks = [
    ...baseLinks,
    { to: "/dashboard/business", label: "Business", icon: BriefcaseBusiness },
    { to: "/dashboard/resources", label: "Resources", icon: User },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const adminLinks = [
    {
      to: "/dashboard/overview",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    { to: "/dashboard/users", label: "Users", icon: Users },
    { to: "/dashboard/plans", label: "Plans", icon: GrPlan },
    { to: "/dashboard/category", label: "Category", icon: BiCategoryAlt },
    { to: "/dashboard/payments", label: "Payments", icon: DollarSign },
  ];

  const links = role === "admin" ? adminLinks : ownerLinks;

  // Sidebar link class (Logic unchanged)
  const navLinkClass = (isActive) =>
    `flex items-center w-full text-sm font-medium rounded-lg mt-2 transition-all
    ${sidebarOpen ? "justify-start px-3 py-2.5" : "justify-center py-3.5"}
    ${
      isActive
        ? `${ACTIVE_BG} ${ACTIVE_TEXT}`
        : `text-gray-600 hover:text-violet-600 hover:bg-violet-50`
    }`;

  const buttonBase =
    "flex items-center text-sm font-medium w-full rounded-lg transition-colors duration-200";

  // Calculate the margin and width for the main content and header (Logic unchanged)
  const sidebarWidthClass = sidebarOpen ? "w-64" : "w-20";
  const mainContentMargin = sidebarOpen ? "ml-64" : "ml-20";

  // 2. Handler to open the modal by adding the search param
  const handleUpgradeClick = () => {
    setSearchParams({ planSelection: "true" });
    // You might also want to ensure the user is on a relevant page if needed, e.g.:
    // if (window.location.pathname !== '/dashboard/availability/schedules') {
    //   navigate('/dashboard/availability/schedules?planSelection=true');
    // } else {
    //   setSearchParams({ planSelection: 'true' });
    // }
  };

  const handleNotificationClick = () => {
    // Placeholder for notification click handling
    alert("Notifications clicked!");
  };

  // 3. Handler to close the modal by removing the search param
  const handleCloseModal = () => {
    // Remove the specific parameter, keeping others if they exist
    searchParams.delete("planSelection");
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ================= FIXED SIDEBAR ================= */}
      <aside
        className={`${sidebarWidthClass} bg-white border-r border-gray-200 shadow-lg flex flex-col transition-all duration-300 z-30 fixed h-full top-0 left-0`}
      >
        {/* TOP SECTION (Unchanged) */}
        <div className="relative flex items-center h-16 px-4 border-b border-gray-100 flex-shrink-0">
          <div
            className={`overflow-hidden transition-all duration-300 ${
              sidebarOpen ? "w-full opacity-100" : "w-0 opacity-0"
            } flex justify-center`}
          >
            <h1 className="text-xl font-bold text-black">BookTimez</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`absolute p-2 rounded-full text-gray-500 hover:text-violet-600 transition-colors
            ${sidebarOpen ? "right-4" : "left-1/2 transform -translate-x-1/2"}`}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* NAVIGATION LINKS (Unchanged) */}
        <nav className="flex flex-col flex-1 p-3 overflow-y-auto">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => navLinkClass(isActive)}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className={`w-6 h-6 ${sidebarOpen ? "mr-3" : ""}`} />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* ================= BOTTOM SECTION ================= */}
        <div className="p-4 border-t border-gray-100 w-full space-y-2 flex-shrink-0">
          {/* PLAN / UPGRADE BUTTON */}
          {role !== "admin" && (
            <div className="py-2.5 flex items-center justify-center">
              {sidebarOpen ? (
                <button
                  onClick={handleUpgradeClick}
                  className={`flex items-center justify-between w-full
          py-2 px-3 rounded-lg text-gray-800
          hover:bg-green-100 active:bg-green-200 transition-colors`}
                >
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="text-sm font-semibold truncate">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user?.planCode || "Free"}
                    </span>
                  </div>
                  <DollarSign className="w-4 h-4 text-yellow-500" />
                </button>
              ) : (
                <button
                  onClick={handleUpgradeClick}
                  className={`flex items-center justify-center w-full py-3.5 rounded-lg ${PLAN_BG} hover:bg-yellow-200 transition-colors`}
                  title="Upgrade Plan"
                >
                  <DollarSign className={`w-6 h-6 ${PLAN_TEXT}`} />
                </button>
              )}
            </div>
          )}

          {/* LOGOUT – always visible */}
          <button
            onClick={logout}
            className={`${buttonBase} ${
              sidebarOpen
                ? "justify-start px-3 py-2.5"
                : "justify-center py-2.5"
            } text-red-500 hover:bg-red-50`}
          >
            <LogOut className={`w-6 h-6 ${sidebarOpen ? "mr-3" : ""}`} />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div
        className={`flex-1 transition-all duration-300 ${mainContentMargin}`}
      >
        {/* FIXED HEADER (Unchanged) */}
        <header
          className={`h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm z-20
          fixed top-0 right-0 transition-all duration-300 ${
            sidebarOpen ? "left-64" : "left-20"
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-800">
            {businessName || "Dashboard"}
          </h2>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleNotificationClick}
                className={`px-4 py-1.5 text-sm font-semibold  flex items-center gap-1 transition-colors `}
              >
                <Bell className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            {/* UPGRADE BUTTON (Using handleUpgradeClick) */}
            {role !== "admin" && (
              <button
                onClick={handleUpgradeClick}
                className={`px-4 py-1.5 text-sm font-semibold border rounded-full flex items-center gap-1 transition-colors ${PRIMARY_COLOR} ${BORDER_PRIMARY} ${HOVER_BG}`}
              >
                <Zap className="w-4 h-4" />
                Upgrade
              </button>
            )}
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT (Unchanged) */}
        <main
          className="pt-20 p-8 h-screen "
          style={{
            backgroundImage: `url(${bg})`,
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* ================= FULL PAGE UPGRADE MODAL ================= */}
      {/* The modal is rendered when the URL contains ?planSelection=true */}
      {isUpgradeModalOpen && <UpgradeModal onClose={handleCloseModal} />}
    </div>
  );
}
