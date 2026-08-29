import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Download,
  Search,
  Sparkles,
  Trash2,
  Eye,
  Plus,
  RefreshCw,
  X,
  Copy,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import {
  downloadImage,
  getUserFavorites,
  setUserFavorites,
  getUserId,
} from "../utils";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const DEFAULT_FAVORITE_SAMPLES = [
  {
    _id: "fav-sample-1",
    photo: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80",
    prompt: "Futuristic neon metropolis with flying sky-trains and glowing purple fog",
    name: "Alex Rivera",
    likes: 42,
    createdAt: "2026-08-20T10:00:00.000Z",
  },
  {
    _id: "fav-sample-2",
    photo: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
    prompt: "Mystical alpine mountain peaks under an aurora borealis cosmic sky",
    name: "Sarah Chen",
    likes: 58,
    createdAt: "2026-08-21T12:00:00.000Z",
  },
  {
    _id: "fav-sample-3",
    photo: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80",
    prompt: "Enchanted ancient forest with glowing bioluminescent mushrooms",
    name: "John Miller",
    likes: 35,
    createdAt: "2026-08-21T18:00:00.000Z",
  },
];

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedItem, setSelectedItem] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch favorites from Backend and Local Storage
  const fetchFavorites = async () => {
    try {
      setLoading(true);

      // 1. Get from User-Scoped Local Storage
      const localFavs = getUserFavorites(user);

      // 2. Fetch from MongoDB Backend using verified JWT
      let backendFavs = [];
      try {
        const response = await apiFetch(`http://localhost:8080/api/v1/favorite?page=1&limit=50`);
        const result = await response.json();
        if (response.ok && result.success && Array.isArray(result.data)) {
          backendFavs = result.data;
        }
      } catch (err) {
        console.warn("Backend favorites fetch notice:", err.message);
      }

      // 3. Merge: Local + Backend (Deduplicate by photo)
      const merged = [];
      const seen = new Set();

      for (const item of [...backendFavs, ...localFavs]) {
        const photoKey = item.photo || item.image;
        if (photoKey && !seenPhotos(seen, photoKey)) {
          seen.add(photoKey);
          merged.push({
            ...item,
            photo: photoKey,
            prompt: item.prompt || item.title || "AI Creation",
            name: item.name || item.creator || "GenCanvas Creator",
            _id: item._id || item.id || Date.now().toString(),
          });
        }
      }

      // If empty, supply sample favorites
      if (merged.length === 0) {
        setFavorites(DEFAULT_FAVORITE_SAMPLES);
      } else {
        setFavorites(merged);
      }
    } catch (error) {
      console.error("Favorites load error:", error);
      setFavorites(DEFAULT_FAVORITE_SAMPLES);
    } finally {
      setLoading(false);
    }
  };

  const seenPhotos = (seenSet, key) => seenSet.has(key);

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  // Remove a favorite
  const handleRemoveFavorite = async (item, e) => {
    if (e) e.stopPropagation();

    // 1. Remove from state
    const updated = favorites.filter(
      (fav) => (fav._id || fav.id) !== (item._id || item.id) && fav.photo !== item.photo
    );
    setFavorites(updated);

    // 2. Remove from user-scoped storage
    setUserFavorites(user, updated);

    // 3. Remove from MongoDB Backend via JWT
    if (item._id && !item._id.startsWith("fav-sample-")) {
      try {
        await apiFetch(`http://localhost:8080/api/v1/favorite/${item._id}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn("Backend remove favorite notice:", err.message);
      }
    }

    if (selectedItem && (selectedItem._id === item._id || selectedItem.photo === item.photo)) {
      setSelectedItem(null);
    }
  };

  // Download favorite image
  const handleDownload = async (item, e) => {
    if (e) e.stopPropagation();
    try {
      await downloadImage(item._id || item.id, item.photo || item.image);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  // Copy prompt
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter and Sort
  const filteredFavorites = useMemo(() => {
    let list = [...favorites];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (item) =>
          (item.prompt && item.prompt.toLowerCase().includes(q)) ||
          (item.name && item.name.toLowerCase().includes(q))
      );
    }

    // Tab filter
    if (filterTab === "My Creations" && user?.name) {
      list = list.filter((item) => item.name?.toLowerCase().includes(user.name.toLowerCase()));
    }

    // Sort
    if (sortBy === "Newest") {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === "Most Liked") {
      list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    return list;
  }, [favorites, search, filterTab, sortBy, user]);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-500">
                <Heart size={14} className="fill-red-500" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Personal Collection
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              My Favorites
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Your curated collection of saved AI visual creations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchFavorites}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95"
              title="Refresh favorites from database"
            >
              <RefreshCw size={15} className={loading ? "animate-spin text-red-500" : ""} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/create-post")}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-red-600 hover:to-pink-700 active:scale-95"
            >
              <Plus size={17} />
              <span>Create More</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved favorites..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
          />
        </div>

        {/* Tab & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {["All", "My Creations", "Community"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                filterTab === tab
                  ? "bg-gray-900 text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm outline-none transition focus:border-red-500"
          >
            <option>Newest</option>
            <option>Most Liked</option>
          </select>
        </div>
      </div>

      {/* Counter */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          Showing <span className="font-bold text-gray-900">{filteredFavorites.length}</span> saved artwork(s)
        </p>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
          <Loader />
          <span className="text-sm font-medium text-gray-500">Loading your favorites...</span>
        </div>
      ) : filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFavorites.map((item) => (
            <div
              key={item._id || item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <img
                  src={item.photo}
                  alt={item.prompt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Remove from favorites button */}
                <button
                  type="button"
                  onClick={(e) => handleRemoveFavorite(item, e)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
                  title="Remove from favorites"
                >
                  <Heart size={16} className="fill-red-500 text-red-500" />
                </button>

                {/* Quick View Pill */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-gray-900 backdrop-blur-sm shadow-md hover:bg-white">
                    <Eye size={14} />
                    <span>Inspect</span>
                  </span>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-4">
                <p className="mb-3 line-clamp-2 text-sm font-medium leading-snug text-gray-800" title={item.prompt}>
                  {item.prompt}
                </p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs font-semibold text-gray-500 truncate max-w-[140px]">
                    @{item.name?.toLowerCase().replace(/\s+/g, "") || "creator"}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleDownload(item, e)}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-500 transition hover:text-indigo-600"
                    title="Download high-res artwork"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Heart size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No favorite images yet</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm">
            Save creations you love by clicking the heart icon on any generated artwork or community post!
          </p>
          <button
            type="button"
            onClick={() => navigate("/create-post")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-600 transition active:scale-95"
          >
            <Plus size={16} />
            <span>Generate Artwork</span>
          </button>
        </div>
      )}

      {/* Fullscreen Inspector Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative flex max-h-[90vh] max-w-4xl flex-col md:flex-row overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-gray-300 hover:bg-red-600 hover:text-white transition shadow-lg"
            >
              <X size={18} />
            </button>

            {/* Left: Image */}
            <div className="flex items-center justify-center bg-black md:max-w-[55%]">
              <img
                src={selectedItem.photo}
                alt={selectedItem.prompt}
                className="max-h-[80vh] w-full object-contain"
              />
            </div>

            {/* Right: Details & Tools */}
            <div className="flex flex-1 flex-col justify-between p-6 text-slate-200">
              <div>
                {/* Author Info */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-600 font-bold text-white">
                    {(selectedItem.name || "C").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {selectedItem.name || "GenCanvas Creator"}
                    </h3>
                    <span className="text-xs text-slate-400">
                      Saved Favorite
                    </span>
                  </div>
                </div>

                {/* Prompt Section */}
                <div className="mb-4 rounded-xl bg-slate-800/80 p-4 border border-slate-700/50">
                  <span className="text-xs font-semibold text-red-400 block mb-1.5">
                    PROMPT
                  </span>
                  <p className="text-sm leading-relaxed text-slate-200">
                    "{selectedItem.prompt}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={(e) => handleDownload(selectedItem, e)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-600"
                >
                  <Download size={16} />
                  <span>Download Full Resolution</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(selectedItem.prompt)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  <span>{copied ? "Prompt Copied!" : "Copy Prompt"}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleRemoveFavorite(selectedItem, e)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
                >
                  <Trash2 size={14} />
                  <span>Remove from Favorites</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;