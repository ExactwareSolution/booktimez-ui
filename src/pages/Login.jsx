import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight } from "lucide-react";
import jwt_decode from "jwt-decode"; // v3 works with default import
import { useLocalization } from "../contexts/LocalizationContext";

export default function Login() {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Google OAuth redirect
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.substring(1)); // remove "#"
    const idToken = params.get("id_token"); // ✅ use ID token (JWT)
    if (idToken) {
      handleGoogleCallback(idToken);
      // Remove hash from URL
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Handle Google ID token
  async function handleGoogleCallback(idToken) {
    if (!idToken) {
      setError("No token found from Google.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const decoded = jwt_decode(idToken);
      const payload = {
        email: decoded.email,
        googleId: decoded.sub,
        name: decoded.name,
      };

      const resp = await loginWithGoogle(payload);

      if (resp?.token && resp?.user) {
        localStorage.setItem(
          "btz_auth",
          JSON.stringify({
            token: resp.token,
            user: resp.user,
            isBusinessAvailable: resp.isBusinessAvailable,
          })
        );

        if (resp.user.role === "admin") {
          console.log("==============>", resp.user.role);
          navigate("/dashboard/overview");
        } else {
          navigate("/dashboard/bookings");
        }
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  // Trigger Google OAuth
  function handleGoogleSignIn() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError("Google Sign-In is not configured.");
      return;
    }

    const redirectUri = `${window.location.origin}/login`;
    const scope = "openid profile email";
    const responseType = "id_token token"; // ✅ request ID token + access token

    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=${encodeURIComponent(
      responseType
    )}&scope=${encodeURIComponent(scope)}&nonce=nonce`;

    window.location.href = oauthUrl;
  }

  // Email/password login
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const resp = await login(email, password);
      if (resp?.token) {
        localStorage.setItem(
          "btz_auth",
          JSON.stringify({
            token: resp.token,
            user: resp.user,
            isBusinessAvailable: resp.isBusinessAvailable,
          })
        );
        if (resp.user.role === "admin") {
          console.log("==============>", resp.user.role);
          navigate("/dashboard/overview");
        } else {
          navigate("/dashboard/bookings");
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{t("signIn")}</h1>
        <p className="text-gray-600 mb-8">{t("welcomeBack")}</p>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-3 font-semibold hover:bg-gray-50 shadow-sm transition disabled:opacity-50"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
            alt="Google logo"
          />
          {t("signInWithGoogle")}
        </button>

        {/* Divider */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-sm text-gray-500">
              {t("orContinueWithEmail")}
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-shake">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t("email")}
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5a2a5c] focus:border-[#5a2a5c] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t("password")}
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5a2a5c] focus:border-[#5a2a5c] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? t("signingIn") : t("signIn")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
