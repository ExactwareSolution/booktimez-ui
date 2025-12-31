import { Navigate } from "react-router-dom";

const DashboardIndexRedirect = () => {
  const authData = localStorage.getItem("btz_auth");

  if (!authData) {
    return <Navigate to="/login" replace />;
  }

  try {
    const auth = JSON.parse(authData);
    const role = auth?.user?.role;
    const isBusinessAvailable = auth?.isBusinessAvailable;
    console.log("role:", role);
    console.log("auth:", auth);
    console.log("isBusinessAvailable:", isBusinessAvailable);

    // ✅ Admin → admin dashboard
    if (role === "admin") {
      return <Navigate to="overview" replace />;
    }

    // 👤 Owner without business
    if (!isBusinessAvailable) {
      return <Navigate to="create-business" replace />;
    }

    // 👤 Owner with business
    return <Navigate to="bookings" replace />;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
};

export default DashboardIndexRedirect;
