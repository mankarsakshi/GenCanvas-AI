
import React, { useState } from "react";

import {
  User,
  Mail,
  Calendar,
  Camera,
  Edit,
  Image,
  Heart,
  Sparkles,
  X,
  Save,
} from "lucide-react";

const Profile = () => {

  // =====================================================
  // PROFILE DATA
  // =====================================================

  const [profile, setProfile] = useState({
    name: "Sakshi",
    username: "sakshi",
    email: "sakshi@example.com",
    bio: "Creating amazing images with AI and exploring creative ideas with AI Studio.",
  });


  // =====================================================
  // EDIT PROFILE MODAL
  // =====================================================

  const [editOpen, setEditOpen] = useState(false);


  // Temporary form data
  const [formData, setFormData] = useState(profile);


  // =====================================================
  // OPEN EDIT PROFILE
  // =====================================================

  const handleEditProfile = () => {
    setFormData(profile);
    setEditOpen(true);
  };


  // =====================================================
  // HANDLE FORM INPUT
  // =====================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSaveProfile = () => {

    setProfile(formData);

    setEditOpen(false);

  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {

    setFormData(profile);

    setEditOpen(false);

  };


  return (

    <div className="mx-auto w-full max-w-6xl">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="mt-1 text-gray-500">
          Manage your profile and view your AI Studio activity.
        </p>

      </div>


      {/* =====================================================
          PROFILE CARD
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* COVER */}

        <div className="h-36 bg-gradient-to-r from-[#6469ff] to-[#8b5cf6]" />


        {/* PROFILE CONTENT */}

        <div className="px-6 pb-6">

          <div className="-mt-14 flex items-end justify-between">

            {/* PROFILE IMAGE */}

            <div className="relative">

              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#eef0ff] text-[#6469ff] shadow-md">

                <User size={48} />

              </div>


              {/* CAMERA BUTTON */}

              <button
                type="button"
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#6469ff] text-white shadow-md transition hover:bg-[#5559e8]"
                title="Change profile photo"
              >
                <Camera size={16} />
              </button>

            </div>


            {/* EDIT PROFILE BUTTON */}

            <button
              type="button"
              onClick={handleEditProfile}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >

              <Edit size={16} />

              Edit Profile

            </button>

          </div>


          {/* USER INFORMATION */}

          <div className="mt-5">

            <h2 className="text-2xl font-bold text-gray-900">
              {profile.name}
            </h2>


            <p className="mt-1 text-sm text-[#6469ff]">
              @{profile.username}
            </p>


            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              {profile.bio}
            </p>


            {/* EMAIL + JOIN DATE */}

            <div className="mt-4 flex flex-wrap gap-5 text-sm text-gray-500">

              <div className="flex items-center gap-2">

                <Mail size={16} />

                {profile.email}

              </div>


              <div className="flex items-center gap-2">

                <Calendar size={16} />

                Joined August 2026

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          PROFILE STATISTICS
      ===================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">


        {/* GENERATED */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef0ff] text-[#6469ff]">

            <Sparkles size={20} />

          </div>


          <p className="mt-4 text-2xl font-bold text-gray-900">
            128
          </p>


          <p className="mt-1 text-sm text-gray-500">
            Images Generated
          </p>

        </div>


        {/* GALLERY */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">

            <Image size={20} />

          </div>


          <p className="mt-4 text-2xl font-bold text-gray-900">
            96
          </p>


          <p className="mt-1 text-sm text-gray-500">
            Gallery Images
          </p>

        </div>


        {/* FAVORITES */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">

            <Heart size={20} />

          </div>


          <p className="mt-4 text-2xl font-bold text-gray-900">
            24
          </p>


          <p className="mt-1 text-sm text-gray-500">
            Favorite Images
          </p>

        </div>

      </div>


      {/* =====================================================
          PERSONAL INFORMATION
      ===================================================== */}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-6 py-5">

          <h2 className="text-lg font-bold text-gray-900">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your basic account information.
          </p>

        </div>


        <div className="grid gap-5 p-6 md:grid-cols-2">


          {/* FULL NAME */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

              <User
                size={18}
                className="text-gray-400"
              />

              <span className="text-sm text-gray-700">
                {profile.name}
              </span>

            </div>

          </div>


          {/* EMAIL */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

              <Mail
                size={18}
                className="text-gray-400"
              />

              <span className="text-sm text-gray-700">
                {profile.email}
              </span>

            </div>

          </div>


          {/* USERNAME */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Username
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

              <span className="text-gray-400">
                @
              </span>

              <span className="text-sm text-gray-700">
                {profile.username}
              </span>

            </div>

          </div>


          {/* ACCOUNT */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Account Type
            </label>

            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

              <span className="text-sm text-gray-700">
                Free Plan
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
                Active
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          RECENT GENERATIONS
      ===================================================== */}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              Recent Generations
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your latest AI-generated images.
            </p>

          </div>


          <Sparkles
            size={22}
            className="text-[#6469ff]"
          />

        </div>


        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">

          {[1, 2, 3, 4].map((item) => (

            <div
              key={item}
              className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100"
            >

              <div className="flex h-full items-center justify-center text-gray-300">

                <Image size={35} />

              </div>


              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition group-hover:opacity-100">

                <div className="flex w-full items-center justify-between">

                  <span className="text-xs text-white">
                    AI Creation #{item}
                  </span>


                  <Heart
                    size={17}
                    className="text-white"
                  />

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* =====================================================
          EDIT PROFILE MODAL
      ===================================================== */}

      {editOpen && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

          {/* MODAL */}

          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">


            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Edit Profile
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your profile information.
                </p>

              </div>


              {/* CLOSE */}

              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >

                <X size={20} />

              </button>

            </div>


            {/* =================================================
                MODAL BODY
            ================================================= */}

            <div className="flex-1 overflow-y-auto p-6">


              {/* PROFILE PHOTO */}

              <div className="mb-6 flex items-center gap-4">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eef0ff] text-[#6469ff]">

                  <User size={35} />

                </div>


                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >

                  <Camera size={16} />

                  Change Photo

                </button>

              </div>


              {/* FULL NAME */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6469ff] focus:ring-2 focus:ring-[#6469ff]/10"
                />

              </div>


              {/* USERNAME */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6469ff] focus:ring-2 focus:ring-[#6469ff]/10"
                />

              </div>


              {/* EMAIL */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Email address cannot be changed.
                </p>

              </div>


              {/* BIO */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Bio
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  maxLength={160}
                  placeholder="Tell something about yourself..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6469ff] focus:ring-2 focus:ring-[#6469ff]/10"
                />

                <div className="mt-1 text-right text-xs text-gray-400">
                  {formData.bio.length}/160
                </div>

              </div>

            </div>


            {/* =================================================
                MODAL FOOTER
            ================================================= */}

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">


              {/* CANCEL */}

              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >

                Cancel

              </button>


              {/* SAVE */}

              <button
                type="button"
                onClick={handleSaveProfile}
                className="flex items-center gap-2 rounded-xl bg-[#6469ff] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5559e8] active:scale-95"
              >

                <Save size={17} />

                Save Changes

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default Profile;
