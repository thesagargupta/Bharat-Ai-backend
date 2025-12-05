"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { successToast, errorToast, confirmToast, warningToast } from '../../../lib/toast';
import { 
  FiArrowLeft, 
  FiMoon, 
  FiSun, 
  FiBell, 
  FiLock, 
  FiGlobe, 
  FiMessageSquare, 
  FiSave,
  FiTrash2,
  FiDownload,
  FiShield,
  FiMessageCircle,
  FiSend
} from "react-icons/fi";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/setting");
    }
  }, [status, router]);
  
  const [settings, setSettings] = useState({
    theme: "light",
    notifications: false,
    soundEffects: false,
    language: "en",
    autoSave: true,
    dataCollection: false,
  });

  const [saved, setSaved] = useState(false);
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    category: "general",
    message: ""
  });
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setSettings(prev => ({ ...prev, notifications: !!subscription }));
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Subscribe error:", error);
      return false;
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await fetch("/api/notifications/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Unsubscribe error:", error);
      return false;
    }
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Don't render content until authenticated
  if (status === "unauthenticated") {
    return null;
  }

  const handleToggle = async (key) => {
    if (key === 'notifications') {
      if (!settings.notifications) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          await navigator.serviceWorker.register("/sw.js");
          const success = await subscribeToPush();
          if (success) {
            setSettings(prev => ({ ...prev, [key]: true }));
            successToast("Notifications enabled!");
          } else {
            errorToast("Failed to enable notifications");
          }
        } else {
          errorToast("Notification permission denied");
        }
      } else {
        const success = await unsubscribeFromPush();
        if (success) {
          setSettings(prev => ({ ...prev, [key]: false }));
          successToast("Notifications disabled!");
        } else {
          errorToast("Failed to disable notifications");
        }
      }
    } else {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSave = () => {
    // Save settings logic here
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearHistory = async () => {
    const confirmed = await confirmToast(
      "Are you sure you want to clear all chat history? This action cannot be undone.",
      () => {
        // Clear history logic
        successToast("Chat history cleared!");
      }
    );
  };

  const handleExportData = () => {
    // Export data logic
    successToast("Your data export will be downloaded shortly.");
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    
    // EmailJS integration will go here
    // For now, we'll simulate sending
    console.log("Feedback submitted:", feedback);
    
    // Simulate API call
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedback({
        name: "",
        email: "",
        category: "general",
        message: ""
      });
    }, 3000);
    
    successToast("Thank you for your feedback! We'll review it shortly.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <FiArrowLeft size={24} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500">Customize your Bharat AI experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Appearance Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {settings.theme === "dark" ? <FiMoon size={20} /> : <FiSun size={20} />}
              Appearance
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Theme</p>
                <p className="text-sm text-gray-500">Choose your preferred color scheme</p>
              </div>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiBell size={20} />
              Notifications
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Push Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive notifications for new messages
                </p>
              </div>
              <button
                onClick={() => handleToggle('notifications')}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.notifications ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sound Effects Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Sound Effects</p>
                <p className="text-sm text-gray-500">Play sounds for actions</p>
              </div>
              <button
                onClick={() => handleToggle('soundEffects')}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.soundEffects ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.soundEffects ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiGlobe size={20} />
              Language & Region
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Language</p>
                <p className="text-sm text-gray-500">Select your preferred language</p>
              </div>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chat Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiMessageSquare size={20} />
              Chat Settings
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Auto-save Conversations</p>
                <p className="text-sm text-gray-500">Automatically save your chat history</p>
              </div>
              <button
                onClick={() => handleToggle('autoSave')}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.autoSave ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.autoSave ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Clear History */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
              >
                <FiTrash2 size={18} />
                Clear Chat History
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiShield size={20} />
              Privacy & Security
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Data Collection */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Data Collection</p>
                <p className="text-sm text-gray-500">Help improve Bharat AI with usage data</p>
              </div>
              <button
                onClick={() => handleToggle('dataCollection')}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.dataCollection ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.dataCollection ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Export Data */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <FiDownload size={18} />
                Export My Data
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center pb-8">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-purple-700'
            }`}
          >
            <FiSave size={20} />
            {saved ? 'Settings Saved!' : 'Save Settings'}
          </button>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiMessageCircle size={20} />
              Feedback & Suggestions
            </h2>
            <p className="text-sm text-gray-500 mt-1">Help us improve Bharat AI with your feedback</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={feedback.name}
                  onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                  placeholder="Enter your name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={feedback.email}
                  onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback Category
                </label>
                <select
                  id="category"
                  value={feedback.category}
                  onChange={(e) => setFeedback({ ...feedback, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">General Feedback</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="improvement">Improvement Suggestion</option>
                  <option value="ui">UI/UX Feedback</option>
                  <option value="performance">Performance Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message Textarea */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback
                </label>
                <textarea
                  id="message"
                  value={feedback.message}
                  onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                  placeholder="Tell us what you think or what we can improve..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Your feedback helps us make Bharat AI better for everyone.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={feedbackSent}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    feedbackSent
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-blue-600'
                  }`}
                >
                  <FiSend size={18} />
                  {feedbackSent ? 'Feedback Sent!' : 'Send Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center pb-4 pt-4">
          <p className="text-sm text-gray-500">
            Bharat AI v1.0.0 • <br></br>Made with ❤️ by{" "}
            <a 
              href="https://sagarguptaportfolio.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 font-semibold hover:text-orange-600 transition-colors"
              style={{ textDecoration: 'none' }}
            >
              Sagar Gupta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
