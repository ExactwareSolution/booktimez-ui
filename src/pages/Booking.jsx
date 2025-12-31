import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../services/api";
import { useLocalization } from "../contexts/LocalizationContext";
import logo from "../assets/BookingTimez.jpg";

export default function Booking() {
  const { t } = useLocalization();
  const { slug, id } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [slots, setSlots] = useState([]);
  const [chosenSlot, setChosenSlot] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    async function load() {
      let res;
      if (id) res = await api.listPublicCategoriesById(id);
      else res = await api.listPublicCategories(slug);
      if (!res) return;
      if (res.business) setBusiness(res.business);
      if (res.categories) {
        setCategories(res.categories);
        if (res.categories.length) setSelectedCategory(res.categories[0]);
      }
    }
    load();
  }, [slug, id]);

  useEffect(() => {
    async function loadSlots() {
      if (!selectedCategory) return setSlots([]);
      setLoadingSlots(true);
      try {
        const res = await api.getAvailability(
          id || slug,
          selectedCategory.id,
          selectedDate,
          selectedDate,
          Boolean(id)
        );
        if (res && res.slots) setSlots(res.slots);
        else setSlots([]);
      } catch (err) {
        console.error("Failed to load slots", err);
        setSlots([]);
      }
      setLoadingSlots(false);
    }
    loadSlots();
  }, [selectedCategory, selectedDate]);

  async function handleBook(e) {
    e && e.preventDefault();
    if (!selectedCategory || !chosenSlot)
      return setMessage("Please select a slot");
    if (!name || !String(name).trim())
      return setMessage("Please enter your name");

    setShowModal(true);
    setBookingResult(null);
    setBusy(true);
    setMessage("");

    const payload = {
      categoryId: selectedCategory.id,
      startAt: chosenSlot.start,
      customerName: name,
      customerEmail: email || undefined,
      customerPhone: phone || undefined,
    };

    try {
      const res = id
        ? await api.bookAppointmentById(id, payload)
        : await api.bookAppointment(slug, payload);
      if (res && res.id) {
        setBookingResult(res);
        setMessage("Booking confirmed — reference: " + res.id);
        setChosenSlot(null);

        // refresh slots
        setLoadingSlots(true);
        try {
          const refreshRes = await api.getAvailability(
            id || slug,
            selectedCategory.id,
            selectedDate,
            selectedDate,
            Boolean(id)
          );
          if (refreshRes && refreshRes.slots) setSlots(refreshRes.slots);
          else setSlots([]);
        } catch (err) {
          console.error("Failed to load slots", err);
          setSlots([]);
        }
        setLoadingSlots(false);
      } else if (res && res.error) {
        setBookingResult({ error: res.error });
        setMessage("Failed: " + res.error);
      } else {
        setBookingResult({ error: "Booking failed" });
        setMessage("Booking failed");
      }
    } catch (err) {
      console.error(err);
      setBookingResult({ error: "Booking failed" });
      setMessage("Booking failed");
    }

    setBusy(false);
  }

  function handleCloseModal() {
    setShowModal(false);
    navigate("/");
  }

  const UPLOADS_BASE =
    (
      import.meta.env.VITE_API_BASE ||
      "https://zd4hf92j-4000.inc1.devtunnels.ms/api"
    ).replace(/\/api$/, "") + "/uploads";

  return (
    <div className="max-w-6xl mx-auto p-4">
      {business && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col md:flex-row items-center gap-4">
          <img
            src={business.logoUrl || logo}
            alt={business.name}
            className="w-28 h-28 object-fit-cover rounded-lg shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{business.name}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {business.description || business.slug}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(categories || []).map((c) => (
                <span
                  key={c.id}
                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="sticky top-6 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Services / Categories</h3>
            <div className="space-y-3 overflow-x-auto">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCategory(c);
                    setChosenSlot(null);
                    setSelectedDate(new Date().toISOString().slice(0, 10));
                    setMessage("");
                  }}
                  className={`w-full text-left p-3 rounded border ${
                    selectedCategory && selectedCategory.id === c.id
                      ? "border-violet-600 bg-violet-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">
                    {c.durationMinutes || 30} minutes
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded shadow-md max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-3">
              {t("bookAnAppointment")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="md:col-span-1">
                <label className="text-xs text-gray-600">{t("date")}</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-gray-600">{t("slots")}</label>

                <div className="mt-2">
                  {loadingSlots ? (
                    <div className="flex items-center justify-center p-6">
                      <svg
                        className="w-8 h-8 text-violet-600 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {slots.length === 0 && (
                        <div className="text-sm text-gray-500">
                          {t("noSlots")}
                        </div>
                      )}
                      {slots.map((s) => (
                        <button
                          key={s.start}
                          onClick={() => setChosenSlot(s)}
                          disabled={busy}
                          aria-pressed={
                            chosenSlot && chosenSlot.start === s.start
                          }
                          className={`p-2 text-sm rounded border transition-transform transform hover:scale-105 focus:scale-105 ${
                            chosenSlot && chosenSlot.start === s.start
                              ? "bg-violet-600 text-white"
                              : "bg-white text-gray-700"
                          }`}
                        >
                          <div className="font-medium">
                            {new Date(s.start).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="text-xs">{s.localLabel}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleBook} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="col-span-1 p-2 border rounded"
                  placeholder={`${t("yourName")}*`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="col-span-1 p-2 border rounded"
                  placeholder={t("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="col-span-1 p-2 border rounded"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {message && (
                <div className="text-sm text-center text-gray-700">
                  {message}
                </div>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => {
                    setName("");
                    setEmail("");
                    setPhone("");
                    setChosenSlot(null);
                    setMessage("");
                  }}
                >
                  {t("reset")}
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-4 py-2 bg-violet-600 text-white rounded"
                >
                  {busy ? t("processingBooking") : t("confirmBooking")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={handleCloseModal}
          ></div>
          <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6">
            {busy && (
              <div className="flex flex-col items-center gap-3">
                <svg
                  className="w-12 h-12 text-violet-600 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                <div className="text-lg font-medium">
                  {t("processingBooking")}
                </div>
                <div className="text-sm text-gray-600">
                  Please don't close this window.
                </div>
              </div>
            )}

            {!busy && bookingResult && !bookingResult.error && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">
                  {t("bookingConfirmed")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("reference")}:{" "}
                  <span className="font-medium">{bookingResult.id}</span>
                </p>
                <p className="text-sm">
                  {t("businessLabel")}: <strong>{business?.name || "-"}</strong>
                </p>
                <p className="text-sm">
                  {t("serviceLabel")}:{" "}
                  <strong>{selectedCategory?.name || "-"}</strong>
                </p>
                <p className="text-sm">
                  {t("startLabel")}:{" "}
                  <strong>
                    {chosenSlot
                      ? new Date(chosenSlot.start).toLocaleString()
                      : bookingResult.startAt
                      ? new Date(bookingResult.startAt).toLocaleString()
                      : "-"}
                  </strong>
                </p>
                <div className="pt-3 flex justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-violet-600 text-white rounded"
                  >
                    {t("done")}
                  </button>
                </div>
              </div>
            )}

            {!busy && bookingResult && bookingResult.error && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-red-600">
                  {t("bookingFailed")}
                </h3>
                <p className="text-sm text-gray-600">{bookingResult.error}</p>
                <div className="pt-3 flex justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 border rounded"
                  >
                    {t("close")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
