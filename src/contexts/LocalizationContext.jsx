// src/contexts/LocalizationContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

// --- Translation Data (Unchanged) ---
const en = {
  // Global / App
  appName: "BookTimez",
  dashboard: "Dashboard",
  logout: "Logout",
  upgrade: "Upgrade",
  changingLanguageAppliesImmediately: "Changing language applies immediately",
  recommendedSize: "Recommended size",
  visualBranding: "Visual branding",
  companyLogo: "Company logo",
  uploadLogo: "Upload logo",
  emailCannotBeChanged: "Email cannot be changed",
  maxFileSize: "Maximum file size",

  // Sidebar
  bookings: "Bookings",
  availabilitySchedules: "Availability Schedule",
  appointments: "Appointments",
  settings: "Settings",
  users: "Users",
  changeAvatar: "Change avatar",

  // Settings
  accountSettings: "Account Settings",
  profile: "Profile",
  branding: "Branding",
  security: "Security",
  localization: "Localization",
  fullName: "Full Name",
  emailAddress: "Email Address",
  saveProfile: "Save Profile",
  currentPassword: "Current Password",
  newPassword: "New Password",
  confirmNewPassword: "Confirm New Password",
  updatePassword: "Update Password",
  displayLanguage: "Display Language",
  timezone: "Timezone",
  timeFormat: "Time Format",
  saveLocalizationSettings: "Save Localization Settings",
  manageYourAccountPreferences: "Manage your account preferences",
  passwordChangeWarning:
    "Changing your password will log you out of all active sessions.",

  // Appointments
  previousAppointments: "Previous Appointments",
  searchClientService: "Search client or service...",
  searchClientCategory: "Search client or category...",
  filterByStatus: "Filter by status",
  all: "All",
  upcoming: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
  client: "Client",
  service: "Service",
  category: "Category",
  dateTime: "Date & Time",
  status: "Status",
  actions: "Actions",
  viewDetails: "View details",
  noAppointmentsFound: "No appointments found matching your criteria.",

  // Auth / Common
  signIn: "Sign in",
  welcomeBack: "Welcome back to BookTimez",
  signInWithGoogle: "Sign in with Google",
  orContinueWithEmail: "Or continue with email",
  email: "Email",
  password: "Password",
  signingIn: "Signing in...",
  createAccount: "Create account",

  // Booking
  bookAnAppointment: "Book an appointment",
  date: "Date",
  slots: "Slots",
  yourName: "Your name",
  reset: "Reset",
  confirmBooking: "Confirm booking",
  processingBooking: "Processing your booking…",
  bookingConfirmed: "Booking confirmed",
  bookingFailed: "Booking failed",
  reference: "Reference",
  businessLabel: "Business",
  serviceLabel: "Service",
  startLabel: "Start",
  noSlots: "No slots",
  done: "Done",
  close: "Close",

  // Header / Footer
  home: "Home",
  login: "Login",
  register: "Register",
  signOut: "Sign out",
  featuresLabel: "Features",
  pricing: "Pricing",
  productLabel: "Product",
  companyLabel: "Company",
  legalLabel: "Legal",
  about: "About",
  blog: "Blog",
  contact: "Contact",
  privacy: "Privacy",
  terms: "Terms",
  cookiePolicy: "Cookie Policy",
  twitter: "Twitter",
  linkedin: "LinkedIn",
  github: "GitHub",
  builtFor: "Built for small businesses worldwide.",

  // Availability / Owner
  availabilityTitle: "Availability schedules",
  manageAvailabilities: "Manage availabilities",
  manageAvailDesc:
    "Create and remove specific availability windows for your businesses.",
  noBusinessesFound: "No businesses found",
  day: "Day",
  categoryLabel: "Category",
  startLabelShort: "Start",
  endLabelShort: "End",
  slotMin: "Slot (min)",
  addAvailability: "Add availability",
  loadingAvailabilities: "Loading availabilities...",
  availabilityDeleted: "Availability deleted",
  failedDeleteAvailability: "Failed to delete availability",
  selectOrCreateBusinessFirst: "Select or create a business first",
  failedCreateAvailability: "Failed to create availability",
  availabilitySaved: "Availability saved",
  noSpecificAvailabilities: "No specific availabilities configured.",
  delete: "Delete",

  // MyBookings / Owner
  bookingDashboard: "Booking dashboard",
  bookingPageFor: "Booking page for",
  open: "Open",
  copy: "Copy",
  copied: "Copied!",
  past: "Past",
  bookingsLabel: "Bookings",
  searchPlaceholder: "Search client or service",
  allStatus: "All status",
  booked: "Booked",
  export: "Export",
  clientLabel: "Client",
  dateTimeLabel: "Date & Time",
  phoneLabel: "Phone",
  statusLabel: "Status",
  actionsLabel: "Actions",
  view: "View",
  reschedule: "Reschedule",
  cancel: "Cancel",
  noActions: "No actions",
  previous: "Previous",
  next: "Next",
  pageText: "Page",
  ofText: "of",
  noBookingsFound: "No bookings found",

  // Upgrade / Plans
  chooseYourPlan: "Choose your plan",
  scaleYourBusiness: "Scale your business with the right subscription.",
  recommended: "Recommended",
  contactSales: "Contact sales",
  selectPlan: "Select plan",
  paymentDetails: "Payment details",
  cardNumber: "Card number",
  mmyy: "MM/YY",
  cvc: "CVC",
  cardholderName: "Cardholder name",
  processing: "Processing...",
  payNowPrefix: "Pay",
  orderSummary: "Order summary",
  taxEst: "Tax (est.)",
  totalDueToday: "Total due today",
  byClickingPayNow: 'By clicking "Pay Now", you agree to the terms of service.',
  changePlan: "Change plan",
  closeUpgradeProcess: "Close upgrade process",
  paymentSuccessful: "Payment successful!",
  welcomeToPlanPrefix: "Welcome to the ",
  welcomeToPlanSuffix: " plan. Your account has been upgraded!",
  goToDashboard: "Go to dashboard",

  // Security helpers
  reEnterNewPassword: "Re-enter new password",
  enterNewPassword: "Enter new password",
  enterCurrentPassword: "Enter current password",
  minCharacters: "(Minimum 8 characters)",

  // Days
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",

  resourceAdded: "Resource added",
  resourceUpdated: "Resource updated",
  resourceDeleted: "Resource deleted",
  addResource: "Add Resource",
  resourceName: "Resource Name",
  selectResources: "Select Resources",
  updateSlot: "Update Slot",
  startTime: "Start Time",
  endTime: "End Time",
  slotDuration: "Slot Duration",
  saveChanges: "Save Changes",
};

