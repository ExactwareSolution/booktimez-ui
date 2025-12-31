import React, { useEffect, useState, useMemo } from "react";
import apiClient, {
  listMyBusinesses,
  listBusinessCategories,
} from "../../services/api";

const timezones = ["UTC", "Asia/Kolkata", "Europe/London", "America/New_York"];
const languages = [
  { code: "en", label: "🇺🇸 English" },
  { code: "hi", label: "🇮🇳 Hindi" },
  { code: "ar", label: "🇦🇪 Arabic" },
];

const MyBusiness = () => {
  const [business, setBusiness] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // For searching categories
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    logo: null,
    timezone: "UTC",
    language: "en",
    categoryIds: [],
  });
  const [logoPreview, setLogoPreview] = useState("");

  const token = useMemo(() => {
    try {
      const auth = localStorage.getItem("btz_auth");
      return auth ? JSON.parse(auth)?.token : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (token) loadBusiness();
  }, [token]);

  const loadBusiness = async () => {
    try {
      setLoading(true);
      const res = await listMyBusinesses(token);
      const data = res?.[0];
      if (!data) return;

      setBusiness(data);
      setForm({
        name: data.name || "",
        slug: data.slug || "",
        logo: null,
        timezone: data.timezone || "UTC",
        language: data.language || "en",
        categoryIds: data.Categories?.map((c) => c.id) || [],
      });
      setLogoPreview(data.logoUrl || "");

      // FIX: Pass the ID directly from the fetched data
      await fetchAllCategories(data.id);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCategories = async (businessId) => {
    if (!businessId) return;
    try {
      const res = await listBusinessCategories(token, businessId);
      // Ensure we handle the nested structure { categories: [...] }
      setAllCategories(res.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleCategorySelect = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(selectedId)
        ? prev.categoryIds
        : [...prev.categoryIds, selectedId],
    }));
    setSearchTerm(""); // Reset search after selection
  };

  const removeCategory = (id) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.filter((catId) => catId !== id),
    }));
  };

  // Filter categories based on user typing
  const filteredCategories = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("timezone", form.timezone);
      formData.append("language", form.language);
      form.categoryIds.forEach((id) => formData.append("categoryIds[]", id));
      if (form.logo instanceof File) formData.append("logo", form.logo);

      await apiClient.updateBusiness(token, business.id, formData);
      alert("Business updated successfully!");
      loadBusiness();
    } catch (err) {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-10">
      {/* Dynamic Header */}
      <header className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 bg-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-purple-200">
            {form.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {form.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              {business.subscriptionStatus}
            </span>
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-10"
      >
        {/* Left: Branding */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit space-y-6">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
            Logo
          </h3>
          <div className="relative group aspect-square rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all hover:border-purple-400">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Preview"
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <span className="text-gray-400 text-sm">Upload Logo</span>
            )}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setForm({ ...form, logo: file });
                  const reader = new FileReader();
                  reader.onloadend = () => setLogoPreview(reader.result);
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </div>

        {/* Right: Detailed Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                Business Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-50 border-gray-100 rounded-xl border-2 p-3 outline-none focus:border-purple-500 focus:bg-white transition-all font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                URL Slug
              </label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-gray-50 border-gray-100 rounded-xl border-2 p-3 outline-none focus:border-purple-500 focus:bg-white transition-all font-semibold"
              />
            </div>

            {/* Enhanced Category Selector */}
            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                Categories
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search and select..."
                  className="w-1/3 bg-gray-50 border-gray-100 rounded-xl border-2 p-2 text-sm outline-none focus:border-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  onChange={handleCategorySelect}
                  value=""
                  className="flex-1 bg-gray-50 border-gray-100 rounded-xl border-2 p-3 outline-none focus:border-purple-500 appearance-none cursor-pointer font-medium"
                >
                  <option value="" disabled>
                    Click to add category
                  </option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selection Chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                {form.categoryIds.map((id) => {
                  const category = allCategories.find((c) => c.id === id);
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-xl border border-purple-100 text-xs font-bold transition-all hover:bg-purple-100 shadow-sm"
                    >
                      {category?.name || "Category"}
                      <button
                        type="button"
                        onClick={() => removeCategory(id)}
                        className="text-purple-400 hover:text-purple-700 text-lg leading-none"
                      >
                        &times;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                Timezone
              </label>
              <select
                name="timezone"
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="w-full bg-gray-50 border-gray-100 rounded-xl border-2 p-3 outline-none focus:border-purple-500"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                Language
              </label>
              <select
                name="language"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full bg-gray-50 border-gray-100 rounded-xl border-2 p-3 outline-none focus:border-purple-500"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 pt-6 border-t border-gray-50 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-purple-100 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {saving ? "SAVING..." : "SAVE CHANGES"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MyBusiness;
