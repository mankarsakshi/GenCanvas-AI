
import React, { useState } from "react";

import {
  User,
  Mail,
  Palette,
  Bell,
  Image,
  Lock,
  Trash2,
  ChevronRight,
  Save,
  Moon,
  Sun,
  Monitor,
  Shield,
  History,
  Eye,
} from "lucide-react";

const Settings = () => {

  // =====================================================
  // SETTINGS STATE
  // =====================================================

  const [settings, setSettings] = useState({
    theme: "Light",
    defaultStyle: "Realistic",
    quality: "High",
    aspectRatio: "1:1",

    generationComplete: true,
    weeklyUpdates: true,
    favoriteUpdates: false,

    privateCreations: false,
    saveHistory: true,
  });


  // =====================================================
  // UPDATE SETTING
  // =====================================================

  const updateSetting = (key, value) => {

    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

  };


  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSave = () => {

    console.log("Settings saved:", settings);

    alert("Settings saved successfully!");

  };


  // =====================================================
  // TOGGLE COMPONENT
  // =====================================================

  const Toggle = ({ enabled, onChange }) => {

    return (
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 rounded-full transition ${
          enabled
            ? "bg-[#6469ff]"
            : "bg-gray-300"
        }`}
      >

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>
    );

  };


  return (

    <div className="mx-auto w-full max-w-5xl">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="mt-1 text-gray-500">
          Manage your AI Studio preferences and account settings.
        </p>

      </div>


      {/* =====================================================
          ACCOUNT SETTINGS
      ===================================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef0ff] text-[#6469ff]">
              <User size={20} />
            </div>

            <div>

              <h2 className="font-bold text-gray-900">
                Account Settings
              </h2>

              <p className="text-sm text-gray-500">
                Manage your account information.
              </p>

            </div>

          </div>

        </div>


        <div className="divide-y divide-gray-100">

          {/* NAME */}

          <div className="flex items-center justify-between px-6 py-5">

            <div className="flex items-center gap-4">

              <User
                size={19}
                className="text-gray-400"
              />

              <div>

                <p className="text-sm font-medium text-gray-900">
                  Full Name
                </p>

                <p className="text-sm text-gray-500">
                  Sakshi
                </p>

              </div>

            </div>


            <ChevronRight
              size={18}
              className="text-gray-400"
            />

          </div>


          {/* EMAIL */}

          <div className="flex items-center justify-between px-6 py-5">

            <div className="flex items-center gap-4">

              <Mail
                size={19}
                className="text-gray-400"
              />

              <div>

                <p className="text-sm font-medium text-gray-900">
                  Email Address
                </p>

                <p className="text-sm text-gray-500">
                  sakshi@example.com
                </p>

              </div>

            </div>


            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
              Verified
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          APPEARANCE
      ===================================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500">

              <Palette size={20} />

            </div>

            <div>

              <h2 className="font-bold text-gray-900">
                Appearance
              </h2>

              <p className="text-sm text-gray-500">
                Customize how AI Studio looks.
              </p>

            </div>

          </div>

        </div>


        <div className="p-6">

          <p className="mb-3 text-sm font-medium text-gray-700">
            Theme
          </p>


          <div className="grid grid-cols-3 gap-3">

            {/* LIGHT */}

            <button
              type="button"
              onClick={() =>
                updateSetting("theme", "Light")
              }
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${
                settings.theme === "Light"
                  ? "border-[#6469ff] bg-[#eef0ff] text-[#6469ff]"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >

              <Sun size={22} />

              <span className="text-sm font-medium">
                Light
              </span>

            </button>


            {/* DARK */}

            <button
              type="button"
              onClick={() =>
                updateSetting("theme", "Dark")
              }
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${
                settings.theme === "Dark"
                  ? "border-[#6469ff] bg-[#eef0ff] text-[#6469ff]"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >

              <Moon size={22} />

              <span className="text-sm font-medium">
                Dark
              </span>

            </button>


            {/* SYSTEM */}

            <button
              type="button"
              onClick={() =>
                updateSetting("theme", "System")
              }
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${
                settings.theme === "System"
                  ? "border-[#6469ff] bg-[#eef0ff] text-[#6469ff]"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >

              <Monitor size={22} />

              <span className="text-sm font-medium">
                System
              </span>

            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          GENERATION PREFERENCES
      ===================================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">

              <Image size={20} />

            </div>

            <div>

              <h2 className="font-bold text-gray-900">
                Generation Preferences
              </h2>

              <p className="text-sm text-gray-500">
                Set your default AI image generation options.
              </p>

            </div>

          </div>

        </div>


        <div className="grid gap-5 p-6 md:grid-cols-3">


          {/* STYLE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Default Style
            </label>

            <select
              value={settings.defaultStyle}
              onChange={(e) =>
                updateSetting(
                  "defaultStyle",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#6469ff]"
            >

              <option>Realistic</option>
              <option>Anime</option>
              <option>3D</option>
              <option>Digital Art</option>
              <option>Cartoon</option>

            </select>

          </div>


          {/* QUALITY */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Image Quality
            </label>

            <select
              value={settings.quality}
              onChange={(e) =>
                updateSetting(
                  "quality",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#6469ff]"
            >

              <option>Standard</option>
              <option>High</option>
              <option>Ultra</option>

            </select>

          </div>


          {/* RATIO */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Default Ratio
            </label>

            <select
              value={settings.aspectRatio}
              onChange={(e) =>
                updateSetting(
                  "aspectRatio",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#6469ff]"
            >

              <option>1:1</option>
              <option>16:9</option>
              <option>9:16</option>
              <option>4:3</option>

            </select>

          </div>

        </div>

      </section>


      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-500">

              <Bell size={20} />

            </div>

            <div>

              <h2 className="font-bold text-gray-900">
                Notifications
              </h2>

              <p className="text-sm text-gray-500">
                Choose which notifications you receive.
              </p>

            </div>

          </div>

        </div>


        <div className="divide-y divide-gray-100">


          {/* GENERATION COMPLETE */}

          <div className="flex items-center justify-between px-6 py-5">

            <div>

              <p className="text-sm font-medium text-gray-900">
                Generation Complete
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Notify me when an image has finished generating.
              </p>

            </div>


            <Toggle
              enabled={settings.generationComplete}
              onChange={(value) =>
                updateSetting(
                  "generationComplete",
                  value
                )
              }
            />

          </div>


          {/* FAVORITES */}

          <div className="flex items-center justify-between px-6 py-5">

            <div>

              <p className="text-sm font-medium text-gray-900">
                Favorite Updates
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Notify me about activity on my favorite creations.
              </p>

            </div>


            <Toggle
              enabled={settings.favoriteUpdates}
              onChange={(value) =>
                updateSetting(
                  "favoriteUpdates",
                  value
                )
              }
            />

          </div>


          {/* WEEKLY */}

          <div className="flex items-center justify-between px-6 py-5">

            <div>

              <p className="text-sm font-medium text-gray-900">
                Weekly Updates
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Receive occasional AI Studio product updates.
              </p>

            </div>


            <Toggle
              enabled={settings.weeklyUpdates}
              onChange={(value) =>
                updateSetting(
                  "weeklyUpdates",
                  value
                )
              }
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          PRIVACY
      ===================================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">

              <Shield size={20} />

            </div>

            <div>

              <h2 className="font-bold text-gray-900">
                Privacy & Security
              </h2>

              <p className="text-sm text-gray-500">
                Control your creations and activity.
              </p>

            </div>

          </div>

        </div>


        <div className="divide-y divide-gray-100">


          {/* PRIVATE CREATIONS */}

          <div className="flex items-center justify-between px-6 py-5">

            <div className="flex items-center gap-4">

              <Eye
                size={20}
                className="text-gray-400"
              />

              <div>

                <p className="text-sm font-medium text-gray-900">
                  Private Creations
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Keep newly generated images private.
                </p>

              </div>

            </div>


            <Toggle
              enabled={settings.privateCreations}
              onChange={(value) =>
                updateSetting(
                  "privateCreations",
                  value
                )
              }
            />

          </div>


          {/* SAVE HISTORY */}

          <div className="flex items-center justify-between px-6 py-5">

            <div className="flex items-center gap-4">

              <History
                size={20}
                className="text-gray-400"
              />

              <div>

                <p className="text-sm font-medium text-gray-900">
                  Save Generation History
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Keep generated images in your history.
                </p>

              </div>

            </div>


            <Toggle
              enabled={settings.saveHistory}
              onChange={(value) =>
                updateSetting(
                  "saveHistory",
                  value
                )
              }
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          DANGER ZONE
      ===================================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">

        <div className="border-b border-red-100 bg-red-50 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-500">

              <Trash2 size={20} />

            </div>

            <div>

              <h2 className="font-bold text-red-700">
                Danger Zone
              </h2>

              <p className="text-sm text-red-500">
                These actions cannot be easily undone.
              </p>

            </div>

          </div>

        </div>


        <div className="divide-y divide-red-100">


          {/* CLEAR HISTORY */}

          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-medium text-gray-900">
                Clear Generation History
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Permanently remove your generation history.
              </p>

            </div>


            <button
              type="button"
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              Clear History
            </button>

          </div>


          {/* DELETE ACCOUNT */}

          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-medium text-gray-900">
                Delete Account
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Permanently delete your account and all data.
              </p>

            </div>


            <button
              type="button"
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
            >
              Delete Account
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          SAVE BUTTON
      ===================================================== */}

      <div className="sticky bottom-4 z-10 flex justify-end">

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-[#6469ff] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#5559e8] active:scale-95"
        >

          <Save size={18} />

          Save Settings

        </button>

      </div>

    </div>

  );

};

export default Settings;