const hi = {
  /* App */
  appName: "बुकटाइम्स",

  resourceAdded: "संसाधन जोड़ा गया",
  resourceUpdated: "संसाधन अपडेट किया गया",
  resourceDeleted: "संसाधन हटाया गया",
  addResource: "संसाधन जोड़ें",
  resourcName: "संसाधन नाम",
  selectResources: "संसाधन चुनें",
  updateSlot: "स्लॉट अपडेट करें",
  startTime: "प्रारंभ समय",
  endTime: "समाप्ति समय",
  slotDuration: "स्लॉट अवधि",
  saveChanges: "परिवर्तन सहेजें",

  /* Navigation / Common */
  home: "होम",
  dashboard: "डैशबोर्ड",
  bookings: "बुकिंग",
  availabilitySchedules: "उपलब्धता",
  appointments: "अपॉइंटमेंट्स",
  users: "उपयोगकर्ता",
  settings: "सेटिंग्स",
  upgrade: "अपग्रेड करें",
  login: "लॉगिन",
  register: "रजिस्टर",
  logout: "लॉग आउट",
  signOut: "साइन आउट",
  profile: "प्रोफ़ाइल",

  /* Account / Settings */
  manageYourAccountPreferences: "अपने खाते की प्राथमिकताएं प्रबंधित करें",
  accountSettings: "खाता सेटिंग्स",
  passwordChangeWarning:
    "पासवर्ड बदलने से आप सभी सक्रिय सत्रों से लॉग आउट हो जाएंगे।",
  branding: "ब्रांडिंग",
  security: "सुरक्षा",
  localization: "स्थानीयकरण",

  /* Profile */
  fullName: "पूरा नाम",
  emailAddress: "ईमेल पता",
  emailCannotBeChanged: "ईमेल बदला नहीं जा सकता",
  saveProfile: "प्रोफ़ाइल सहेजें",
  changeAvatar: "प्रोफ़ाइल तस्वीर बदलें",
  maxFileSize: "अधिकतम फ़ाइल आकार",

  /* Branding */
  visualBranding: "दृश्य ब्रांडिंग",
  companyLogo: "कंपनी का लोगो",
  uploadLogo: "लोगो अपलोड करें",
  recommendedSize: "अनुशंसित आकार",

  /* Password */
  currentPassword: "वर्तमान पासवर्ड",
  newPassword: "नया पासवर्ड",
  confirmNewPassword: "नए पासवर्ड की पुष्टि करें",
  reEnterNewPassword: "नया पासवर्ड दोबारा दर्ज करें",
  enterCurrentPassword: "वर्तमान पासवर्ड दर्ज करें",
  enterNewPassword: "नया पासवर्ड दर्ज करें",
  updatePassword: "पासवर्ड अपडेट करें",
  minCharacters: "(कम से कम 8 अक्षर)",

  /* Localization */
  displayLanguage: "प्रदर्शन भाषा",
  timezone: "समय क्षेत्र",
  timeFormat: "समय प्रारूप",
  saveLocalizationSettings: "स्थानीयकरण सेटिंग्स सहेजें",
  changingLanguageAppliesImmediately: "भाषा बदलते ही तुरंत लागू होगी",

  /* Appointments */
  previousAppointments: "पिछली नियुक्तियाँ",
  searchClientService: "ग्राहक या सेवा खोजें...",
  searchClientCategory: "ग्राहक या श्रेणी खोजें...",
  filterByStatus: "स्थिति के अनुसार फ़िल्टर करें",
  all: "सभी",
  completed: "पूर्ण",
  upcoming: "आगामी",
  cancelled: "रद्द",
  client: "ग्राहक",
  service: "सेवा",
  category: "श्रेणी",
  dateTime: "दिनांक और समय",
  status: "स्थिति",
  actions: "कार्य",
  viewDetails: "विवरण देखें",
  noAppointmentsFound:
    "आपके मानदंडों से मेल खाने वाली कोई नियुक्तियाँ नहीं मिलीं।",

  /* Auth */
  signIn: "साइन इन",
  welcomeBack: "बुकटाइम्स में आपका स्वागत है",
  signInWithGoogle: "Google से साइन इन करें",
  orContinueWithEmail: "या ईमेल के साथ जारी रखें",
  email: "ईमेल",
  password: "पासवर्ड",
  signingIn: "साइन इन हो रहा है...",
  createAccount: "खाता बनाएं",

  /* Booking */
  bookAnAppointment: "अपॉइंटमेंट बुक करें",
  date: "तारीख",
  slots: "समय स्लॉट",
  yourName: "आपका नाम",
  reset: "रीसेट",
  confirmBooking: "बुकिंग की पुष्टि करें",
  processingBooking: "आपकी बुकिंग संसाधित की जा रही है…",
  bookingConfirmed: "बुकिंग की पुष्टि हो गई",
  bookingFailed: "बुकिंग विफल",
  reference: "संदर्भ",
  businessLabel: "व्यवसाय",
  serviceLabel: "सेवा",
  startLabel: "प्रारंभ",
  noSlots: "कोई स्लॉट नहीं",
  done: "समाप्त",
  close: "बंद करें",

  /* Header / Footer */
  featuresLabel: "फ़ीचर",
  pricing: "कीमत",
  productLabel: "उत्पाद",
  companyLabel: "कंपनी",
  legalLabel: "कानूनी",
  about: "के बारे में",
  blog: "ब्लॉग",
  contact: "संपर्क",
  privacy: "गोपनीयता",
  terms: "नियम",
  cookiePolicy: "कूकी नीति",
  twitter: "ट्विटर",
  linkedin: "लिंक्डइन",
  github: "गिटहब",
  builtFor: "छोटे व्यवसायों के लिए निर्मित।",

  /* Availability */
  availabilityTitle: "उपलब्धता अनुसूचियाँ",
  manageAvailabilities: "उपलब्धताएँ प्रबंधित करें",
  manageAvailDesc:
    "अपने व्यवसायों के लिए विशिष्ट उपलब्धता विंडो बनाएं और हटाएं।",
  noBusinessesFound: "कोई व्यवसाय नहीं मिला",
  day: "दिन",
  categoryLabel: "श्रेणी",
  startLabelShort: "प्रारंभ",
  endLabelShort: "समाप्त",
  slotMin: "स्लॉट (मिन)",
  addAvailability: "उपलब्धता जोड़ें",
  loadingAvailabilities: "उपलब्धताएं लोड हो रही हैं...",
  availabilityDeleted: "उपलब्धता हटाई गई",
  failedDeleteAvailability: "उपलब्धता हटाने में विफल",
  selectOrCreateBusinessFirst: "कृपया पहले एक व्यवसाय चुनें या बनाएँ",
  failedCreateAvailability: "उपलब्धता बनाने में विफल",
  availabilitySaved: "उपलब्धता सहेजी गई",
  noSpecificAvailabilities: "कोई विशिष्ट उपलब्धता कॉन्फ़िगर नहीं की गई।",
  delete: "हटाएं",

  /* My Bookings */
  bookingDashboard: "बुकिंग डैशबोर्ड",
  bookingPageFor: "बुकिंग पृष्ठ के लिए",
  open: "खोलें",
  copy: "कॉपी करें",
  copied: "कॉपी किया गया!",
  past: "अतीत",
  bookingsLabel: "बुकिंग",
  searchPlaceholder: "ग्राहक या सेवा खोजें",
  allStatus: "सभी स्थिति",
  booked: "बुक किया गया",
  export: "निर्यात",
  clientLabel: "ग्राहक",
  dateTimeLabel: "दिनांक और समय",
  phoneLabel: "फोन",
  statusLabel: "स्थिति",
  actionsLabel: "कार्रवाई",
  view: "देखें",
  reschedule: "पुनर्निर्धारित",
  cancel: "रद्द करें",
  noActions: "कोई क्रियाएँ नहीं",
  previous: "पिछला",
  next: "अगला",
  pageText: "पृष्ठ",
  ofText: "का",
  noBookingsFound: "कोई बुकिंग नहीं मिली",

  /* Upgrade / Plans */
  chooseYourPlan: "अपनी योजना चुनें",
  scaleYourBusiness: "सही सदस्यता के साथ अपने व्यवसाय को स्केल करें।",
  recommended: "अनुशंसित",
  contactSales: "सेल्स से संपर्क करें",
  selectPlan: "योजना चुनें",
  paymentDetails: "भुगतान विवरण",
  cardNumber: "कार्ड नंबर",
  mmyy: "महीना/साल",
  cvc: "CVC",
  cardholderName: "कार्डधारक का नाम",
  processing: "प्रसंस्करण...",
  payNowPrefix: "भुगतान",
  orderSummary: "ऑर्डर सारांश",
  taxEst: "कर (अनुमानित)",
  totalDueToday: "आज देय कुल",
  byClickingPayNow:
    '"पे नाउ" पर क्लिक करके, आप सेवा की शर्तों से सहमत होते हैं।',
  changePlan: "योजना बदलें",
  closeUpgradeProcess: "अपग्रेड प्रक्रिया बंद करें",
  paymentSuccessful: "भुगतान सफल!",
  welcomeToPlanPrefix: "स्वागत है ",
  welcomeToPlanSuffix: " योजना में। आपका खाता अपग्रेड कर दिया गया है!",
  goToDashboard: "डैशबोर्ड पर जाएं",

  /* Days */
  sunday: "रविवार",
  monday: "सोमवार",
  tuesday: "मंगलवार",
  wednesday: "बुधवार",
  thursday: "गुरुवार",
  friday: "शुक्रवार",
  saturday: "शनिवार",
};

