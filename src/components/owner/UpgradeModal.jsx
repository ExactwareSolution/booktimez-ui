// import React, { useState, useEffect } from "react";
// import {
//   X,
//   CheckCircle,
//   DollarSign,
//   Zap,
//   Rocket,
//   Check,
//   CreditCard,
//   Loader,
// } from "lucide-react";
// import { useLocalization } from "../../contexts/LocalizationContext";
// import { useAuth } from "../../contexts/AuthContext";
// import  api from "../../services/api";

// const PRIMARY_COLOR = "violet-600";
// const ACCENT_COLOR = "green-500";
// const ACCENT_BG = "green-100";

// // Mock Plan Data
// // const plans = [
// //   {
// //     id: "basic",
// //     name: "Basic",
// //     price: "9",
// //     duration: "month",
// //     description: "For individuals and small teams just starting out.",
// //     features: [
// //       "1,000 appointments/month",
// //       "Basic reports",
// //       "Standard support",
// //       "3 users",
// //     ],
// //     icon: Zap,
// //     recommended: false,
// //   },
// //   {
// //     id: "pro",
// //     name: "Pro",
// //     price: "29",
// //     duration: "month",
// //     description: "Perfect for growing businesses needing more power.",
// //     features: [
// //       "Unlimited appointments",
// //       "Advanced analytics & reports",
// //       "Priority support",
// //       "10 users",
// //       "Custom branding",
// //     ],
// //     icon: Rocket,
// //     recommended: true,
// //   },
// //   {
// //     id: "enterprise",
// //     name: "Enterprise",
// //     price: "Custom",
// //     duration: "year",
// //     description: "Scalable solution for large organizations.",
// //     features: [
// //       "All Pro features",
// //       "Dedicated account manager",
// //       "SLA guarantees",
// //       "SSO & audit logs",
// //     ],
// //     icon: DollarSign,
// //     recommended: false,
// //   },
// // ];

// const UpgradeModal = ({ onClose }) => {
//   const [view, setView] = useState("plans"); // 'plans' or 'payment'
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const { t } = useLocalization();
//   const { token } = useAuth();
//   const [provider, setProvider] = useState("stripe"); // 'stripe' | 'razorpay'

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const sessionId = params.get("session_id");
//     if (sessionId) {
//       const token = getAuthToken();
//       api
//         .confirmStripe(token, { sessionId })
//         .then((res) => {
//           if (res && res.planId) {
//             // ✅ Update localStorage
//             updateLocalStoragePlan(res.planId);
//           }
//           window.history.replaceState({}, "", "/dashboard/bookings"); // clean URL
//         })
//         .catch(console.error);
//     }
//   }, []);

//   // --- View 1: Plan Selection ---
//   const PlanSelection = () => (
//     <div className="space-y-10">
//       <header className="text-center">
//         <h2 className="text-4xl font-extrabold text-gray-900">
//           {t("chooseYourPlan")}
//         </h2>
//         <p className="mt-2 text-lg text-gray-500">{t("scaleYourBusiness")}</p>
//       </header>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {plans.map((plan) => (
//           <div
//             key={plan.id}
//             className={`p-8 rounded-xl shadow-lg border-2 transition-all duration-300 cursor-pointer ${
//               selectedPlan?.id === plan.id
//                 ? `border-${PRIMARY_COLOR} ring-4 ring-violet-200`
//                 : "border-gray-200 hover:shadow-xl"
//             } ${plan.recommended ? "bg-violet-50" : "bg-white"}`}
//             onClick={() => setSelectedPlan(plan)}
//           >
//             <plan.icon className={`w-8 h-8 text-${PRIMARY_COLOR}`} />
//             <h3 className="mt-4 text-2xl font-bold text-gray-900">
//               {plan.name}
//             </h3>

//             {plan.recommended && (
//               <span
//                 className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full bg-${ACCENT_BG} text-${ACCENT_COLOR}`}
//               >
//                 {t("recommended")}
//               </span>
//             )}

//             <div className="mt-4">
//               {plan.price !== "Custom" ? (
//                 <>
//                   <span className="text-4xl font-extrabold text-gray-900">
//                     ${plan.price}
//                   </span>
//                   <span className="text-gray-500">/{plan.duration}</span>
//                 </>
//               ) : (
//                 <span className="text-2xl font-extrabold text-gray-900">
//                   {plan.price}
//                 </span>
//               )}
//             </div>
//             <p className="mt-2 text-sm text-gray-500">{plan.description}</p>

