import React, { useState } from "react";
import {
  User,
  Brush,
  Lock,
  Globe,
  Building2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useLocalization } from "../../contexts/LocalizationContext";
import api from "../../services/api";

const availableTimezones = [
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
  { value: "America/New_York", label: "America/New York (ET)" },
  { value: "Europe/London", label: "Europe/London (GMT)" },
];

export default function Settings() {
  const { language, setLanguage, availableLanguages } = useLocalization();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const token = JSON.parse(localStorage.getItem("btz_auth"))?.token;
  const businessId = localStorage.getItem("activeBusinessId");

  /* ---------------- STATES ---------------- */

  const [profile, setProfile] = useState({ name: "", avatarUrl: "" });

  const [branding, setBranding] = useState({ logoUrl: "" });

  const [security, setSecurity] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [localization, setLocalization] = useState({
    timezone: "Asia/Kolkata",
  });

  const [businessDetails, setBusinessDetails] = useState(
    `{
  "about": "",
  "address": "",
  "gst": ""
}`
  );

  /* ---------------- HELPERS ---------------- */

  const notify = (type, text) => setMsg({ type, text });

  const Status = () =>
    msg && (
      <div
        className={`mb-4 p-3 rounded text-sm flex gap-2 ${
          msg.type === "success"
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        {msg.type === "success" ? <CheckCircle2 /> : <AlertTriangle />}
        {msg.text}
      </div>
    );

  /* ---------------- ACTIONS ---------------- */

  const saveProfile = async () => {
    try {
      setLoading(true);
      await api.updateProfile(token, profile);
      notify("success", "Profile updated");
    } catch {
      notify("error", "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const saveBranding = async () => {
    try {
      setLoading(true);
      await api.updateBranding(token, branding);
      notify("success", "Branding updated");
    } catch {
      notify("error", "Branding update failed");
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async () => {
    if (security.newPassword !== security.confirmPassword) {
      return notify("error", "Passwords do not match");
    }

    try {
      setLoading(true);
      await api.updatePassword(token, security.newPassword);
      notify("success", "Password updated");
      setSecurity({ newPassword: "", confirmPassword: "" });
    } catch {
      notify("error", "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  const saveLocalization = async () => {
    try {
      setLoading(true);

      await api.updateLocalization(token, {
        language,
        timezone: localization.timezone,
      });

      notify("success", "Localization updated");
    } catch {
      notify("error", "Localization update failed");
    } finally {
      setLoading(false);
    }
  };

  const saveBusinessDetails = async () => {
    try {
      setLoading(true);

      const parsed = JSON.parse(businessDetails);

      await api.updateBusinessDetails(token, businessId, parsed);

      notify("success", "Business details updated");
    } catch (e) {
      notify("error", "Invalid JSON or update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TABS ---------------- */

  const ProfileTab = () => (
    <>
      <Status />
      <input
        className="input"
        placeholder="Full Name"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />
      <button onClick={saveProfile} disabled={loading} className="btn">
        Save Profile
      </button>
    </>
  );

  const BrandingTab = () => (
    <>
      <Status />
      <input
        className="input"
        placeholder="Logo URL"
        value={branding.logoUrl}
        onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
      />
      <button onClick={saveBranding} disabled={loading} className="btn">
        Save Branding
      </button>
    </>
  );

  const SecurityTab = () => (
    <>
      <Status />
      <input
        className="input"
        type="password"
        placeholder="New Password"
        value={security.newPassword}
        onChange={(e) =>
          setSecurity({ ...security, newPassword: e.target.value })
        }
      />
      <input
        className="input"
        type="password"
        placeholder="Confirm Password"
        value={security.confirmPassword}
        onChange={(e) =>
          setSecurity({ ...security, confirmPassword: e.target.value })
        }
      />
      <button onClick={savePassword} disabled={loading} className="btn">
        Update Password
      </button>
    </>
  );

  const LocalizationTab = () => (
    <>
      <Status />
      <select
        className="input"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        {availableLanguages.map((l) => (
          <option key={l} value={l}>
            {l.toUpperCase()}
          </option>
        ))}
      </select>

      <select
        className="input"
        value={localization.timezone}
        onChange={(e) => setLocalization({ timezone: e.target.value })}
      >
        {availableTimezones.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <button onClick={saveLocalization} disabled={loading} className="btn">
        Save Localization
      </button>
    </>
  );

  const BusinessTab = () => (
    <>
      <Status />
      <textarea
        rows={10}
        className="input font-mono"
        value={businessDetails}
        onChange={(e) => setBusinessDetails(e.target.value)}
      />
      <button onClick={saveBusinessDetails} disabled={loading} className="btn">
        Save Business Details
      </button>
    </>
  );

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "branding":
        return <BrandingTab />;
      case "security":
        return <SecurityTab />;
      case "localization":
        return <LocalizationTab />;
      case "business":
        return <BusinessTab />;
      default:
        return null;
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="flex gap-6">
        <aside className="w-60 space-y-2">
          {[
            ["profile", <User />],
            ["branding", <Brush />],
            ["security", <Lock />],
            ["localization", <Globe />],
            ["business", <Building2 />],
          ].map(([key, icon]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`tab ${activeTab === key ? "active" : ""}`}
            >
              {icon} {key.toUpperCase()}
            </button>
          ))}
        </aside>

        <main className="flex-1 space-y-4">{renderTab()}</main>
      </div>
    </div>
  );
}
