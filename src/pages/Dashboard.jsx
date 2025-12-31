import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import * as api from "../services/api";
import { useLocalization } from "../contexts/LocalizationContext";

function Dashboard() {
  const { user } = useAuth();
  const { t } = useLocalization();

  return (
    <section>
      <h2 className="text-2xl font-semibold">{t("dashboard")}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {user ? `${t("welcomeBack")}, ${user.name || user.email}` : t("logout")}
      </p>

      {!user && <AuthForms />}

      {user && <OwnerConsole user={user} />}
    </section>
  );
}

function AuthForms() {
  const { login, save } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  async function doLogin(e) {
    e.preventDefault();
    const resp = await login(email, password);
    if (!resp || !resp.token) alert("login failed");
  }

  async function doRegister(e) {
    e.preventDefault();
    const resp = await api.register(email, password, name, selectedPlan);
    if (resp && resp.token) save(resp.user, resp.token);
    else alert("register failed");
  }

  useEffect(() => {
    async function loadPlans() {
      const res = await api.listPlans();
      if (res && res.plans) {
        setPlans(res.plans);
        if (res.plans.length) setSelectedPlan(res.plans[0].id);
      }
    }
    loadPlans();
  }, []);

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <form
        onSubmit={doLogin}
        className="p-4 bg-white dark:bg-gray-800 rounded shadow"
      >
        <h3 className="font-medium">Sign in</h3>
        <input
          className="mt-2 w-full p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="mt-2 w-full p-2 border rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">
          Sign in
        </button>
      </form>

      <form
        onSubmit={doRegister}
        className="p-4 bg-white dark:bg-gray-800 rounded shadow"
      >
        <h3 className="font-medium">Register</h3>
        <label className="block text-sm mt-2">Plan</label>
        <select
          className="mt-1 w-full p-2 border rounded"
          value={selectedPlan || ""}
          onChange={(e) => setSelectedPlan(e.target.value)}
        >
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}{" "}
              {p.monthlyPriceCents
                ? `- ₹${p.monthlyPriceCents / 100}`
                : "- Free"}
            </option>
          ))}
        </select>
        <input
          className="mt-2 w-full p-2 border rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="mt-2 w-full p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="mt-2 w-full p-2 border rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded">
          Register
        </button>
      </form>
    </div>
  );
}