//             <ul className="mt-6 space-y-3 text-sm text-gray-600">
//               {plan.features.map((feature) => (
//                 <li key={feature} className="flex items-start">
//                   <Check
//                     className={`w-4 h-4 mr-2 flex-shrink-0 text-${PRIMARY_COLOR}`}
//                   />
//                   {feature}
//                 </li>
//               ))}
//             </ul>

//             <button
//               onClick={() => {
//                 if (plan.id === "enterprise") {
//                   alert(t("contactSales"));
//                   return;
//                 }
//                 if (!token) {
//                   window.location.href = "/login";
//                   return;
//                 }
//                 // Set selected plan and show provider selection
//                 setSelectedPlan(plan);
//                 setProvider("stripe");
//                 setView("provider");
//               }}
//               className={`mt-8 w-full py-3 text-lg font-semibold rounded-lg transition-colors ${
//                 plan.id === selectedPlan?.id
//                   ? `bg-${PRIMARY_COLOR} text-white hover:bg-violet-700`
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//               disabled={plan.id === "enterprise"}
//             >
//               {plan.id === "enterprise" ? t("contactSales") : t("selectPlan")}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   // --- View 2: Payment Simulation ---
//   const PaymentSimulation = () => {
//     const handlePayment = () => {
//       setIsProcessing(true);
//       // Simulate API call delay
//       setTimeout(() => {
//         setIsProcessing(false);
//         setIsSuccess(true);
//         // After successful payment, maybe close modal or show success message
//         setTimeout(() => onClose(), 2000);
//       }, 3000);
//     };

//     if (isSuccess) {
//       return (
//         <div className="flex flex-col items-center justify-center h-96 text-center">
//           <CheckCircle className={`w-16 h-16 text-${ACCENT_COLOR}`} />
//           <h2 className="mt-4 text-3xl font-bold text-gray-900">
//             {t("paymentSuccessful")}
//           </h2>
//           <p className="mt-2 text-gray-500">
//             {t("welcomeToPlanPrefix")}
//             <strong>{selectedPlan.name}</strong>
//             {t("welcomeToPlanSuffix")}
//           </p>
//           <button
//             onClick={onClose}
//             className={`mt-6 px-6 py-3 text-sm font-semibold rounded-lg bg-${PRIMARY_COLOR} text-white hover:bg-violet-700 transition-colors`}
//           >
//             {t("goToDashboard")}
//           </button>
//         </div>
//       );
//     }

//     return (
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//         {/* Payment Form */}
//         <div className="lg:order-2">
//           <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
//             <CreditCard className="w-5 h-5 mr-2 text-gray-600" />{" "}
//             {t("paymentDetails")}
//           </h3>
//           <div className="space-y-4">
//             <input
//               type="text"
//               placeholder={t("cardNumber")}
//               className="w-full border border-gray-300 p-3 rounded-lg text-sm"
//             />
//             <div className="flex space-x-4">
//               <input
//                 type="text"
//                 placeholder={t("mmyy")}
//                 className="w-1/2 border border-gray-300 p-3 rounded-lg text-sm"
//               />
//               <input
//                 type="text"
//                 placeholder={t("cvc")}
//                 className="w-1/2 border border-gray-300 p-3 rounded-lg text-sm"
//               />
//             </div>
//             <input
//               type="text"
//               placeholder={t("cardholderName")}
//               className="w-full border border-gray-300 p-3 rounded-lg text-sm"
//             />
//           </div>

//           <button
//             onClick={handlePayment}
//             disabled={isProcessing}
//             className={`mt-8 w-full py-3 text-lg font-semibold rounded-lg transition-colors flex items-center justify-center ${
//               isProcessing
//                 ? "bg-gray-400 cursor-wait"
//                 : `bg-${PRIMARY_COLOR} text-white hover:bg-violet-700`
//             }`}
//           >
//             {isProcessing ? (
//               <>
//                 <Loader className="w-5 h-5 mr-2 animate-spin" />{" "}
//                 {t("processing")}
//               </>
//             ) : (
//               `${t("payNowPrefix")} $${selectedPlan.price}.00 Now`
//             )}
//           </button>
//         </div>

