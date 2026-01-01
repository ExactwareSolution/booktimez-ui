import React, { useState } from "react";
import {
  User,
  Brush,
  Lock,
  Globe,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Save,
  ChevronRight,
  Stethoscope,
  Scissors,
  Store,
} from "lucide-react";
import { useLocalization } from "../../contexts/LocalizationContext";
import api from "../../services/api";

const availableTimezones = [
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
  { value: "America/New_York", label: "America/New York (ET)" },
  { value: "Europe/London", label: "Europe/London (GMT)" },
];

const BUSINESS_TEMPLATES = {
  salon: {
    label: "Salon & Spa",
    icon: <Scissors size={18} />,
    fields: [
      { id: "about", label: "About Salon", type: "textarea" },
      { id: "address", label: "Location Address", type: "text" },
      { id: "openingHours", label: "Business Hours", type: "text" },
    ],
  },
  clinical: {
    label: "Medical Clinic",
    icon: <Stethoscope size={18} />,
    fields: [
      { id: "doctorName", label: "Doctor Name", type: "text" },
      { id: "specialization", label: "Specialization", type: "text" },
      { id: "consultationFee", label: "Consultation Fee", type: "number" },
      { id: "licenseNumber", label: "Medical License #", type: "text" },
      { id: "bio", label: "Doctor Bio", type: "textarea" },
    ],
  },
  general: {
    label: "General Retail",
    icon: <Store size={18} />,
    fields: [
      { id: "storeType", label: "Store Type", type: "text" },
      { id: "gst", label: "GST Number", type: "text" },
      { id: "address", label: "Address", type: "textarea" },
    ],
  },
};