const ar = {
  /* App */
  appName: "بوكتايمز",

  resourceAdded: "تمت إضافة المورد",
  resourceUpdated: "تم تحديث المورد",
  resourceDeleted: "تم حذف المورد",
  addResource: "إضافة مورد",
  resourceName: "اسم المورد",
  selectResources: "حدد الموارد",
  updateSlot: "تحديث الشريحة",
  startTime: "وقت البدء",
  endTime: "وقت الانتهاء",
  slotDuration: "مدة الشريحة",
  saveChanges: "حفظ التغييرات",

  /* Navigation / Common */
  home: "الصفحة الرئيسية",
  dashboard: "لوحة القيادة",
  bookings: "الحجوزات",
  availabilitySchedules: "التوافر",
  appointments: "المواعيد",
  users: "المستخدمين",
  settings: "الإعدادات",
  upgrade: "تطوير",
  login: "تسجيل الدخول",
  register: "تسجيل",
  logout: "تسجيل الخروج",
  signOut: "تسجيل الخروج",
  profile: "الملف الشخصي",

  /* Account / Settings */
  manageYourAccountPreferences: "إدارة تفضيلات حسابك",
  accountSettings: "إعدادات الحساب",
  passwordChangeWarning:
    "سيؤدي تغيير كلمة المرور الخاصة بك إلى تسجيل خروجك من جميع الجلسات النشطة.",
  branding: "العلامة التجارية",
  security: "الأمان",
  localization: "التوطين",

  /* Profile */
  fullName: "الاسم الكامل",
  emailAddress: "البريد الإلكتروني",
  emailCannotBeChanged: "لا يمكن تغيير البريد الإلكتروني",
  saveProfile: "حفظ الملف الشخصي",
  changeAvatar: "تغيير الصورة الشخصية",
  maxFileSize: "الحد الأقصى لحجم الملف",

  /* Branding */
  visualBranding: "الهوية البصرية",
  companyLogo: "شعار الشركة",
  uploadLogo: "رفع الشعار",
  recommendedSize: "الحجم الموصى به",
  saveBrandingSettings: "حفظ إعدادات العلامة التجارية",

  /* Password */
  currentPassword: "كلمة المرور الحالية",
  newPassword: "كلمة مرور جديدة",
  confirmNewPassword: "تأكيد كلمة المرور الجديدة",
  updatePassword: "تحديث كلمة المرور",
  minCharacters: "(8 أحرف على الأقل)",

  /* Localization */
  displayLanguage: "لغة العرض",
  timezone: "المنطقة الزمنية",
  timeFormat: "تنسيق الوقت",
  saveLocalizationSettings: "حفظ إعدادات التوطين",
  changingLanguageAppliesImmediately: "يتم تطبيق تغيير اللغة على الفور",

  /* Appointments */
  previousAppointments: "المواعيد السابقة",
  searchClientService: "البحث عن عميل أو خدمة...",
  searchClientCategory: "البحث عن عميل أو فئة...",
  filterByStatus: "التصفية حسب الحالة",
  all: "الكل",
  completed: "مكتمل",
  upcoming: "القادمة",
  cancelled: "ملغي",
  client: "العميل",
  service: "الخدمة",
  category: "الفئة",
  dateTime: "التاريخ والوقت",
  status: "الحالة",
  actions: "الإجراءات",
  viewDetails: "عرض التفاصيل",
  noAppointmentsFound: "لم يتم العثور على مواعيد مطابقة لمعاييرك.",

  /* Auth */
  signIn: "تسجيل الدخول",
  welcomeBack: "مرحبًا بعودتك إلى BookTimez",
  signInWithGoogle: "تسجيل الدخول باستخدام Google",
  orContinueWithEmail: "أو المتابعة عبر البريد الإلكتروني",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  signingIn: "جارٍ تسجيل الدخول...",
  createAccount: "إنشاء حساب",

  /* Booking */
  bookAnAppointment: "حجز موعد",
  date: "التاريخ",
  slots: "المواعيد",
  yourName: "اسمك",
  reset: "إعادة تعيين",
  confirmBooking: "تأكيد الحجز",
  processingBooking: "جارٍ معالجة الحجز…",
  bookingConfirmed: "تم تأكيد الحجز",
  bookingFailed: "فشل الحجز",
  reference: "مرجع",
  businessLabel: "المنشأة",
  serviceLabel: "الخدمة",
  startLabel: "البداية",
  noSlots: "لا توجد مواعيد",
  done: "تم",
  close: "إغلاق",

  /* Header / Footer */
  featuresLabel: "الميزات",
  pricing: "التسعير",
  productLabel: "المنتج",
  companyLabel: "الشركة",
  legalLabel: "قانوني",
  about: "حول",
  blog: "مدونة",
  contact: "اتصل",
  privacy: "الخصوصية",
  terms: "الشروط",
  cookiePolicy: "سياسة ملفات تعريف الارتباط",
  twitter: "تويتر",
  linkedin: "لينكدإن",
  github: "جيت هب",
  builtFor: "مصمم للأعمال الصغيرة حول العالم.",

  /* Availability */
  availabilityTitle: "جداول التوافر",
  manageAvailabilities: "إدارة التوفر",
  manageAvailDesc: "أنشئ واحذف نوافذ التوفر المحددة لأعمالك.",
  noBusinessesFound: "لم يتم العثور على منشآت",
  day: "اليوم",
  categoryLabel: "الفئة",
  startLabelShort: "ابدأ",
  endLabelShort: "انتهى",
  slotMin: "المدة (دقائق)",
  addAvailability: "أضف توفر",
  loadingAvailabilities: "جارٍ تحميل التوافر...",
  availabilityDeleted: "تم حذف التوافر",
  failedDeleteAvailability: "فشل في حذف التوافر",
  selectOrCreateBusinessFirst: "اختر أو أنشئ منشأة أولاً",
  failedCreateAvailability: "فشل في إنشاء التوافر",
  availabilitySaved: "تم حفظ التوافر",
  noSpecificAvailabilities: "لا توجد توافرات محددة مُكوَّنة.",
  delete: "حذف",

  /* My Bookings */
  bookingDashboard: "لوحة الحجز",
  bookingPageFor: "صفحة الحجز ل",
  open: "فتح",
  copy: "نسخ",
  copied: "تم النسخ!",
  past: "الماضية",
  bookingsLabel: "الحجوزات",
  searchPlaceholder: "ابحث عن عميل أو خدمة",
  allStatus: "جميع الحالات",
  booked: "محجوز",
  export: "تصدير",
  phoneLabel: "الهاتف",
  statusLabel: "الحالة",
  actionsLabel: "الإجراءات",
  view: "عرض",
  reschedule: "إعادة جدولة",
  cancel: "إلغاء",
  noActions: "لا توجد إجراءات",
  previous: "السابق",
  next: "التالي",
  pageText: "صفحة",
  ofText: "من",
  noBookingsFound: "لم يتم العثور على حجوزات",

  /* Upgrade / Plans */
  chooseYourPlan: "اختر خطتك",
  scaleYourBusiness: "وسّع عملك بالخطة المناسبة.",
  recommended: "مُوصى به",
  contactSales: "اتصل بالمبيعات",
  selectPlan: "اختر الخطة",
  paymentDetails: "تفاصيل الدفع",
  cardNumber: "رقم البطاقة",
  mmyy: "شهر/سنة",
  cvc: "CVC",
  cardholderName: "اسم حامل البطاقة",
  processing: "جارٍ المعالجة...",
  payNowPrefix: "ادفع",
  orderSummary: "ملخص الطلب",
  taxEst: "الضريبة (تقديري)",
  totalDueToday: "الإجمالي المستحق اليوم",
  byClickingPayNow: 'بالنقر على "ادفع الآن"، فإنك توافق على شروط الخدمة.',
  changePlan: "تغيير الخطة",
  closeUpgradeProcess: "إغلاق عملية الترقية",
  paymentSuccessful: "تم الدفع بنجاح!",
  welcomeToPlanPrefix: "مرحبًا بكم في ",
  welcomeToPlanSuffix: " الخطة. تم ترقية حسابك!",
  goToDashboard: "اذهب إلى لوحة التحكم",

  /* Days */
  sunday: "الأحد",
  monday: "الاثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
  saturday: "السبت",
};

const translations = {
  en: en,
  hi: hi,
  ar: ar,
};

const LocalizationContext = createContext();

export const useLocalization = () => useContext(LocalizationContext);

export const LocalizationProvider = ({ children }) => {
  // Initial language loaded from localStorage or defaults to 'en'
  const [language, setLanguage] = useState(
    localStorage.getItem("appLanguage") || "en"
  );

  // --- FIX: Define 't' as a lookup function ---
  const t = (key) => {
    // Determine the correct dictionary, defaulting to English
    const dictionary = translations[language] || translations["en"];

    // Return the translated value, or the key itself as a fallback if not found
    return dictionary[key] || key;
  };
  // ------------------------------------------

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem("appLanguage", language);

    // Handle RTL direction for Arabic
    if (language === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
    }
  }, [language]);

  const contextValue = {
    language,
    setLanguage,
    t, // Now correctly passing a FUNCTION
    availableLanguages: Object.keys(translations),
  };

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
};
