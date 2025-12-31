import React, { useEffect, useState } from "react";
import * as api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useLocalization } from "../contexts/LocalizationContext";

export default function Plans() {
  const { token, user } = useAuth();
  const { t } = useLocalization();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  // Admin form state
  const [form, setForm] = useState({
    name: "",
    monthlyPriceCents: 0,
    maxBookingsPerMonth: null,
    maxBusinesses: null,
    maxCategories: null,
    languages: "en",
    brandingRemoved: false,
    notificationsIncluded: true,
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const resp = await api.listPlans();
        setPlans(resp.plans || []);
      } catch (e) {
        console.error("Failed to load plans", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleCreatePlan(e) {
    e.preventDefault();
    if (!token) return alert("Must be signed in as admin");
    try {
      const payload = {
        ...form,
        languages: (form.languages || "").split(",").map((s) => s.trim()),
        monthlyPriceCents: Number(form.monthlyPriceCents) || 0,
      };
      const res = await api.createPlan(token, payload);
      if (res && res.plan) {
        setPlans((p) => [res.plan, ...p]);
        setForm({
          name: "",
          monthlyPriceCents: 0,
          maxBookingsPerMonth: null,
          maxBusinesses: null,
          maxCategories: null,
          languages: "en",
          brandingRemoved: false,
          notificationsIncluded: true,
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create plan");
    }
  }

  async function handleUpgrade(plan) {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      // Ask user which payment method to use
      const useRazor = window.confirm(
        "Pay with Razorpay? OK = Razorpay, Cancel = Stripe"
      );

      if (useRazor) {
        const resp = await api.createRazorpayOrder(token, plan.id);
        if (resp && resp.order) {
          // Load Razorpay checkout script
          const keyId = resp.keyId;
          const order = resp.order;
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          document.body.appendChild(script);

          script.onload = () => {
            const options = {
              key: keyId,
              amount: order.amount,
              currency: order.currency,
              name: plan.name,
              order_id: order.id,
              handler: async function (response) {
                try {
                  // Confirm payment on server
                  const confirmResp = await api.confirmRazorpay(token, {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    planId: plan.id,
                  });
                  if (confirmResp && confirmResp.ok) {
                    window.location.href = "/dashboard";
                  } else {
                    alert("Payment verification failed");
                  }
                } catch (e) {
                  console.error(e);
                  alert("Verification error");
                }
              },
              prefill: {},
              theme: { color: "#7c3aed" },
            };

            // @ts-ignore
            const rzp = new window.Razorpay(options);
            rzp.open();
          };
        } else {
          alert("Failed to create Razorpay order");
        }
        return;
      }

      // Default: Stripe
      const resp = await api.checkoutPlan(token, plan.id);
      if (resp && resp.url) {
        window.location.href = resp.url;
      } else {
        alert("Failed to create checkout session");
      }
    } catch (err) {
      console.error(err);
      alert("Checkout error");
    }
  }

  return (
    <section className="w-full bg-gradient-to-b from-white to-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0d0950]">
            {t("chooseYourPlan")}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("scaleYourBusiness")}
          </p>
        </div>

        {user?.role === "admin" && (
          <form
            onSubmit={handleCreatePlan}
            className="mb-8 bg-white p-6 rounded-lg border"
          >
            <h3 className="font-semibold mb-4">Admin — Create Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="p-2 border rounded"
              />
              <input
                value={form.monthlyPriceCents}
                onChange={(e) =>
                  setForm({ ...form, monthlyPriceCents: e.target.value })
                }
                placeholder="Monthly price (cents)"
                className="p-2 border rounded"
              />
              <input
                value={form.languages}
                onChange={(e) =>
                  setForm({ ...form, languages: e.target.value })
                }
                placeholder="Languages (comma)"
                className="p-2 border rounded"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-violet-600 text-white rounded">
                Create
              </button>
            </div>
          </form>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            <div>Loading...</div>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id || plan.name}
                className={`rounded-2xl transition-all duration-300 ${
                  plan.recommended
                    ? "ring-2 ring-slate-900 shadow-xl scale-105 bg-slate-900 text-white p-8"
                    : "border border-slate-200 bg-white p-8 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    plan.recommended ? "text-white" : "text-[#0d0950]"
                  }`}
                >
                  {plan.name}
                </h3>
                <div
                  className={`mb-6 ${
                    plan.recommended ? "text-slate-100" : "text-slate-600"
                  }`}
                >
                  <span
                    className={`text-4xl font-bold ${
                      plan.recommended ? "text-white" : "text-[#0d0950]"
                    }`}
                  >
                    ${(plan.monthlyPriceCents / 100).toFixed(0)}
                  </span>
                  <span className="text-sm ml-2">Per month</span>
                </div>

                <button
                  onClick={() => handleUpgrade(plan)}
                  className={`w-full mb-8 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    plan.recommended
                      ? "bg-white text-[#0d0950] hover:bg-slate-50"
                      : "border border-slate-300 text-[#0d0950] hover:bg-slate-50"
                  }`}
                >
                  {plan.monthlyPriceCents > 0
                    ? t("selectPlan")
                    : t("chooseYourPlan")}
                </button>

                <div
                  className={`space-y-3 ${
                    plan.recommended ? "text-slate-100" : "text-slate-600"
                  }`}
                >
                  <div className="text-sm">
                    Max bookings: {plan.maxBookingsPerMonth || "—"}
                  </div>
                  <div className="text-sm">
                    Max categories: {plan.maxCategories || "—"}
                  </div>
                  <div className="text-sm">
                    Languages: {(plan.languages || []).join(", ")}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