function OwnerConsole({ user }) {
  const { token } = useAuth();
  const [serviceLimitReached, setServiceLimitReached] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [business, setBusiness] = useState(null);
  const [bname, setBname] = useState("");
  const [bslug, setBslug] = useState("");
  const [bError, setBError] = useState(null);
  const [services, setServices] = useState([]);
  const [categoryLimitReached, setCategoryLimitReached] = useState(false);
  const [categories, setCategories] = useState([]);
  const [catName, setCatName] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [weekday, setWeekday] = useState(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(30);

  async function doCreateBusiness(e) {
    e.preventDefault();
    setBError(null);
    const nameTrim = (bname || "").trim();
    if (!nameTrim) return setBError("Business name is required");
    const payload = { name: nameTrim };
    // debug: log payload and token to help trace missing-name issues
    try {
      console.debug("doCreateBusiness payload:", payload, "token:", token);
      // also show the current input value directly
      console.debug("bname state:", bname, "trimmed:", nameTrim);
    } catch (e) {}
    const resp = await api.createBusiness(token, payload);
    if (resp && resp.business) {
      setBusiness(resp.business);
    } else {
      setBError(resp && resp.error ? resp.error : "failed to create business");
    }
  }

  async function loadServices() {
    if (!business) return;
    const resp = await api.listBusinessCategories(token, business.id);
    if (resp && resp.categories) setCategories(resp.categories);
    // check plan limits if business has Plan
    try {
      const planMax = business.Plan && business.Plan.maxCategories;
      if (typeof planMax === "number") {
        setCategoryLimitReached((resp.categories || []).length >= planMax);
      } else {
        setCategoryLimitReached(false);
      }
    } catch (e) {
      setCategoryLimitReached(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, [business]);

  useEffect(() => {
    // auto-select first category when categories load
    if (categories && categories.length && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories]);

  useEffect(() => {
    // load businesses for user on mount
    async function loadMy() {
      try {
        const res = await api.listMyBusinesses(token);
        if (res && res.businesses && res.businesses.length) {
          const first = res.businesses[0];
          setBusiness(first.business);
          // also set services (will be loaded by loadServices effect)
        }
      } catch (e) {}
    }
    loadMy();
  }, []);

  async function doCreateCategory(e) {
    e.preventDefault();
    if (!business) return alert("create business first");
    const resp = await api.createCategory(token, business.id, {
      name: catName,
      description: catDescription,
    });
    if (resp && resp.error) {
      setBError(resp.error || "failed to create category");
    }
    loadServices();
  }

  async function doCreateAvailability(e) {
    e.preventDefault();
    if (!business) return alert("create business first");
    const payload = {
      categoryId: selectedCategoryId || (categories[0] && categories[0].id),
      weekday: Number(weekday),
      startTime,
      endTime,
      slotDurationMinutes: Number(slotDurationMinutes) || undefined,
    };
    const resp = await api.createAvailability(token, business.id, payload);
    if (resp) alert("availability saved");
  }

  const [appointments, setAppointments] = useState([]);
  async function loadAppointments() {
    if (!business) return;
    const resp = await api.listBusinessAppointments(token, business.id);
    if (resp && resp.appointments) setAppointments(resp.appointments);
  }

  useEffect(() => {
    loadAppointments();
  }, [business]);

  async function doCancel(apptId) {
    if (!business) return;
    const resp = await api.cancelAppointment(token, business.id, apptId);
    if (resp) loadAppointments();
  }

  return (
    <div className="mt-6">
      {!business && (
        <form
          onSubmit={doCreateBusiness}
          className="p-4 bg-white dark:bg-gray-800 rounded shadow mb-4"
        >
          <h3 className="font-medium">Create Business</h3>
          <input
            className="mt-2 w-full p-2 border rounded"
            placeholder="Business name"
            value={bname}
            onChange={(e) => setBname(e.target.value)}
          />
          {bError && <div className="text-sm text-red-600 mt-2">{bError}</div>}
          <input
            className="mt-2 w-full p-2 border rounded"
            placeholder="Slug (optional)"
            value={bslug}
            onChange={(e) => setBslug(e.target.value)}
          />
          <button
            className={`mt-2 px-3 py-1 text-white rounded ${
              bname.trim() ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!bname.trim()}
          >
            Create
          </button>
        </form>
      )}

      {business && (
        <div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow mb-4">
            <h3 className="font-medium">Business: {business.name}</h3>
            <p className="flex items-center gap-3">
              <span>Public link:</span>
              {(() => {
                const frontBase =
                  import.meta.env.VITE_APP_BASE || "http://localhost:5173";
                const url = `${frontBase.replace(
                  /\/$/,
                  ""
                )}/business/${encodeURIComponent(business.slug)}/${
                  business.id
                }`;
                return (
                  <>
                    <a className="text-blue-600 wrap-break-word" href={url}>
                      {url}
                    </a>
                    <button
                      className="px-2 py-1 bg-gray-200 text-sm rounded"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(url);
                          setCopyMessage("Copied!");
                          setTimeout(() => setCopyMessage(""), 1500);
                        } catch (e) {
                          setCopyMessage("Copy failed");
                        }
                      }}
                    >
                      Copy
                    </button>
                    <span className="text-sm text-green-600">
                      {copyMessage}
                    </span>
                  </>
                );
              })()}
            </p>
          </div>

          <form
            onSubmit={doCreateCategory}
            className="p-4 bg-white dark:bg-gray-800 rounded shadow mb-4"
          >
            <h4 className="font-medium">Create Category</h4>
            <input
              className="mt-2 w-full p-2 border rounded"
              placeholder="Category name"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
            />
            <input
              className="mt-2 w-full p-2 border rounded"
              placeholder="Description (optional)"
              value={catDescription}
              onChange={(e) => setCatDescription(e.target.value)}
            />
            <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded">
              Add Category
            </button>
          </form>

          <form
            onSubmit={doCreateAvailability}
            className="p-4 bg-white dark:bg-gray-800 rounded shadow mb-4"
          >
            <h4 className="font-medium">
              Create Availability (first category)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <select
                className="p-2 border rounded"
                value={weekday}
                onChange={(e) => setWeekday(e.target.value)}
              >
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
              </select>
              <select
                className="p-2 border rounded"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                {categories && categories.length ? (
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <option value="">No categories</option>
                )}
              </select>
              <input
                className="p-2 border rounded"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <input
                className="p-2 border rounded"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <input
                className="p-2 border rounded"
                type="number"
                min={1}
                value={slotDurationMinutes}
                onChange={(e) => setSlotDurationMinutes(e.target.value)}
                placeholder="Slot minutes (optional)"
              />
              <button className="px-3 py-1 bg-yellow-600 text-white rounded">
                Add Availability
              </button>
            </div>
          </form>

          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h4 className="font-medium">Appointments</h4>
            <button
              className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded"
              onClick={loadAppointments}
            >
              Refresh
            </button>
            <div className="mt-2 space-y-2">
              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="p-2 border rounded flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">
                      {a.customerName} - {new Date(a.startAt).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">{a.status}</div>
                  </div>
                  <div>
                    {a.status !== "cancelled" && (
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded"
                        onClick={() => doCancel(a.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