//         {/* Order Summary */}
//         <div className="lg:order-1 p-6 border border-gray-200 rounded-xl bg-gray-50 h-min">
//           <h3 className="text-xl font-bold text-gray-900 mb-5">
//             {t("orderSummary")}
//           </h3>

//           <div className="space-y-3">
//             <div className="flex justify-between items-center text-gray-700 border-b pb-2">
//               <span className="font-medium">
//                 {selectedPlan.name} Plan ({selectedPlan.duration}ly)
//               </span>
//               <span className="font-semibold">${selectedPlan.price}.00</span>
//             </div>
//             <div className="flex justify-between text-gray-600">
//               <span>{t("taxEst")}</span>
//               <span>${(selectedPlan.price * 0.18).toFixed(2)}</span>
//             </div>

//             <div className="flex justify-between pt-4 border-t border-gray-300 text-lg font-bold">
//               <span>{t("totalDueToday")}</span>
//               <span className={`text-${PRIMARY_COLOR}`}>
//                 ${(Number(selectedPlan.price) * 1.18).toFixed(2)}
//               </span>
//             </div>
//           </div>

//           <div className="mt-6 text-sm text-gray-500">
//             {t("byClickingPayNow")}
//           </div>
//           <button
//             onClick={() => {
//               setView("plans");
//               setSelectedPlan(null);
//             }}
//             className={`mt-4 w-full py-2 text-sm font-semibold rounded-lg transition-colors border border-gray-300 text-gray-700 hover:bg-gray-100`}
//           >
//             {t("changePlan")}
//           </button>
//         </div>
//       </div>
//     );
//   };

//   const updateLocalStoragePlan = (newPlanId) => {
//     try {
//       const raw = localStorage.getItem("btz_auth");
//       if (!raw) return;
//       const data = JSON.parse(raw);
//       data.user.planId = newPlanId;
//       localStorage.setItem("btz_auth", JSON.stringify(data));
//     } catch (err) {
//       console.error("Failed to update localStorage", err);
//     }
//   };

//   // --- View: Provider Selection / Checkout ---
//   const ProviderSelection = () => {
//     const handleProceed = async () => {
//       if (!selectedPlan) return;
//       if (!token) {
//         window.location.href = "/login";
//         return;
//       }

//       if (provider === "razorpay") {
//         try {
//           const resp = await api.createRazorpayOrder(token, selectedPlan.id);
//           if (resp && resp.order) {
//             const keyId = resp.keyId;
//             const order = resp.order;
//             // load Razorpay script
//             const script = document.createElement("script");
//             script.src = "https://checkout.razorpay.com/v1/checkout.js";
//             document.body.appendChild(script);

//             script.onload = () => {
//               const options = {
//                 key: keyId,
//                 amount: order.amount,
//                 currency: order.currency,
//                 name: selectedPlan.name,
//                 order_id: order.id,
//                 handler: async function (response) {
//                   try {
//                     const confirmResp = await api.confirmRazorpay(token, {
//                       razorpay_payment_id: response.razorpay_payment_id,
//                       razorpay_order_id: response.razorpay_order_id,
//                       razorpay_signature: response.razorpay_signature,
//                       planId: selectedPlan.id,
//                     });
//                     if (confirmResp && confirmResp.ok) {
//                       updateLocalStoragePlan(selectedPlan.id);
//                       // success — navigate to dashboard
//                       window.location.href = "/dashboard/bookings";
//                     } else {
//                       alert(
//                         t("bookingFailed") || "Payment verification failed"
//                       );
//                     }
//                   } catch (e) {
//                     console.error(e);
//                     alert(t("bookingFailed") || "Verification error");
//                   }
//                 },
//                 prefill: {},
//                 theme: { color: "#7c3aed" },
//               };

//               // eslint-disable-next-line no-undef
//               const rzp = new window.Razorpay(options);
//               rzp.open();
//             };
//           } else {
//             alert(t("bookingFailed") || "Failed to create Razorpay order");
//           }
//         } catch (err) {
//           console.error("razorpay error", err);
//           alert(t("bookingFailed") || "Checkout failed");
//         }
//         return;
//       }

//       // Default: Stripe
//       try {
//         const resp = await api.checkoutPlan(token, selectedPlan.id);
//         if (resp && resp.url) {
//           window.location.href = resp.url;
//           return;
//         }
//         alert(t("bookingFailed") || "Failed to create checkout session");
//       } catch (err) {
//         console.error(err);
//         alert(t("bookingFailed") || "Checkout error");
//       }
//     };

