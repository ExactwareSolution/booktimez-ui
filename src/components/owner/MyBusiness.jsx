// import React, { useEffect, useState, useMemo } from "react";
// import apiClient, {
//   listMyBusinesses,
//   listBusinessCategories,
// } from "../../services/api";

// const timezones = ["UTC", "Asia/Kolkata", "Europe/London", "America/New_York"];
// const languages = [
//   { code: "en", label: "🇺🇸 English" },
//   { code: "hi", label: "🇮🇳 Hindi" },
//   { code: "ar", label: "🇦🇪 Arabic" },
// ];

// const MyBusiness = () => {
//   const [business, setBusiness] = useState(null);
//   const [allCategories, setAllCategories] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(""); // For searching categories
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     slug: "",
//     logo: null,
//     timezone: "UTC",
//     language: "en",
//     categoryIds: [],
//   });
//   const [logoPreview, setLogoPreview] = useState("");

//   const token = useMemo(() => {
//     try {
//       const auth = localStorage.getItem("btz_auth");
//       return auth ? JSON.parse(auth)?.token : null;
//     } catch {
//       return null;
//     }
//   }, []);

//   useEffect(() => {
//     if (token) loadBusiness();
//   }, [token]);

//   const loadBusiness = async () => {
//     try {
//       setLoading(true);
//       const res = await listMyBusinesses(token);
//       const data = res?.[0];
//       if (!data) return;

//       setBusiness(data);
//       setForm({
//         name: data.name || "",
//         slug: data.slug || "",
//         logo: null,
//         timezone: data.timezone || "UTC",
//         language: data.language || "en",
//         categoryIds: data.Categories?.map((c) => c.id) || [],
//       });
//       setLogoPreview(data.logoUrl || "");

//       // FIX: Pass the ID directly from the fetched data
//       await fetchAllCategories(data.id);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllCategories = async (businessId) => {
//     if (!businessId) return;
//     try {
//       const res = await listBusinessCategories(token, businessId);
//       // Ensure we handle the nested structure { categories: [...] }
//       setAllCategories(res.categories || []);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   };

//   const handleCategorySelect = (e) => {
//     const selectedId = e.target.value;
//     if (!selectedId) return;
//     setForm((prev) => ({
//       ...prev,
//       categoryIds: prev.categoryIds.includes(selectedId)
//         ? prev.categoryIds
//         : [...prev.categoryIds, selectedId],
//     }));
//     setSearchTerm(""); // Reset search after selection
//   };

//   const removeCategory = (id) => {
//     setForm((prev) => ({
//       ...prev,
//       categoryIds: prev.categoryIds.filter((catId) => catId !== id),
//     }));
//   };

//   // Filter categories based on user typing
//   const filteredCategories = allCategories.filter((cat) =>
//     cat.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       const formData = new FormData();
//       formData.append("name", form.name);
//       formData.append("slug", form.slug);
//       formData.append("timezone", form.timezone);
//       formData.append("language", form.language);
//       form.categoryIds.forEach((id) => formData.append("categoryIds[]", id));
//       if (form.logo instanceof File) formData.append("logo", form.logo);

//       await apiClient.updateBusiness(token, business.id, formData);
//       alert("Business updated successfully!");
//       loadBusiness();
//     } catch (err) {
//       alert("Update failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex flex-col items-center justify-center h-96">
//         <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
//       </div>
//     );

//   return (
//     <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-10">
//       {/* Dynamic Header */}
//       <header className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
//         <div className="flex items-center gap-6">
//           <div className="h-20 w-20 bg-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-purple-200">
//             {form.name.charAt(0).toUpperCase()}
//           </div>
//           <div>
//             <h1 className="text-3xl font-black text-gray-900 tracking-tight">
//               {form.name}
//             </h1>
//             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase mt-2">
//               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
//               {business?.subscriptionStatus}
//             </span>
//           </div>
//         </div>
//       </header>

//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 lg:grid-cols-3 gap-10"
//       >
//         {/* Left: Branding */}
//         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit space-y-6">
//           <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
//             Logo
//           </h3>
//           <div className="relative group aspect-square rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all hover:border-purple-400">
//             {logoPreview ? (
//               <img
//                 src={logoPreview}
//                 alt="Preview"
//                 className="w-full h-full object-contain p-4"
//               />
//             ) : (
//               <span className="text-gray-400 text-sm">Upload Logo</span>
//             )}
//             <input
//               type="file"
//               className="absolute inset-0 opacity-0 cursor-pointer"
//               onChange={(e) => {
//                 const file = e.target.files[0];
//                 if (file) {
//                   setForm({ ...form, logo: file });
//                   const reader = new FileReader();
//                   reader.onloadend = () => setLogoPreview(reader.result);
//                   reader.readAsDataURL(file);
//                 }
//               }}
//             />
//           </div>
//         </div>

