import React, { useEffect, useState } from "react";
import * as api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useLocalization } from "../contexts/LocalizationContext";
import { Check, X } from "lucide-react";

/* =======================
   PRICE FORMAT
======================= */
const INR_TO_USD = 90;

const formatUSD = (inr) => {
  if (!inr || inr === 0) return "0";
  return Math.round(inr / INR_TO_USD);
};

export default function Plans() {
  const { token } = useAuth();
  const { t } = useLocalization();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =======================
     LOAD PLANS
  ======================= */
  useEffect(() => {
    async function loadPlans() {
      try {
        setLoading(true);

        const res = await api.listPlans();

        // supports [] OR {plans:[]}
        const list = Array.isArray(res) ? res : res?.plans || [];

        setPlans(list);
      } catch (err) {
        console.error("Failed to load plans", err);
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  /* =======================
     BOOL ICON
  ======================= */
  const BoolIcon = ({ value }) =>
    value ? (
      <Check className="inline w-4 h-4 text-green-500 ml-1" />
    ) : (
      <X className="inline w-4 h-4 text-red-500 ml-1" />
    );

  /* =======================
     LANGUAGE MAP
  ======================= */
  const languageMap = {
    en: "English",
    hi: "Hindi",
    ar: "Arabic",
  };

  const formatLanguages = (langs = []) =>
    langs.map((l) => languageMap[l] || l.toUpperCase()).join(", ");

  /* =======================
     FEATURE ROW
  ======================= */
  const FeatureRow = ({ label, children }) => (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{children}</span>
    </div>
  );

  /* =======================
     UPGRADE HANDLER
  ======================= */
  async function handleUpgrade(plan) {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const useRazor = window.confirm(
        "Pay with Razorpay?\nOK = Razorpay\nCancel = Stripe",
      );

      /* ---------- Razorpay ---------- */
      if (useRazor) {
        const res = await api.createRazorpayOrder(token, plan.id);

        if (!res?.order) {
          alert("Order creation failed");
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);

        script.onload = () => {
          const rzp = new window.Razorpay({
            key: res.keyId,
            amount: res.order.amount,
            currency: res.order.currency,
            order_id: res.order.id,
            name: plan.name,

            handler: async (response) => {
              const confirm = await api.confirmRazorpay(token, {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (confirm?.ok) {
                window.location.href = "/dashboard/bookings";
              } else {
                alert("Payment verification failed");
              }
            },
          });

          rzp.open();
        };

        return;
      }

      /* ---------- Stripe ---------- */
      const res = await api.checkoutPlan(token, plan.id);

      if (res?.url) {
        window.location.href = res.url;
      } else {
        alert("Stripe checkout failed");
      }
    } catch (err) {
      console.error(err);
      alert("Checkout error");
    }
  }

  /* =======================
     UI
  ======================= */
  return (
    <section className="w-full bg-gradient-to-b from-white to-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0d0950]">
            {t("chooseYourPlan")}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("scaleYourBusiness")}
          </p>
        </div>

        {/* PLANS GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            <p className="text-center text-slate-500">Loading plans...</p>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white border rounded-2xl p-8 hover:shadow-lg transition"
              >
                {/* NAME */}
                <h3 className="text-2xl font-bold mb-2 text-[#0d0950]">
                  {plan.name}
                </h3>

                {/* PRICE */}
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-[#0d0950]">
                    ${formatUSD(plan.price)}
                  </span>
                  <span className="ml-2 text-sm text-slate-500">/ month</span>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleUpgrade(plan)}
                  className="w-full mb-8 py-3 rounded-xl font-semibold border border-slate-900 text-[#0d0950] hover:bg-slate-900 hover:text-white"
                >
                  {t("selectPlan")}
                </button>

                {/* FEATURES */}
                <div className="space-y-4 pt-4 border-t">
                  <FeatureRow label="Max Bookings">
                    {plan.maxBookingsPerMonth || "Unlimited"}
                  </FeatureRow>

                  <FeatureRow label="Categories">
                    {plan.maxCategories || "Unlimited"}
                  </FeatureRow>

                  <FeatureRow label="Businesses">
                    {plan.maxBusinesses || "Unlimited"}
                  </FeatureRow>

                  <FeatureRow label="Branding Removed">
                    <BoolIcon value={plan.brandingRemoved} />
                  </FeatureRow>

                  <FeatureRow label="Notifications">
                    <BoolIcon value={plan.notificationsIncluded} />
                  </FeatureRow>

                  <FeatureRow label="Languages">
                    {formatLanguages(plan.languages)}
                  </FeatureRow>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
