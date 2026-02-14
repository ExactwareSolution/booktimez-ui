const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://zd4hf92j-5000.inc1.devtunnels.ms/api";

async function request(path, opts = {}) {
  const url = `${API_BASE}${path}`;

  const isFormData = opts.body instanceof FormData;

  const headers = {
    ...(opts.headers || {}),
  };

  // ❗ DO NOT set Content-Type for FormData
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  console.debug("api.request ->", {
    url,
    method: opts.method,
    headers,
    body: isFormData ? "[FormData]" : opts.body,
  });

  const res = await fetch(url, {
    ...opts,
    headers,
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function loginWithGoogle(payload) {
  // payload: { email, googleId, name }
  return request("/auth/google", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(email, password, name, planId) {
  const body = { email, password, name };
  if (planId) body.planId = planId;
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updatePassword(token, newPassword) {
  return request("/auth/update-password", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ newPassword }),
  });
}

export async function listPlans() {
  return request("/plans", { method: "GET" });
}

export async function createPlan(token, payload) {
  return request("/plans", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function checkoutPlan(token, planId) {
  return request(`/plans/${planId}/checkout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function confirmCheckout(token, sessionId) {
  return request(`/plans/confirm`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ sessionId }),
  });
}

export async function createRazorpayOrder(token, planId) {
  return request(`/plans/${planId}/razorpay`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getPaymentProviders() {
  return request(`/plans/providers`, { method: "GET" });
}

export async function confirmRazorpay(token, payload) {
  return request(`/plans/confirm`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/* =========================================================
   CREATE BUSINESS
   - Supports logo upload
   - Supports JSONB (businessDetails)
========================================================= */
export async function createBusiness(token, payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "businessDetails" || key === "categoryIds") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  return request("/business", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}

/* =========================================================
   UPDATE BUSINESS (basic fields + logo)
========================================================= */
export async function updateBusiness(token, businessId, payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "categoryIds") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  return request(`/business/${businessId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}

/* =========================================================
   LIST MY BUSINESSES
========================================================= */
export async function listMyBusinesses(token) {
  return request("/business", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/* =========================================================
   GET SINGLE BUSINESS
========================================================= */
export async function getBusiness(token, businessId) {
  return request(`/business/${businessId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/* =========================================================
   DELETE BUSINESS
========================================================= */
export async function deleteBusiness(token, businessId) {
  return request(`/business/${businessId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/* =========================================================
   JSONB – FULL REPLACE
========================================================= */
export async function replaceBusinessDetails(token, businessId, details) {
  return request(`/business/${businessId}/details`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });
}

/* =========================================================
   JSONB – PATCH / MERGE
========================================================= */
export async function patchBusinessDetails(token, businessId, patch) {
  return request(`/business/${businessId}/details`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  });
}

/* =========================================================
   JSONB – ADD ITEM TO ANY SECTION
========================================================= */
export async function addBusinessItem(token, businessId, section, item) {
  return request(`/business/${businessId}/details/${section}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
}

/* =========================================================
   JSONB – UPDATE ITEM
========================================================= */
export async function updateBusinessItem(
  token,
  businessId,
  section,
  itemId,
  payload,
) {
  return request(`/business/${businessId}/details/${section}/${itemId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

/* =========================================================
   JSONB – DELETE ITEM
========================================================= */
export async function deleteBusinessItem(token, businessId, section, itemId) {
  return request(`/business/${businessId}/details/${section}/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// --------------------
// CREATE AVAILABILITY
// --------------------
export async function createAvailability(token, businessId, payload) {
  if (!token || !businessId || !payload) {
    throw new Error("Missing required parameters for createAvailability");
  }

  const res = await request(`/business/${businessId}/availabilities`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (res?.error) {
    throw new Error(res.error || "Failed to create availability");
  }

  return res;
}

// --------------------
// UPDATE AVAILABILITY
// --------------------
export async function updateAvailability(
  token,
  businessId,
  availabilityId,
  payload,
) {
  if (!token || !businessId || !availabilityId || !payload) {
    throw new Error("Missing required parameters for updateAvailability");
  }

  // 'request' returns already parsed JSON
  const res = await request(
    `/business/${businessId}/availabilities/${availabilityId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  // Check for error field from API
  if (res?.error) {
    throw new Error(res.error || "Failed to update availability");
  }

  return res; // ✅ already parsed JSON
}

// --------------------
// LIST AVAILABILITIES
// --------------------
export async function listBusinessAvailabilities(token, businessId) {
  if (!token || !businessId) {
    throw new Error("Missing required parameters");
  }

  const res = await request(`/business/${businessId}/availabilities`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  // If request wrapper returns the raw Response object, parse it.
  // If it's already an object (like axios), return it directly.
  if (res && typeof res.json === "function") {
    return await res.json();
  }

  return res;
}

// --------------------
// DELETE AVAILABILITY
// --------------------
export async function deleteAvailability(token, businessId, availabilityId) {
  if (!token || !businessId || !availabilityId) {
    throw new Error("Missing required parameters for deleteAvailability");
  }

  const res = await request(
    `/business/${businessId}/availabilities/${availabilityId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  // If res has 'ok', it might be a raw fetch Response
  if (res.ok !== undefined && typeof res.json === "function") {
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || "Failed to delete availability");
    }
    return await res.json();
  }

  // Otherwise, assume it's already parsed JSON
  return res;
}

// --------------------
// CREATE RESOURCE
// --------------------
// --------------------
// CREATE RESOURCE
// --------------------
export async function createResource(token, businessId, payload) {
  if (!token || !businessId || !payload || !payload.name) {
    throw new Error("Missing required parameters for createResource");
  }

  // request() ALREADY returns parsed JSON
  const data = await request(`/resources`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...payload, businessId }),
  });

  // If backend sends { error: "..." }
  if (data?.error) {
    throw new Error(data.error);
  }

  return data; // ✅ resource object
}

// --------------------
// LIST RESOURCES
// --------------------
export async function listBusinessResources(token, businessId) {
  if (!token || !businessId) {
    throw new Error("Missing required parameters");
  }

  const data = await request(`/resources/business/${businessId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (data?.error) {
    throw new Error(data.error);
  }

  return data; // array
}

// --------------------
// GET SINGLE RESOURCE
// --------------------
export async function getResource(token, businessId) {
  if (!token || !businessId) {
    throw new Error("Missing required parameters for getResource");
  }

  try {
    const res = await request(`/resources/business/${businessId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // If using Axios, the data is in res.data
    return res; // this should be your array of resources
  } catch (err) {
    console.error("getResource API error:", err);
    throw new Error(err.response?.data?.error || "Failed to fetch resource");
  }
}

// --------------------
// UPDATE RESOURCE
// --------------------
export async function updateResource(token, resourceId, payload) {
  const res = await request(`/resources/${resourceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return res;
}

// --------------------
// DELETE RESOURCE
// --------------------
export async function deleteResource(token, resourceId) {
  if (!token || !resourceId) {
    throw new Error("Missing required parameters for deleteResource");
  }

  const res = await request(`/resources/${resourceId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to delete resource");
  }

  return res.json();
}

export async function listBusinessAppointments(token, businessId) {
  return request(`/business/${businessId}/appointments`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function cancelAppointment(token, businessId, appointmentId) {
  return request(
    `/business/${businessId}/appointments/${appointmentId}/cancel`,
    { method: "PATCH", headers: { Authorization: `Bearer ${token}` } },
  );
}

export async function createCategory(token, formData) {
  return request(`/categories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, // ✅ SEND FORMDATA DIRECTLY
  });
}

export async function listBusinessCategories(token, businessId) {
  return request(`/business/${businessId}/categories`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function listPublicCategories(slug) {
  return request(`/public/${slug}/categories`);
}

export async function listPublicCategoriesById(id) {
  return request(`/public/id/${id}/categories`);
}

export async function getAvailability(
  slugOrId,
  categoryId,
  start,
  end,
  byId = false,
) {
  if (byId) {
    return request(
      `/public/id/${slugOrId}/categories/${categoryId}/availability?start=${start}&end=${end}`,
    );
  }
  return request(
    `/public/${slugOrId}/categories/${categoryId}/availability?start=${start}&end=${end}`,
  );
}

export async function bookAppointment(slug, payload) {
  return request(`/public/${slug}/appointments`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function bookAppointmentById(id, payload) {
  return request(`/public/id/${id}/appointments`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getDashboardAnalytics(token) {
  return request("/analytics/overview", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function listMyPayments(token) {
  return request("/payments", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getPaymentDetails(token, paymentId) {
  return request(`/payments/${paymentId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// admin routes

export async function getAllUsers(token) {
  return request("/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createPlans(token, payload) {
  return request("/plans", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function getAllPlans() {
  return request("/plans", {
    method: "GET",
  });
}

export async function updatePlans(token, planId, payload) {
  return request(`/plans/${planId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deletePlans(token, planId) {
  return request(`/plans/${planId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getAllCategories(token) {
  return request("/categories", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateCategories(token, categoryId, payload) {
  return request(`/categories/${categoryId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteCategories(token, categoryId) {
  return request(`/categories/${categoryId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export default {
  login,
  loginWithGoogle,
  register,
  updatePassword,
  listPlans,
  createPlan,
  checkoutPlan,
  createRazorpayOrder,
  getPaymentProviders,
  confirmCheckout,
  confirmRazorpay,
  createBusiness,
  updateBusiness,
  createCategory,
  createAvailability,
  listBusinessAvailabilities,
  deleteAvailability,
  listBusinessCategories,
  listBusinessAppointments,
  cancelAppointment,
  listPublicCategories,
  getAvailability,
  bookAppointment,
  listMyBusinesses,
  getDashboardAnalytics,
  createResource,
  listBusinessResources,
  deleteResource,
  getResource,
  updateResource,

  // 🔥 admin
  getAllUsers,
  createPlans,
  getAllPlans,
  updatePlans,
  deletePlans,
  getAllCategories,
  updateCategories,
  deleteCategories,
  updateAvailability,
  listMyPayments,
};
