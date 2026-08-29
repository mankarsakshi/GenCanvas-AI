import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Camera,
  Edit,
  Image as ImageIcon,
  Heart,
  Sparkles,
  X,
  Save,
  Check,
  Upload,
  ArrowRight,
  Shield,
  Download,
  Copy,
  Plus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  downloadImage,
  getUserHistory,
  getUserGallery,
  getUserFavorites,
  getUserId,
  apiFetch,
} from "../utils";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, updateAvatar } = useAuth();
  const fileInputRef = useRef(null);

  // Profile data
  const [profile, setProfile] = useState({
    name: user?.name || "Sakshi",
    username: user?.username || (user?.name ? user.name.toLowerCase().replace(/[@\s]/g, "") : "sakshi"),
    email: user?.email || "sakshi@example.com",
    bio: user?.bio || "Creating amazing images with AI and exploring creative ideas with AI Studio.",
    profileImage: user?.profileImage || "",
    plan: user?.plan || "Free Plan",
    createdAt: user?.createdAt || "",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [toastMsg, setToastMsg] = useState("");
  const [selectedCreation, setSelectedCreation] = useState(null);
  const [copied, setCopied] = useState(false);

  // Dynamic Statistics & Recent Creations
  const [stats, setStats] = useState({
    generatedCount: 0,
    galleryCount: 0,
    favoritesCount: 0,
  });
  const [recentGenerations, setRecentGenerations] = useState([]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Sync with AuthContext user
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        username: user.username || (user.name ? user.name.toLowerCase().replace(/[@\s]/g, "") : prev.username),
        bio: user.bio !== undefined ? user.bio : prev.bio,
        profileImage: user.profileImage !== undefined ? user.profileImage : prev.profileImage,
        plan: user.plan || prev.plan,
        createdAt: user.createdAt || prev.createdAt,
      }));
    }
  }, [user]);

  // Load user-scoped stats and recent creations
  useEffect(() => {
    try {
      const historyList = getUserHistory(user);
      const galleryList = getUserGallery(user);
      const favList = getUserFavorites(user);

      setStats({
        generatedCount: historyList.length,
        galleryCount: galleryList.length,
        favoritesCount: favList.length,
      });

      if (historyList.length > 0) {
        setRecentGenerations(historyList.slice(0, 4));
      } else if (galleryList.length > 0) {
        setRecentGenerations(galleryList.slice(0, 4));
      } else {
        setRecentGenerations([]);
      }

      // Sync backend history count via JWT
      apiFetch(`http://localhost:8080/api/v1/history?page=1&limit=10`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.data)) {
            setStats((prev) => ({
              ...prev,
              generatedCount: Math.max(prev.generatedCount, data.pagination?.total || data.data.length),
            }));
            if (data.data.length > 0 && historyList.length === 0) {
              setRecentGenerations(data.data.slice(0, 4));
            }
          }
        })
        .catch(() => {});
    } catch (e) {
      console.warn("Error loading user profile activity:", e);
    }
  }, [user]);

  // Format Join Date
  const formattedJoinDate = React.useMemo(() => {
    if (profile.createdAt) {
      const date = new Date(profile.createdAt);
      if (!isNaN(date.getTime())) {
        return `Joined ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
      }
    }
    return "Joined August 2026";
  }, [profile.createdAt]);

  const handleEditProfile = () => {
    setFormData(profile);
    setEditOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle direct avatar file selection
  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result;
      setFormData((prev) => ({ ...prev, profileImage: base64Image }));
      setProfile((prev) => ({ ...prev, profileImage: base64Image }));

      if (updateAvatar) {
        await updateAvatar(base64Image);
        showToast("📷 Profile avatar updated!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Save full profile
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const res = await updateProfile(formData);
      if (res?.success) {
        setProfile(formData);
        showToast("✨ Profile updated successfully!");
        setEditOpen(false);
      } else {
        alert(res?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      showToast("Profile changes saved locally.");
      setEditOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(profile);
    setEditOpen(false);
  };

  const handleCopyPrompt = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-6xl pb-12">
      {/* Hidden File Input for Avatar */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileSelect}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[3000] flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-xl animate-fadeIn">
          <Check size={16} className="text-green-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile account settings, avatar, and AI Studio creations.
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Cover Banner */}
        <div className="h-40 bg-gradient-to-r from-[#6469ff] via-[#7c3aed] to-[#ec4899] relative">
          <div className="absolute right-4 top-4 rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
            {profile.plan || "Free Plan"}
          </div>
        </div>

        {/* Profile Info Header */}
        <div className="px-6 pb-6">
          <div className="-mt-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Avatar with Camera Overlay */}
            <div className="relative inline-block">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-indigo-50 text-indigo-600 shadow-lg overflow-hidden">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-indigo-600">
                    {(profile.name || "S").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Camera Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md transition hover:bg-indigo-700 hover:scale-105 active:scale-95"
                title="Change profile avatar photo"
              >
                <Camera size={18} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleEditProfile}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95"
              >
                <Edit size={16} />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/create-post")}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 active:scale-95"
              >
                <Sparkles size={16} />
                <span>Create Artwork</span>
              </button>
            </div>
          </div>

          {/* User Text Details */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <p className="mt-0.5 text-sm font-semibold text-indigo-600">
              @{profile.username}
            </p>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">
              {profile.bio}
            </p>

            <div className="mt-4 flex flex-wrap gap-5 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <span>{profile.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <span>{formattedJoinDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-500" />
                <span className="text-green-600 font-medium">Verified Creator</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {/* Images Generated */}
        <Link to="/history" style={{ textDecoration: "none" }}>
          <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:scale-110">
              <Sparkles size={22} />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-gray-900">
              {stats.generatedCount}
            </p>
            <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
              <span>Images Generated</span>
              <ArrowRight size={15} className="text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </Link>

        {/* Gallery Creations */}
        <Link to="/gallery" style={{ textDecoration: "none" }}>
          <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-500 transition group-hover:scale-110">
              <ImageIcon size={22} />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-gray-900">
              {stats.galleryCount}
            </p>
            <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
              <span>Gallery Creations</span>
              <ArrowRight size={15} className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </Link>

        {/* Favorites */}
        <Link to="/favorites" style={{ textDecoration: "none" }}>
          <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500 transition group-hover:scale-110">
              <Heart size={22} className="fill-red-500" />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-gray-900">
              {stats.favoritesCount}
            </p>
            <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
              <span>Favorite Creations</span>
              <ArrowRight size={15} className="text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </Link>
      </div>

      {/* PERSONAL INFORMATION & ACCOUNT DETAILS */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">Account Information</h2>
          <p className="mt-1 text-sm text-gray-500">
            Your registered credentials and subscription plan.
          </p>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Full Name
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <User size={18} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-800">{profile.name}</span>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Email Address
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <Mail size={18} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-800">{profile.email}</span>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Username Handle
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <span className="text-gray-400 font-bold mr-1">@</span>
              <span className="text-sm font-medium text-gray-800">{profile.username}</span>
            </div>
          </div>

          {/* Plan Status */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Account Status
            </label>
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <span className="text-sm font-medium text-gray-800">{profile.plan || "Free Plan"}</span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Active Member
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT GENERATIONS SHOWCASE */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Creations</h2>
            <p className="mt-1 text-sm text-gray-500">
              Your latest AI-generated images from Creative Studio.
            </p>
          </div>

          <Link to="/history" className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          {recentGenerations.length > 0 ? (
            recentGenerations.map((item) => (
              <div
                key={item.id || item._id}
                onClick={() => setSelectedCreation(item)}
                className="group relative aspect-square overflow-hidden rounded-xl bg-gray-950 shadow-sm cursor-pointer"
              >
                <img
                  src={item.photo || item.image}
                  alt={item.prompt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                  <span className="rounded-md bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white self-end backdrop-blur-sm">
                    {item.ratio || "1:1"}
                  </span>

                  <div>
                    <p className="line-clamp-2 text-xs font-semibold text-white">
                      "{item.prompt}"
                    </p>
                    <p className="mt-1 text-[11px] text-gray-300">
                      {item.date || "Today"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
              <Sparkles size={28} className="text-indigo-500 mb-2" />
              <p className="text-sm font-medium text-gray-700">No artwork generated yet</p>
              <p className="text-xs text-gray-400 mt-1">Start crafting AI images to showcase them on your profile.</p>
              <button
                type="button"
                onClick={() => navigate("/create-post")}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                <Plus size={14} />
                <span>Create Image Now</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {editOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update your public profile and avatar information.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Profile Photo Selection */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-indigo-200 bg-indigo-50 text-indigo-600 overflow-hidden shadow-sm">
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User size={36} />
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                    >
                      <Upload size={14} />
                      <span>Upload from Device</span>
                    </button>
                    {formData.profileImage && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, profileImage: "" }))}
                        className="text-left text-xs font-semibold text-red-500 hover:text-red-700"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                />
              </div>

              {/* Username */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Username Handle
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 px-4 py-3 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/10">
                  <span className="text-gray-400 font-bold mr-1">@</span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="yourusername"
                    className="w-full text-sm outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Email (Disabled) */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                  Email address cannot be modified directly.
                </p>
              </div>

              {/* Bio */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Bio / About Me
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  maxLength={180}
                  placeholder="Tell the community about your creative AI inspirations..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                />
                <div className="mt-1 text-right text-xs text-gray-400">
                  {formData.bio?.length || 0}/180
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
              >
                <Save size={16} />
                <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT CREATION MODAL */}
      {selectedCreation && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedCreation(null)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCreation(null)}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur hover:bg-gray-100"
            >
              <X size={18} />
            </button>

            <div className="bg-gray-950 flex items-center justify-center">
              <img
                src={selectedCreation.photo || selectedCreation.image}
                alt={selectedCreation.prompt}
                className="max-h-[380px] w-full object-contain"
              />
            </div>

            <div className="p-5">
              <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                "{selectedCreation.prompt}"
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs font-medium text-gray-500">
                  {selectedCreation.date || "Generated today"}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(selectedCreation.prompt)}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Copy size={13} />
                    <span>{copied ? "Copied!" : "Copy Prompt"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadImage(selectedCreation.id || Date.now(), selectedCreation.photo || selectedCreation.image)}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
