import React, { useState, useEffect } from "react";
import { X, DollarSign, Zap, Rocket, Check, Loader } from "lucide-react";
import { useLocalization } from "../../contexts/LocalizationContext";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

/* =======================
   CURRENCY CONFIG
======================= */

// backend sends price in INR (ex: 49900 = ₹499)
const INR_TO_USD = 90;

const formatUSD = (inr) => {
  if (!inr || inr === 0) return "0";
  return Math.round(inr / INR_TO_USD);
};

/* =======================
   COMPONENT
======================= */

const UpgradeModal = ({ onClose }) => {
  const { token } = useAuth();
  const { t } = useLocalization();

  const [plans, setPlans] = useState([]);
  const [fetchingPlans, setFetchingPlans] = useState(true);

  const [view, setView] = useState("plans"); // plans | provider
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [provider, setProvider] = useState("stripe");
  const [isProcessing, setIsProcessing] = useState(false);

  /* =======================
     ICON MAP
  ======================= */

  const getPlanIcon = (code = "") => {
    const c = code.toLowerCase();
    if (c === "pro") return Rocket;
    if (c === "standard") return Zap;
    return DollarSign;
  };

  /* =======================
     FETCH PLANS
  ======================= */

  useEffect(() => {
    async function loadPlans() {
      try {
        setFetchingPlans(true);

        const res = await api.listPlans(token);

        // supports [] OR {plans:[]}
        const list = Array.isArray(res) ? res : res?.plans || [];

        setPlans(list);
      } catch (err) {
        console.error("Fetch plans failed", err);
      } finally {
        setFetchingPlans(false);
      }
    }

    loadPlans();

    /* Stripe success redirect */
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      api
        .confirmStripe(token, { sessionId })
        .then((res) => {
          if (res?.planId) {
            updateLocalPlan(res);
          }
          window.history.replaceState({}, "", "/dashboard/bookings");
        })
        .catch(console.error);
    }
  }, [token]);

  /* =======================
     LOCAL STORAGE UPDATE
  ======================= */

  const updateLocalPlan = (plan) => {
    try {
      const raw = localStorage.getItem("btz_auth");
      if (!raw) return;

      const data = JSON.parse(raw);

      data.user.planId = plan.planId;
      data.user.planCode = plan.planCode;
      data.user.planName = plan.planName;

      localStorage.setItem("btz_auth", JSON.stringify(data));
    } catch (err) {
      console.error("Local update failed", err);
    }
  };

  /* =======================
     PLAN LIST VIEW
  ======================= */

  const PlanSelection = () => {
    if (fetchingPlans) {
      return (
        <div className="h-96 flex flex-col justify-center items-center">
          <Loader className="w-8 h-8 animate-spin text-violet-600" />
          <p className="mt-3 text-gray-500">Loading plans...</p>
        </div>
      );
    }

    return (
      <div className="space-y-10">
        <header className="text-center">
          <h2 className="text-4xl font-bold">{t("chooseYourPlan")}</h2>
          <p className="text-gray-500 mt-2">{t("scaleYourBusiness")}</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = getPlanIcon(plan.code || plan.name);
            const isSelected = selectedPlan?.id === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`p-8 rounded-2xl border cursor-pointer transition
                ${
                  isSelected
                    ? "border-violet-600 ring-2 ring-violet-200"
                    : "border-slate-200 hover:border-violet-300"
                }`}
              >
                <Icon className="w-10 h-10 text-violet-600 mb-4" />

                <h3 className="text-2xl font-bold">{plan.name}</h3>

                <div className="mt-3">
                  <span className="text-4xl font-extrabold">
                    ${formatUSD(plan.price)}
                  </span>
                  <span className="text-gray-400"> / month</span>
                </div>

                {/* FEATURES */}
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  <li className="flex">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    {plan.maxBookingsPerMonth || "Unlimited"} bookings
                  </li>

                  <li className="flex">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    {plan.maxBusinesses || "Unlimited"} businesses
                  </li>

                  {plan.notificationsIncluded && (
                    <li className="flex">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      Notifications
                    </li>
                  )}

                  {plan.brandingRemoved && (
                    <li className="flex">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      No branding
                    </li>
                  )}
                </ul>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!token) return (window.location.href = "/login");
                    setSelectedPlan(plan);
                    setView("provider");
                  }}
                  className={`mt-6 w-full py-3 rounded-xl font-semibold
                  ${
                    isSelected
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  {t("selectPlan")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* =======================
     PROVIDER VIEW
  ======================= */

  const ProviderSelection = () => {
    const handlePay = async () => {
      if (!selectedPlan) return;

      try {
        setIsProcessing(true);

        /* Razorpay */
        if (provider === "razorpay") {
          const res = await api.createRazorpayOrder(token, selectedPlan.id);

          if (!res?.order) return;

          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          document.body.appendChild(script);

          script.onload = () => {
            const rzp = new window.Razorpay({
              key: res.keyId,
              order_id: res.order.id,
              amount: res.order.amount,
              currency: res.order.currency,
              name: selectedPlan.name,

              handler: async (response) => {
                const confirm = await api.confirmRazorpay(token, {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                });

                if (confirm?.ok) {
                  updateLocalPlan(confirm);
                  window.location.href = "/dashboard/bookings";
                }
              },
            });

            rzp.open();
            setIsProcessing(false);
          };
        } else {
          /* Stripe */
          const res = await api.checkoutPlan(token, selectedPlan.id);

          if (res?.url) {
            window.location.href = res.url;
          }
        }
      } catch (err) {
        console.error(err);
        alert("Payment failed");
        setIsProcessing(false);
      }
    };

    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h3 className="text-2xl font-bold">Payment Method</h3>

        <p className="text-gray-500 mb-6">Upgrade to {selectedPlan.name}</p>

        {["stripe", "razorpay"].map((p) => (
          <button
            key={p}
            onClick={() => setProvider(p)}
            className={`w-full p-4 mb-3 rounded-xl border flex justify-between
            ${
              provider === p
                ? "border-violet-600 bg-violet-50"
                : "border-slate-200"
            }`}
          >
            <span className="capitalize font-semibold">{p}</span>
            <span>{provider === p ? "✓" : ""}</span>
          </button>
        ))}

        <button
          disabled={isProcessing}
          onClick={handlePay}
          className="w-full mt-6 py-4 bg-violet-600 text-white rounded-xl font-bold"
        >
          {isProcessing ? (
            <Loader className="animate-spin mx-auto" />
          ) : (
            `Pay $${formatUSD(selectedPlan.price)}`
          )}
        </button>

        <button
          onClick={() => setView("plans")}
          className="w-full mt-4 text-sm text-gray-400"
        >
          Change Plan
        </button>
      </div>
    );
  };

  /* =======================
     MAIN RENDER
  ======================= */

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto">
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between mb-8">
            <h1 className="text-xl font-bold">Upgrade</h1>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {view === "plans" && <PlanSelection />}
          {view === "provider" && selectedPlan && <ProviderSelection />}
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