//     return (
//       <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border border-violet-600">
//         <h3 className="text-xl font-bold mb-4">{t("paymentDetails")}</h3>
//         <div className="flex gap-4 mb-4">
//           <label
//             className={`p-3 border border-violet-600 rounded cursor-pointer ${
//               provider === "stripe" ? "ring-2 ring-violet-200" : ""
//             }`}
//           >
//             <input
//               type="radio"
//               name="provider"
//               checked={provider === "stripe"}
//               onChange={() => setProvider("stripe")}
//               className="mr-2 border border-violet-600"
//             />
//             Stripe
//           </label>
//           <label
//             className={`p-3 border border-violet-600 rounded cursor-pointer ${
//               provider === "razorpay" ? "ring-2 ring-violet-200" : ""
//             }`}
//           >
//             <input
//               type="radio"
//               name="provider"
//               checked={provider === "razorpay"}
//               onChange={() => setProvider("razorpay")}
//               className="mr-2"
//             />
//             Razorpay
//           </label>
//         </div>

//         <div className="flex gap-2">
//           <button
//             onClick={handleProceed}
//             className="px-4 py-2 bg-violet-600 text-white rounded"
//           >
//             {t("payNowPrefix")} ${selectedPlan.price || 0}{" "}
//           </button>
//           <button
//             onClick={() => {
//               setView("plans");
//               setSelectedPlan(null);
//             }}
//             className="px-4 py-2 border border-violet-600 rounded"
//           >
//             {t("changePlan")}
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     // Full-Page Modal Container
//     <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
//       <div className="min-h-screen p-4 md:p-8">
//         {/* Header and Close Button */}
//         <div className="flex justify-end mb-8">
//           <button
//             onClick={onClose}
//             className="p-3 text-gray-500 hover:text-gray-900 rounded-full transition-colors border border-gray-200 hover:bg-gray-100"
//             title={t("closeUpgradeProcess")}
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Main Content Area */}
//         <div className="max-w-7xl mx-auto">
//           {view === "plans" && <PlanSelection />}
//           {view === "provider" && selectedPlan && <ProviderSelection />}
//           {view === "payment" && selectedPlan && <PaymentSimulation />}
//           {/* Fallback */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpgradeModal;

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle,
  DollarSign,
  Zap,
  Rocket,
  Check,
  CreditCard,
  Loader,
} from "lucide-react";
import { useLocalization } from "../../contexts/LocalizationContext";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

