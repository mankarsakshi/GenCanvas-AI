import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Palette,
  Bell,
  Image as ImageIcon,
  Trash2,
  ChevronRight,
  Save,
  Moon,
  Sun,
  Monitor,
  Shield,
  History,
  Eye,
  Check,
  AlertTriangle,
  X,
  Sparkles,
  Lock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { clearUserHistory, getUserId } from "../utils";

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateSettings, deleteAccount } = useAuth();
  const { theme: activeAppTheme, setTheme } = useTheme();

  // Settings State
  const [settings, setSettings] = useState({
    theme: activeAppTheme || "Light",
    defaultStyle: "Realistic",
    quality: "High",
    aspectRatio: "1:1",
    generationComplete: true,
    weeklyUpdates: true,
    favoriteUpdates: false,
    privateCreations: false,
    saveHistory: true,
  });

  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Sync settings from user context or localStorage
  useEffect(() => {
    try {
      if (user?.settings) {
        setSettings((prev) => ({
          ...prev,
          ...user.settings,
          theme: user.settings.theme || activeAppTheme || prev.theme,
        }));
      } else {
        const savedSettings = localStorage.getItem("user_settings");
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (parsed && typeof parsed === "object") {
            setSettings((prev) => ({ ...prev, ...parsed, theme: parsed.theme || activeAppTheme || prev.theme }));
          }
        }
      }
    } catch (e) {
      console.warn("Error loading settings:", e);
    }
  }, [user, activeAppTheme]);

  // Update specific setting value
  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "theme" && setTheme) {
      setTheme(value);
    }
  };

  // Save settings via backend API
  const handleSave = async () => {
    try {
      setSaving(true);
      if (updateSettings) {
        const res = await updateSettings(settings);
        if (res?.success) {
          showToast("✨ Settings saved successfully to your account!");
        } else {
          showToast("Settings saved locally.");
        }
      } else {
        localStorage.setItem("user_settings", JSON.stringify(settings));
        showToast("Settings saved successfully.");
      }
    } catch (err) {
      console.error("Save settings error:", err);
      showToast("Settings saved locally.");
    } finally {
      setSaving(false);
    }
  };

  // Clear generation history for active user
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to permanently clear your AI image generation history?")) {
      clearUserHistory(user);
      apiFetch(`http://localhost:8080/api/v1/history`, {
        method: "DELETE",
      }).catch((e) => console.warn("Backend clear history notice:", e));

      showToast("🗑️ Generation history cleared successfully.");
    }
  };

  // Delete account handler
  const handleConfirmDeleteAccount = async () => {
    if (deleteConfirmationInput !== "DELETE") {
      alert("Please type DELETE to confirm account deletion.");
      return;
    }

    try {
      setIsDeleting(true);
      if (deleteAccount) {
        await deleteAccount();
      } else {
        localStorage.clear();
      }
      setDeleteModalOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Delete account error:", err);
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Reusable Toggle component
  const Toggle = ({ enabled, onChange }) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 rounded-full transition duration-200 ease-in-out focus:outline-none ${
          enabled ? "bg-indigo-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    );
  };

  return (
    <div className="mx-auto w-full max-w-5xl pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[3000] flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-2xl animate-fadeIn">
          <Check size={16} className="text-green-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your AI Studio preferences, appearance, notifications, and account credentials.
        </p>
      </div>

      {/* ACCOUNT SETTINGS */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <User size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Account Settings</h2>
              <p className="text-sm text-gray-500">
                Manage your user profile and registered email.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {/* NAME */}
          <Link
            to="/profile"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/70 transition"
            style={{ textDecoration: "none" }}
          >
            <div className="flex items-center gap-4">
              <User size={19} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Full Name</p>
                <p className="text-sm text-gray-500">{user?.name || "Sakshi"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
              <span>Edit in Profile</span>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </Link>

          {/* EMAIL */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Mail size={19} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email Address</p>
                <p className="text-sm text-gray-500">{user?.email || "sakshi@example.com"}</p>
              </div>
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600 border border-green-200">
              Active Member
            </span>
          </div>
        </div>
      </section>

      {/* APPEARANCE */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Appearance</h2>
              <p className="text-sm text-gray-500">Customize how GenCanvas AI Studio looks on your display.</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="mb-3 text-sm font-semibold text-gray-700">Theme Preference</p>
          <div className="grid grid-cols-3 gap-3">
            {/* LIGHT */}
            <button
              type="button"
              onClick={() => updateSetting("theme", "Light")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${
                settings.theme === "Light"
                  ? "border-indigo-600 bg-indigo-50/60 text-indigo-600 ring-2 ring-indigo-600/20"
                  : "border-gray-200 hover:bg-gray-50 text-gray-600"
              }`}
            >
              <Sun size={22} />
              <span className="text-sm font-semibold">Light</span>
            </button>

            {/* DARK */}
            <button
              type="button"
              onClick={() => updateSetting("theme", "Dark")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${
                settings.theme === "Dark"
                  ? "border-indigo-600 bg-indigo-50/60 text-indigo-600 ring-2 ring-indigo-600/20"
                  : "border-gray-200 hover:bg-gray-50 text-gray-600"
              }`}
            >
              <Moon size={22} />
              <span className="text-sm font-semibold">Dark</span>
            </button>

            {/* SYSTEM */}
            <button
              type="button"
              onClick={() => updateSetting("theme", "System")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${
                settings.theme === "System"
                  ? "border-indigo-600 bg-indigo-50/60 text-indigo-600 ring-2 ring-indigo-600/20"
                  : "border-gray-200 hover:bg-gray-50 text-gray-600"
              }`}
            >
              <Monitor size={22} />
              <span className="text-sm font-semibold">System</span>
            </button>
          </div>
        </div>
      </section>

      {/* GENERATION PREFERENCES */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ImageIcon size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Generation Preferences</h2>
              <p className="text-sm text-gray-500">Set default options for your AI image creation studio.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-3">
          {/* STYLE */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Default Style
            </label>
            <select
              value={settings.defaultStyle}
              onChange={(e) => updateSetting("defaultStyle", e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
            >
              <option>Realistic</option>
              <option>Anime</option>
              <option>3D</option>
              <option>Digital Art</option>
              <option>Cartoon</option>
              <option>Cyberpunk</option>
              <option>Cinematic</option>
            </select>
          </div>

          {/* QUALITY */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Image Quality
            </label>
            <select
              value={settings.quality}
              onChange={(e) => updateSetting("quality", e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
            >
              <option>Standard</option>
              <option>High</option>
              <option>Ultra</option>
            </select>
          </div>

          {/* RATIO */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Default Ratio
            </label>
            <select
              value={settings.aspectRatio}
              onChange={(e) => updateSetting("aspectRatio", e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
            >
              <option>1:1</option>
              <option>16:9</option>
              <option>9:16</option>
              <option>4:3</option>
            </select>
          </div>
        </div>
      </section>

      {/* NOTIFICATIONS */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">Choose which activity updates you want to receive.</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {/* GENERATION COMPLETE */}
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">Generation Complete</p>
              <p className="mt-0.5 text-xs text-gray-500">Notify me as soon as an AI image finishes rendering.</p>
            </div>
            <Toggle
              enabled={settings.generationComplete}
              onChange={(value) => updateSetting("generationComplete", value)}
            />
          </div>

          {/* FAVORITES */}
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">Favorite Updates</p>
              <p className="mt-0.5 text-xs text-gray-500">Notify me about trending community activity on my favorite artwork.</p>
            </div>
            <Toggle
              enabled={settings.favoriteUpdates}
              onChange={(value) => updateSetting("favoriteUpdates", value)}
            />
          </div>

          {/* WEEKLY */}
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">Weekly Digest & Features</p>
              <p className="mt-0.5 text-xs text-gray-500">Receive announcements about new AI models and prompt techniques.</p>
            </div>
            <Toggle
              enabled={settings.weeklyUpdates}
              onChange={(value) => updateSetting("weeklyUpdates", value)}
            />
          </div>
        </div>
      </section>

      {/* PRIVACY & SECURITY */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Privacy & Security</h2>
              <p className="text-sm text-gray-500">Control your creation visibility and activity retention.</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {/* PRIVATE CREATIONS */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Eye size={20} className="text-gray-400" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Private Creations by Default</p>
                <p className="mt-0.5 text-xs text-gray-500">Keep new AI generations hidden from public explore gallery.</p>
              </div>
            </div>
            <Toggle
              enabled={settings.privateCreations}
              onChange={(value) => updateSetting("privateCreations", value)}
            />
          </div>

          {/* SAVE HISTORY */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <History size={20} className="text-gray-400" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Save Generation History</p>
                <p className="mt-0.5 text-xs text-gray-500">Store and categorize generated images in your personal history.</p>
              </div>
            </div>
            <Toggle
              enabled={settings.saveHistory}
              onChange={(value) => updateSetting("saveHistory", value)}
            />
          </div>
        </div>
      </section>

      {/* DANGER ZONE */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-100 bg-red-50/60 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <Trash2 size={20} />
            </div>
            <div>
              <h2 className="font-bold text-red-700">Danger Zone</h2>
              <p className="text-sm text-red-500">Permanent data deletion operations.</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-red-100">
          {/* CLEAR HISTORY */}
          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Clear Generation History</p>
              <p className="mt-0.5 text-xs text-gray-500">Permanently removes all saved images from your creation history.</p>
            </div>
            <button
              type="button"
              onClick={handleClearHistory}
              className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              Clear History
            </button>
          </div>

          {/* DELETE ACCOUNT */}
          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Delete Account</p>
              <p className="mt-0.5 text-xs text-gray-500">Permanently delete your user profile, saved images, and favorites.</p>
            </div>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 shadow-sm"
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>

      {/* STICKY SAVE BUTTON */}
      <div className="sticky bottom-4 z-10 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition hover:bg-indigo-700 active:scale-95 disabled:opacity-75"
        >
          <Save size={18} />
          <span>{saving ? "Saving Preferences..." : "Save Settings"}</span>
        </button>
      </div>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Account</h3>
                <p className="text-xs text-gray-500">This action is irreversible.</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              All your profile data, generated images, and favorited creations will be permanently wiped from the database.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Type <span className="font-bold text-red-600">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAccount}
                disabled={deleteConfirmationInput !== "DELETE" || isDeleting}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 shadow-sm"
              >
                {isDeleting ? "Deleting Account..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
