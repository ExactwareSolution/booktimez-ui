// src/components/owner/CreateBusiness.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  Briefcase,
  Clock,
  Globe,
  ListChecks,
  Tag,
  Send,
  Loader2,
  Image as ImageIcon,
  Upload,
} from "lucide-react";

import rawTimezones from "./json_data/timezones.json";
import api from "../../services/api";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Colors / Tailwind tokens you provided (used in inline styles and select styling)
const PRIMARY_VIOLET = "#7c3aed"; // tailwind violet-600 (#7c3aed)
const VIOLET_100 = "#ede9fe"; // bg-violet-100-ish
const VIOLET_700 = "#6d28d9"; // text-violet-700-ish
const VIOLET_50 = "#f5f3ff"; // hover background-ish

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-");
}

const CreateBusiness = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [manualSlugEdited, setManualSlugEdited] = useState(false);
  const [timezone, setTimezone] = useState("UTC");
  const [language, setLanguage] = useState("en");
  const [categories, setCategories] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]); // react-select option objects
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFileName, setLogoFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [logoError, setLogoError] = useState(null);
  const [formError, setFormError] = useState(null);

  // read token from btz_auth
  const token = useMemo(() => {
    try {
      const auth = localStorage.getItem("btz_auth");
      if (!auth) return null;
      const parsed = JSON.parse(auth);
      return parsed?.token || null;
    } catch (e) {
      return null;
    }
  }, []);

  // local state for selected logo file
  const [logoFile, setLogoFile] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      if (!token) {
        setFetchError("Not authenticated.");
        return;
      }
      try {
        setFetchError(null);
        const res = await api.createCategory(token);
        // await fetch("http://localhost:5000/api/categories", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err.error || `Failed to fetch categories (${res.status})`,
          );
        }
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data.categories || [];
        setCategories(arr);
      } catch (err) {
        console.error("fetchCategories:", err);
        setFetchError("Failed to load categories. Refresh or try again later.");
      }
    }
    fetchCategories();
  }, [token]);

  // auto-generate slug when name changes (unless manual edit)
  useEffect(() => {
    if (!manualSlugEdited) {
      setSlug(slugify(name || ""));
    }
  }, [name, manualSlugEdited]);

  // react-select options from categories
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  // Handle file selection for logo (we'll upload together with createBusiness)
  const handleLogoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoError(null);

    if (file.size > MAX_FILE_SIZE) {
      setLogoError("File too large. Max 2MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setLogoError("Only image files are allowed (png, jpg, jpeg).");
      return;
    }

    setLogoFile(file);
    setLogoFileName(file.name);
    // create preview URL
    try {
      const preview = URL.createObjectURL(file);
      setLogoUrl(preview);
    } catch (e) {
      /* ignore preview errors */
    }
  };

  // submit form
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("Business name is required.");
      return;
    }
    if (selectedOptions.length === 0) {
      setFormError("Please select at least one category.");
      return;
    }

    setLoading(true);

    try {
      let res;
      if (logoFile) {
        // send multipart/form-data
        const fd = new FormData();
        fd.append("name", name.trim());
        fd.append("slug", slug.trim() || slugify(name));
        fd.append("timezone", timezone);
        fd.append("language", language);
        fd.append(
          "categoryIds",
          JSON.stringify(selectedOptions.map((o) => o.value)),
        );
        fd.append("logo", logoFile);

        res = await fetch("https://booktimez-app.onrender.com/api/business", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        });
      } else {
        const body = {
          name: name.trim(),
          slug: slug.trim() || slugify(name),
          timezone,
          language,
          categoryIds: selectedOptions.map((o) => o.value),
          logoUrl: logoUrl || null,
        };

        res = await fetch("https://booktimez-app.onrender.com/api/business", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Failed (${res.status})`);
      }

      // Update localStorage btz_auth.isBusinessAvailable = true
      try {
        const authRaw = localStorage.getItem("btz_auth");
        if (authRaw) {
          const parsed = JSON.parse(authRaw);
          parsed.isBusinessAvailable = true;
          localStorage.setItem("btz_auth", JSON.stringify(parsed));
        }
      } catch (e) {
        // ignore localStorage write errors
        console.warn("Could not update btz_auth in localStorage", e);
      }

      // navigate to dashboard bookings
      navigate("/dashboard/bookings");
    } catch (err) {
      console.error("create business error:", err);
      setFormError(err.message || "Failed to create business");
    } finally {
      setLoading(false);
    }
  };

  // react-select custom styles (violet theme)
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: 8,
      padding: "2px",
      borderColor: state.isFocused ? PRIMARY_VIOLET : base.borderColor,
      boxShadow: state.isFocused ? `0 0 0 3px ${VIOLET_50}` : base.boxShadow,
      "&:hover": { borderColor: PRIMARY_VIOLET },
      minHeight: 46,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: VIOLET_100,
      borderRadius: 9999,
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: VIOLET_700,
      fontWeight: 600,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: VIOLET_700,
      ":hover": { backgroundColor: "#eee", color: "#4c1d95" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? VIOLET_50 : "white",
      color: state.isSelected ? VIOLET_700 : base.color,
    }),
    placeholder: (base) => ({ ...base, color: "#6b7280" }),
  };

  const timezones = rawTimezones.map((tz) => ({
    value: tz.value,
    label: tz.text, // use the human-readable text
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        {/* header */}
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-violet-600" />
            Create your business
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Provide details and choose categories so customers can find you.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* business name + slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <Tag className="w-4 h-4 text-violet-600" />
                Business name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="e.g. Modern Hair Studio"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
                aria-label="Business name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <Tag className="w-4 h-4 text-violet-600" />
                Slug (url)
              </label>
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setManualSlugEdited(true);
                }}
                type="text"
                placeholder="unique-slug (optional)"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
                aria-label="Business slug"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your business link will be{" "}
                <span className="font-medium text-gray-700">
                  {`${window.location.origin}/b/`}
                  {slug || slugify(name || "")}
                </span>
              </p>
            </div>
          </div>

          {/* logo upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-violet-600" />
              Business logo (optional, max 2MB)
            </label>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-28 h-28 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                {logoUrl ? (
                  // preview
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt="logo preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-300">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <label
                    className={`inline-flex items-center px-4 py-2 rounded-md cursor-pointer text-sm font-medium ${
                      uploading
                        ? "bg-gray-100 text-gray-400"
                        : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                    }`}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload logo"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      onChange={handleLogoSelect}
                      disabled={uploading || loading}
                    />
                  </label>

                  {logoFileName && (
                    <div className="text-sm text-gray-600 truncate max-w-xs">
                      {logoFileName}
                    </div>
                  )}
                </div>

                {logoError && (
                  <p className="mt-2 text-sm text-red-600">{logoError}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Accepted: PNG, JPG. Max 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* timezone / language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-600" />
                Timezone
              </label>
              <Select
                options={timezones}
                value={timezones.find((tz) => tz.value === timezone)}
                onChange={(opt) => setTimezone(opt.value)}
                isSearchable
                placeholder="Select timezone..."
                styles={selectStyles}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <Globe className="w-4 h-4 text-violet-600" />
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
          </div>

          {/* categories */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-violet-600" />
              Select categories
            </label>

            {fetchError && (
              <div className="mb-3 p-3 bg-red-50 text-red-700 rounded border border-red-100">
                {fetchError}
              </div>
            )}

            <Select
              isMulti
              options={categoryOptions}
              value={selectedOptions}
              onChange={(opts) => setSelectedOptions(opts || [])}
              styles={selectStyles}
              placeholder="Search & select categories..."
              className="react-select"
              classNamePrefix="select"
              noOptionsMessage={() => "No categories"}
            />
            <p className="mt-2 text-xs text-gray-500">
              Pick the categories that best describe your business.
            </p>
          </div>

          {/* form error */}
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 rounded border border-red-100">
              {formError}
            </div>
          )}

          {/* submit */}
          <div>
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold shadow"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Create Business
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBusiness;
