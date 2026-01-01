import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import ProtectedRoute from "./components/ProtectedRoute";

import DashboardLayout from "./components/owner/DashboardLayout";
import NavBar from "./components/NavBar";
import "./App.css";

import MyBookings from "./components/owner/MyBookings";
import Availability from "./components/owner/Availability";
import Appointments from "./components/owner/Appointments";
import Settings from "./components/owner/Settings";
import CreateBusiness from "./components/owner/CreateBusiness";

import AdminDashboard from "./components/admin/AdminDashboard";
import Users from "./components/admin/Users";
import Plans from "./components/admin/Plans";
import Category from "./components/admin/Category";
import DashboardIndexRedirect from "./components/DashboardIndexRedirect";
import Payments from "./components/admin/Payments";
import MyBusiness from "./components/owner/MyBusiness";

function App() {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register", "/dashboard"];
  const shouldHideNavbar = hideNavbarRoutes.some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <>
      {!shouldHideNavbar && <NavBar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/business/:slug/:id" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard (Protected) */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardIndexRedirect />} />

          {/* Owner */}
          <Route path="create-business" element={<CreateBusiness />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="availability" element={<Availability />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="business" element={<MyBusiness />} />
          <Route path="settings" element={<Settings />} />

          {/* Admin */}
          <Route path="overview" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="plans" element={<Plans />} />
          <Route path="category" element={<Category />} />
          <Route path="payments" element={<Payments />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