const UpgradeModal = ({ onClose }) => {
  const [plans, setPlans] = useState([]);
  const [view, setView] = useState("plans"); // 'plans' | 'provider'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [provider, setProvider] = useState("stripe");

  const { t } = useLocalization();
  const { token } = useAuth();

  // Helper to map icons based on plan code
  const getPlanIcon = (code = "") => {
    const c = code.toLowerCase();
    if (c === "pro") return Rocket;
    if (c === "standard" || c === "zap") return Zap;
    return DollarSign;
  };

  /* ---------------- FETCH PLANS ---------------- */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setFetchingPlans(true);
        const response = await api.listPlans(token);
        // Handle the { plans: [] } structure
        if (response && response.plans) {
          setPlans(response.plans);
        } else if (Array.isArray(response)) {
          setPlans(response);
        }
      } catch (err) {
        console.error("Failed to fetch plans", err);
      } finally {
        setFetchingPlans(false);
      }
    };

    fetchPlans();

    // Handle Stripe Redirect Success logic
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (sessionId) {
      api
        .confirmStripe(token, { sessionId })
        .then((res) => {
          if (res?.planId) updateLocalStoragePlan(res.planId);
          window.history.replaceState({}, "", "/dashboard/bookings");
        })
        .catch(console.error);
    }
  }, [token]);

  const updateLocalStoragePlan = (newPlanId) => {
    try {
      const raw = localStorage.getItem("btz_auth");
      if (!raw) return;
      const data = JSON.parse(raw);
      data.user.planId = newPlanId;
      localStorage.setItem("btz_auth", JSON.stringify(data));
    } catch (err) {
      console.error("Failed to update localStorage", err);
    }
  };

  /* ---------------- VIEWS ---------------- */

  const PlanSelection = () => {
    if (fetchingPlans) {
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <Loader className="w-10 h-10 animate-spin text-violet-600" />
          <p className="mt-4 text-gray-500 font-medium">
            {t("loadingPlans") || "Fetching plans..."}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <header className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">
            {t("chooseYourPlan")}
          </h2>
          <p className="mt-2 text-lg text-gray-500">{t("scaleYourBusiness")}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = getPlanIcon(plan.code || plan.name);
            const isSelected = selectedPlan?.id === plan.id;

            // Generate features from your specific API fields
            const features = [
              `${plan.maxBookingsPerMonth} Bookings/mo`,
              `${plan.maxBusinesses} Business Profile(s)`,
              plan.notificationsIncluded ? "Notifications Included" : null,
              plan.brandingRemoved ? "No Branding" : null,
            ].filter(Boolean);

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`p-8 rounded-[2rem] shadow-lg border-2 transition-all duration-300 cursor-pointer flex flex-col ${
                  isSelected
                    ? "border-violet-600 ring-4 ring-violet-100 bg-white"
                    : "border-gray-100 hover:border-violet-200 bg-white"
                } ${plan.recommended ? "relative border-violet-500" : ""}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                    {t("recommended")}
                  </div>
                )}

                <Icon className="w-10 h-10 text-violet-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>

                <div className="mt-4 mb-2">
                  <span className="text-4xl font-black text-gray-900">
                    ₹{plan.price}
                  </span>
                  <span className="text-gray-400 font-medium ml-1">/mo</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1 mt-6">
                  {features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-sm text-gray-600"
                    >
                      <Check className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!token) return (window.location.href = "/login");
                    setSelectedPlan(plan);
                    setView("provider");
                  }}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    isSelected
                      ? "bg-violet-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {plan.price > 0 ? t("selectPlan") : t("chooseYourPlan")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ProviderSelection = () => {
    const handleProceed = async () => {
      if (!selectedPlan || !token) return;
      setIsProcessing(true);

      try {
        if (provider === "razorpay") {
          const resp = await api.createRazorpayOrder(token, selectedPlan.id);
          if (resp?.order) {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            document.body.appendChild(script);
            script.onload = () => {
              const rzp = new window.Razorpay({
                key: resp.keyId,
                amount: resp.order.amount,
                currency: resp.order.currency,
                name: selectedPlan.name,
                order_id: resp.order.id,
                handler: async (response) => {
                  const confirm = await api.confirmRazorpay(token, {
                    ...response,
                    planId: selectedPlan.id,
                  });
                  if (confirm?.ok) window.location.href = "/dashboard/bookings";
                },
                theme: { color: "#7c3aed" },
              });
              rzp.open();
              setIsProcessing(false);
            };
          }
        } else {
          const resp = await api.checkoutPlan(token, selectedPlan.id);
          if (resp?.url) window.location.href = resp.url;
        }
      } catch (err) {
        alert("Payment initialization failed");
        setIsProcessing(false);
      }
    };

    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          {t("paymentMethod")}
        </h3>
        <p className="text-slate-500 mb-8">Upgrade to {selectedPlan.name}</p>

        <div className="space-y-4 mb-8">
          {["stripe", "razorpay"].map((p) => (
            <button
              key={p}
              onClick={() => setProvider(p)}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                provider === p
                  ? "border-violet-600 bg-violet-50"
                  : "border-slate-100"
              }`}
            >
              <span className="font-bold capitalize">{p}</span>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  provider === p ? "border-violet-600" : "border-slate-300"
                }`}
              >
                {provider === p && (
                  <div className="w-2.5 h-2.5 bg-violet-600 rounded-full" />
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleProceed}
          disabled={isProcessing}
          className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <Loader className="animate-spin" />
          ) : (
            `${t("payNowPrefix")} ₹${selectedPlan.price}`
          )}
        </button>

        <button
          onClick={() => setView("plans")}
          className="w-full mt-4 text-slate-400 text-sm font-medium"
        >
          {t("changePlan")}
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto">
      <div className="min-h-screen p-4 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-violet-600 rounded-lg" />
              <span className="font-black text-xl tracking-tighter uppercase text-slate-900">
                Upgrade
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-full border border-transparent hover:border-slate-200 transition-all text-slate-400 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
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