//         {/* Right: Detailed Form */}
//         <div className="lg:col-span-2 space-y-8">
//           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="space-y-2">
//               <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
//                 Business Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 className="w-full bg-gray-50 border-gray-100 rounded-xl border-2 p-3 outline-none focus:border-purple-500 focus:bg-white transition-all font-semibold"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
//                 URL Slug
//               </label>
//               <input
//                 type="text"
//                 name="slug"
//                 value={form.slug}
//                 onChange={(e) => setForm({ ...form, slug: e.target.value })}
//                 className="w-full bg-gray-50 border-gray-100 rounded-xl border-2 p-3 outline-none focus:border-purple-500 focus:bg-white transition-all font-semibold"
//               />
//             </div>

//             {/* Enhanced Category Selector */}
//             <div className="md:col-span-2 space-y-3">
//               <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
//                 Categories
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   placeholder="Search and select..."
//                   className="w-1/3 bg-gray-50 border-gray-100 rounded-xl border-2 p-2 text-sm outline-none focus:border-purple-500"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <select
//                   onChange={handleCategorySelect}
//                   value=""
//                   className="flex-1 bg-gray-50 border-gray-100 rounded-xl border-2 p-3 outline-none focus:border-purple-500 appearance-none cursor-pointer font-medium"
//                 >
//                   <option value="" disabled>
//                     Click to add category
//                   </option>
//                   {filteredCategories.map((cat) => (
//                     <option key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Selection Chips */}
//               <div className="flex flex-wrap gap-2 pt-2">
//                 {form.categoryIds.map((id) => {
//                   const category = allCategories.find((c) => c.id === id);
//                   return (
//                     <div
//                       key={id}
//                       className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-xl border border-purple-100 text-xs font-bold transition-all hover:bg-purple-100 shadow-sm"
//                     >
//                       {category?.name || "Category"}
//                       <button
//                         type="button"
//                         onClick={() => removeCategory(id)}
//                         className="text-purple-400 hover:text-purple-700 text-lg leading-none"
//                       >
//                         &times;
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
//                 Timezone
//               </label>
//               <select
//                 name="timezone"
//                 value={form.timezone}
//                 onChange={(e) => setForm({ ...form, timezone: e.target.value })}
//                 className="w-full bg-gray-50 border-gray-100 rounded-xl border-2 p-3 outline-none focus:border-purple-500"
//               >
//                 {timezones.map((tz) => (
//                   <option key={tz} value={tz}>
//                     {tz}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="space-y-2">
//               <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
//                 Language
//               </label>
//               <select
//                 name="language"
//                 value={form.language}
//                 onChange={(e) => setForm({ ...form, language: e.target.value })}
//                 className="w-full bg-gray-50 border-gray-100 rounded-xl border-2 p-3 outline-none focus:border-purple-500"
//               >
//                 {languages.map((l) => (
//                   <option key={l.code} value={l.code}>
//                     {l.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="md:col-span-2 pt-6 border-t border-gray-50 flex justify-end">
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-purple-100 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
//               >
//                 {saving ? "SAVING..." : "SAVE CHANGES"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default MyBusiness;

import React, { useEffect, useState, useMemo } from "react";
import {
  Building2,
  Globe,
  Clock,
  Languages,
  UploadCloud,
  X,
  CheckCircle2,
  Hash,
  ChevronRight,
  Search,
} from "lucide-react"; // Using lucide-react for a modern feel
import apiClient, {
  listMyBusinesses,
  listBusinessCategories,
} from "../../services/api";

const timezones = ["UTC", "Asia/Kolkata", "Europe/London", "America/New_York"];
const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "ar", label: "Arabic", flag: "🇦🇪" },
];

