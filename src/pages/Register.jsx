import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useLocalization } from "../contexts/LocalizationContext";

export default function Register() {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const { save } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const resp = await api.register(email, password, name);
    if (resp && resp.token) {
      save(resp.user, resp.token);
      navigate("/dashboard");
    } else {
      alert("Register failed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white text-black rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{t("createAccount")}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          placeholder={t("yourName")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder={t("password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full px-4 py-2 bg-black text-white rounded">
          {t("createAccount")}
        </button>
      </form>
    </div>
  );
}
