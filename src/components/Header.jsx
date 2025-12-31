import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLocalization } from "../contexts/LocalizationContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { t } = useLocalization();

  return (
    <header className="sticky top-0 z-30 bg-white text-black border-b border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="font-bold text-2xl">
          {t("appName")}
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-black">
            {t("home")}
          </Link>
          <Link to="/dashboard" className="text-black">
            {t("dashboard")}
          </Link>
          {user ? (
            <button onClick={logout} className="px-3 py-2 border rounded">
              {t("logout")}
            </button>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 border rounded">
                {t("login")}
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 bg-black text-white rounded"
              >
                {t("register")}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