const MyBusiness = () => {
  const [business, setBusiness] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
      setAllCategories(res.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategorySelect = (id) => {
    if (!id || form.categoryIds.includes(id)) return;
    setForm((prev) => ({ ...prev, categoryIds: [...prev.categoryIds, id] }));
    setSearchTerm("");
  };

  const removeCategory = (id) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.filter((catId) => catId !== id),
    }));
  };

  const filteredCategories = allCategories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !form.categoryIds.includes(cat.id),
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
      <div className="flex h-[80vh] items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-violet-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <Building2 size={32} />
              </div>
              <div>
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span>Settings</span>
                  <ChevronRight size={14} />
                  <span className="text-gray-900 font-medium">
                    Business Profile
                  </span>
                </nav>
                <h1 className="text-2xl font-bold text-gray-900">
                  {form.name}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${
                  business?.subscriptionStatus === "active"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    business?.subscriptionStatus === "active"
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-amber-500"
                  }`}
                ></span>
                {business?.subscriptionStatus?.toUpperCase() || "TRIAL"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
          {/* Sidebar Info */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Brand Identity
              </h3>

              <div className="space-y-6">
                <div className="relative group">
                  <div
                    className={`aspect-square rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden bg-gray-50 ${
                      logoPreview
                        ? "border-transparent"
                        : "border-gray-200 group-hover:border-violet-400 group-hover:bg-violet-50"
                    }`}
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <UploadCloud
                          className="text-gray-400 mb-3 group-hover:text-violet-500 transition-colors"
                          size={40}
                        />
                        <span className="text-sm font-medium text-gray-500">
                          Upload new logo
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setForm({ ...form, logo: file });
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            setLogoPreview(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  {logoPreview && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl pointer-events-none">
                      <span className="text-white text-sm font-bold">
                        Change Image
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <p className="text-xs text-blue-700 leading-relaxed font-medium">
                    Recommended: 512x512px SVG or PNG. This logo will appear on
                    your booking page and emails.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form Fields */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building2
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full bg-white border-gray-200 rounded-2xl border px-11 py-3.5 focus:ring-4 focus:ring-violet-50 focus:border-violet-500 transition-all outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Public URL Slug
                  </label>
                  <div className="relative">
                    <Globe
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) =>
                        setForm({ ...form, slug: e.target.value })
                      }
                      className="w-full bg-white border-gray-200 rounded-2xl border px-11 py-3.5 focus:ring-4 focus:ring-violet-50 focus:border-violet-500 transition-all outline-none font-medium text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Categories Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Business Categories
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border-gray-200 rounded-2xl border px-11 py-3.5 focus:border-violet-500 transition-all outline-none font-medium"
                  />

                  {searchTerm && (
                    <div className="absolute z-10 top-full mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl max-h-48 overflow-y-auto p-2">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategorySelect(cat.id)}
                            className="w-full text-left px-4 py-3 hover:bg-violet-50 rounded-xl text-sm font-medium text-gray-700 flex justify-between items-center group"
                          >
                            {cat.name}
                            <CheckCircle2
                              className="text-violet-500 opacity-0 group-hover:opacity-100"
                              size={16}
                            />
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-400 font-medium">
                          No categories found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 min-h-[44px]">
                  {form.categoryIds.map((id) => {
                    const category = allCategories.find((c) => c.id === id);
                    return (
                      <div
                        key={id}
                        className="inline-flex items-center gap-2 bg-violet-600 text-white pl-4 pr-2 py-2 rounded-full text-xs font-bold shadow-sm animate-in fade-in zoom-in duration-200"
                      >
                        {category?.name || "Category"}
                        <button
                          type="button"
                          onClick={() => removeCategory(id)}
                          className="w-5 h-5 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Timezone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Preferred Timezone
                  </label>
                  <div className="relative">
                    <Clock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <select
                      value={form.timezone}
                      onChange={(e) =>
                        setForm({ ...form, timezone: e.target.value })
                      }
                      className="w-full bg-white border-gray-200 rounded-2xl border px-11 py-3.5 focus:border-violet-500 transition-all outline-none font-medium appearance-none"
                    >
                      {timezones.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    System Language
                  </label>
                  <div className="relative">
                    <Languages
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <select
                      value={form.language}
                      onChange={(e) =>
                        setForm({ ...form, language: e.target.value })
                      }
                      className="w-full bg-white border-gray-200 rounded-2xl border px-11 py-3.5 focus:border-violet-500 transition-all outline-none font-medium appearance-none"
                    >
                      {languages.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.flag} {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-8 flex items-center justify-between border-t border-gray-100">
                <div className="hidden md:block">
                  <p className="text-sm text-gray-400 font-medium italic">
                    All changes are updated instantly to your public profile.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-auto px-10 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold shadow-lg shadow-violet-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                >
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Settings"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyBusiness;
