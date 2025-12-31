import { useLocalization } from "../contexts/LocalizationContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLocalization();

  return (
    <footer className="w-full bg-slate-900 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-white text-lg mb-4">
              {t("appName")}
            </h3>
            <p className="text-sm text-slate-300">{t("builtFor")}</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">
              {t("productLabel")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition"
                >
                  {t("featuresLabel")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition"
                >
                  {t("pricing")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition"
                >
                  {t("security")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">
              {t("companyLabel")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition"
                >
                  {t("about")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition"
                >
                  {t("blog")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition"
                >
                  {t("contact")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">
              {t("legalLabel")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition"
                >
                  {t("privacy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition"
                >
                  {t("terms")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition"
                >
                  {t("cookiePolicy")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-sm text-slate-300">
            <div>
              © {currentYear} {t("appName")}. {t("builtFor")}
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">
                {t("twitter")}
              </a>
              <a href="#" className="hover:text-white transition">
                {t("linkedin")}
              </a>
              <a href="#" className="hover:text-white transition">
                {t("github")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