export default function Settings() {
  const { language, setLanguage, availableLanguages } = useLocalization();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const token = JSON.parse(localStorage.getItem("btz_auth"))?.token;
  const businessId = localStorage.getItem("activeBusinessId");

  // States
  const [profile, setProfile] = useState({ name: "", avatarUrl: "" });
  const [branding, setBranding] = useState({ logoUrl: "" });
  const [security, setSecurity] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [localization, setLocalization] = useState({
    timezone: "Asia/Kolkata",
  });
  const [bizData, setBizData] = useState({ type: "salon" });

  // --- Notification ---
  const notify = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 5000);
  };

  // --- Reusable UI Components ---
  const Status = () =>
    msg && (
      <div
        className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 border ${
          msg.type === "success"
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : "bg-rose-50 text-rose-700 border-rose-100"
        }`}
      >
        {msg.type === "success" ? (
          <CheckCircle2 size={18} />
        ) : (
          <AlertTriangle size={18} />
        )}
        <span className="text-sm font-medium">{msg.text}</span>
      </div>
    );

  const FormGroup = ({ label, children }) => (
    <div className="space-y-1.5 mb-5">
      <label className="text-sm font-semibold text-slate-700 ml-1">
        {label}
      </label>
      {children}
    </div>
  );

  const SaveButton = ({ onClick, text }) => (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center justify-center gap-2 px-8 py-3 bg-violet-600 disabled:bg-violet-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-violet-200 active:scale-95"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <Save size={18} />
      )}
      {text}
    </button>
  );

  // --- Shared save handler ---
  const handleSave = async (apiFunc, successMsg) => {
    try {
      setLoading(true);
      await apiFunc();
      notify("success", successMsg);
    } catch (err) {
      notify("error", "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Tabs ---
  const ProfileTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Status />
      <FormGroup label="Full Name">
        <input
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none bg-slate-50/50"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
      </FormGroup>
      <SaveButton
        onClick={() =>
          handleSave(
            () => api.updateProfile(token, profile),
            "Profile updated!"
          )
        }
        text="Save Profile"
      />
    </div>
  );

  const BusinessTab = () => {
    const currentTemplate =
      BUSINESS_TEMPLATES[bizData.type] || BUSINESS_TEMPLATES.salon;

    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <Status />
        <FormGroup label="Select Business Category">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {Object.entries(BUSINESS_TEMPLATES).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setBizData({ ...bizData, type: key })}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  bizData.type === key
                    ? "border-violet-600 bg-violet-50 text-violet-700 shadow-inner"
                    : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                }`}
              >
                {config.icon}
                <span className="text-xs font-bold uppercase tracking-wider">
                  {config.label}
                </span>
              </button>
            ))}
          </div>
        </FormGroup>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
          <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
            Details for {currentTemplate.label}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentTemplate.fields.map((field) => (
              <div
                key={field.id}
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <label className="text-xs font-bold text-slate-500 mb-1 block">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    value={bizData[field.id] || ""}
                    onChange={(e) =>
                      setBizData({ ...bizData, [field.id]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    type={field.type}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    value={bizData[field.id] || ""}
                    onChange={(e) =>
                      setBizData({ ...bizData, [field.id]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <SaveButton
          onClick={() =>
            handleSave(
              () => api.updateBusinessDetails(token, businessId, bizData),
              "Business info synced"
            )
          }
          text="Sync Business Details"
        />
      </div>
    );
  };

  const BrandingTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Status />
      <FormGroup label="Logo Image URL">
        <input
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none bg-slate-50/50"
          placeholder="https://..."
          value={branding.logoUrl}
          onChange={(e) =>
            setBranding({ ...branding, logoUrl: e.target.value })
          }
        />
      </FormGroup>
      <SaveButton
        onClick={() =>
          handleSave(
            () => api.updateBranding(token, branding),
            "Branding updated"
          )
        }
        text="Save Branding"
      />
    </div>
  );

  const LocalizationTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Status />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FormGroup label="System Language">
          <select
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none appearance-none bg-slate-50/50"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {availableLanguages.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup label="Timezone">
          <select
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none appearance-none bg-slate-50/50"
            value={localization.timezone}
            onChange={(e) => setLocalization({ timezone: e.target.value })}
          >
            {availableTimezones.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </FormGroup>
      </div>
      <SaveButton
        onClick={() =>
          handleSave(
            () =>
              api.updateLocalization(token, {
                language,
                timezone: localization.timezone,
              }),
            "Localization updated"
          )
        }
        text="Save Preferences"
      />
    </div>
  );

  const SecurityTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Status />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <FormGroup label="New Password">
          <input
            type="password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none bg-slate-50/50"
            value={security.newPassword}
            onChange={(e) =>
              setSecurity({ ...security, newPassword: e.target.value })
            }
          />
        </FormGroup>
        <FormGroup label="Confirm Password">
          <input
            type="password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none bg-slate-50/50"
            value={security.confirmPassword}
            onChange={(e) =>
              setSecurity({ ...security, confirmPassword: e.target.value })
            }
          />
        </FormGroup>
      </div>
      <SaveButton
        onClick={() => {
          if (security.newPassword !== security.confirmPassword)
            return notify("error", "Passwords do not match");
          handleSave(
            () => api.updatePassword(token, security.newPassword),
            "Password updated successfully"
          );
          setSecurity({ newPassword: "", confirmPassword: "" });
        }}
        text="Update Password"
      />
    </div>
  );

  const tabs = [
    { id: "profile", label: "Profile", component: ProfileTab },
    { id: "branding", label: "Branding", component: BrandingTab },
    { id: "business", label: "Business Details", component: BusinessTab },
    { id: "localization", label: "Localization", component: LocalizationTab },
    { id: "security", label: "Security", component: SecurityTab },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Settings
            </h1>
            <p className="text-slate-500 font-medium">
              Manage your digital identity and business configuration.
            </p>
          </div>
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-400">
            ID: {businessId?.substring(0, 8)}...
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation */}
          <aside className="w-full md:w-72 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMsg(null);
                }}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-100 translate-x-2"
                    : "bg-white text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {tabs.find((t) => t.id === tab.id).component && tab.label}
                  {tab.label}
                </div>
                <ChevronRight
                  size={16}
                  className={activeTab === tab.id ? "opacity-100" : "opacity-0"}
                />
              </button>
            ))}
          </aside>

          {/* Content Area */}
          <main className="flex-1 ...">
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 capitalize">
                  {activeTab} Settings
                </h2>
                <div className="h-1 w-12 bg-violet-600 mt-2 rounded-full" />
              </div>

              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "branding" && <BrandingTab />}
              {activeTab === "business" && <BusinessTab />}
              {activeTab === "localization" && <LocalizationTab />}
              {activeTab === "security" && <SecurityTab />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
