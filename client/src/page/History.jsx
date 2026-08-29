import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Clock,
  Heart,
  Download,
  MoreVertical,
  Eye,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  X,
  Sparkles,
  Layers,
  Plus,
  AlertTriangle,
} from "lucide-react";
import {
  downloadImage,
  getUserHistory,
  setUserHistory,
  clearUserHistory,
  getUserFavorites,
  setUserFavorites,
  getUserGallery,
  getUserId,
} from "../utils";
import { useAuth } from "../context/AuthContext";

// Fallback sample history items if no creations exist yet
const SAMPLE_HISTORY = [
  {
    id: "sample-1",
    _id: "sample-1",
    photo: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800",
    prompt: "Futuristic city at night with glowing neon towers and flying vehicles",
    time: "10:42 AM",
    date: "Today",
    ratio: "16:9",
    style: "Cyberpunk",
    likes: 24,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-2",
    _id: "sample-2",
    photo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    prompt: "Advanced humanoid AI robot portrait with glowing optical sensors",
    time: "09:30 AM",
    date: "Today",
    ratio: "1:1",
    style: "Photorealistic",
    likes: 18,
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  },
  {
    id: "sample-3",
    _id: "sample-3",
    photo: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800",
    image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800",
    prompt: "Beautiful galaxy and nebula stars shining in deep cosmic space",
    time: "08:15 AM",
    date: "Yesterday",
    ratio: "4:3",
    style: "Fantasy",
    likes: 42,
    createdAt: new Date(Date.now() - 3600 * 1000 * 26).toISOString(),
  },
  {
    id: "sample-4",
    _id: "sample-4",
    photo: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800",
    prompt: "Majestic mountain landscape during golden hour sunset with lake reflection",
    time: "06:45 PM",
    date: "Yesterday",
    ratio: "16:9",
    style: "Cinematic",
    likes: 31,
    createdAt: new Date(Date.now() - 3600 * 1000 * 30).toISOString(),
  },
];

// Helper to determine date category
const getDateCategory = (dateString) => {
  if (!dateString) return "Earlier";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Earlier";

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
  const startOfThisWeek = startOfToday - 7 * 24 * 60 * 60 * 1000;
  const itemTime = date.getTime();

  if (itemTime >= startOfToday) {
    return "Today";
  } else if (itemTime >= startOfYesterday) {
    return "Yesterday";
  } else if (itemTime >= startOfThisWeek) {
    return "This Week";
  } else {
    return "Earlier";
  }
};

const History = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [historyList, setHistoryList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("All Generations");
  const [sortBy, setSortBy] = useState("Newest First");

  const [selectedItem, setSelectedItem] = useState(null);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Load history from user-scoped storage & backend API
  const loadHistory = async () => {
    try {
      setLoading(true);

      // 1. Get user-scoped local storage
      const userHistory = getUserHistory(user);
      const userGallery = getUserGallery(user);

      // 2. Fetch backend history for this user using JWT
      let backendHistory = [];
      try {
        const res = await apiFetch(`http://localhost:8080/api/v1/history?page=1&limit=50`);
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data)) {
          backendHistory = data.data;
        }
      } catch (err) {
        console.warn("Backend history fetch notice:", err.message);
      }

      const combined = [...backendHistory, ...userHistory, ...userGallery];

      // Deduplicate by photo URL
      const uniqueList = [];
      const seenPhotos = new Set();

      for (const item of combined) {
        const photoKey = item.photo || item.image;
        if (photoKey && !seenPhotos.has(photoKey)) {
          seenPhotos.add(photoKey);
          const createdAt = item.createdAt || new Date().toISOString();
          const itemDate = new Date(createdAt);
          uniqueList.push({
            ...item,
            id: item.id || item._id || Date.now().toString(),
            _id: item._id || item.id || Date.now().toString(),
            photo: photoKey,
            image: photoKey,
            prompt: item.prompt || "AI Artwork",
            ratio: item.ratio || "1:1",
            style: item.style || "Digital Art",
            likes: item.likes || 0,
            createdAt: createdAt,
            time:
              item.time ||
              (!isNaN(itemDate.getTime())
                ? itemDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "Just now"),
            date:
              item.date ||
              (!isNaN(itemDate.getTime())
                ? itemDate.toLocaleDateString([], { month: "short", day: "numeric" })
                : "Today"),
          });
        }
      }

      // If user has no created images, offer sample history so the UI is interactive
      if (uniqueList.length === 0) {
        setHistoryList(SAMPLE_HISTORY);
      } else {
        setHistoryList(uniqueList);
      }

      // Load user favorites
      const userFavs = getUserFavorites(user);
      setFavorites(userFavs);
    } catch (err) {
      console.error("Failed to load user history:", err);
      setHistoryList(SAMPLE_HISTORY);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  // Check if item is favorited
  const isItemFavorited = (item) => {
    const photoKey = item.photo || item.image;
    return favorites.some(
      (f) => (f.photo || f.image) === photoKey || (f._id && (f._id === item._id || f._id === item.id))
    );
  };

  // Toggle favorite for an item
  const handleToggleFavorite = async (item) => {
    try {
      const photoKey = item.photo || item.image;
      const isFav = isItemFavorited(item);
      const uid = getUserId(user);
      let updatedFavs = [];

      if (isFav) {
        updatedFavs = favorites.filter(
          (f) => (f.photo || f.image) !== photoKey && f._id !== item._id && f.id !== item.id
        );
        showToast("Removed from Favorites");
      } else {
        const favObj = {
          ...item,
          _id: item._id || item.id || Date.now().toString(),
          userId: uid,
          photo: photoKey,
          image: photoKey,
          name: item.name || user?.name || "GenCanvas Creator",
          createdAt: item.createdAt || new Date().toISOString(),
        };
        updatedFavs = [favObj, ...favorites];
        showToast("✨ Added to Favorites!");
      }

      setFavorites(updatedFavs);
      setUserFavorites(user, updatedFavs);

      // Sync with backend via JWT
      try {
        apiFetch("http://localhost:8080/api/v1/favorite/toggle", {
          method: "POST",
          body: JSON.stringify({
            photo: photoKey,
            prompt: item.prompt,
            name: item.name || user?.name || "GenCanvas Creator",
            style: item.style,
            ratio: item.ratio,
          }),
        }).catch((err) => console.warn("Backend favorite sync notice:", err.message));
      } catch (e) {
        console.warn("Backend favorite sync error:", e);
      }
    } catch (err) {
      console.error("Toggle favorite error:", err);
    }
  };

  // Download artwork
  const handleDownload = async (item) => {
    try {
      showToast("Downloading image...");
      await downloadImage(item.id || item._id, item.photo || item.image);
    } catch (err) {
      console.error("Download error:", err);
      showToast("Download failed. Please try again.");
    }
  };

  // Copy prompt
  const handleCopyPrompt = (promptText) => {
    if (!promptText) return;
    navigator.clipboard.writeText(promptText);
    showToast("Prompt copied to clipboard!");
  };

  // Regenerate prompt in CreatePost
  const handleRegenerate = (item) => {
    navigate("/create-post", {
      state: {
        prompt: item.prompt,
        style: item.style,
        ratio: item.ratio,
      },
    });
  };

  // Delete single history item
  const handleDeleteItem = (item) => {
    const photoKey = item.photo || item.image;
    const updated = historyList.filter(
      (h) => (h.photo || h.image) !== photoKey && (h.id || h._id) !== (item.id || item._id)
    );
    setHistoryList(updated);

    // Update user-scoped storage
    setUserHistory(user, updated);

    // Sync deletion with backend if item has a DB ID
    if (item._id) {
      apiFetch(`http://localhost:8080/api/v1/history/${item._id}`, {
        method: "DELETE",
      }).catch((e) => console.warn("Backend history delete notice:", e));
    }

    if (selectedItem && (selectedItem.id === item.id || selectedItem.photo === item.photo)) {
      setSelectedItem(null);
    }

    showToast("Item deleted from history");
  };

  // Clear all history for current user
  const handleClearAllHistory = () => {
    setHistoryList([]);
    clearUserHistory(user);

    // Sync clear with backend
    apiFetch(`http://localhost:8080/api/v1/history`, {
      method: "DELETE",
    }).catch((e) => console.warn("Backend clear history notice:", e));

    setClearModalOpen(false);
    showToast("Generation history cleared successfully");
  };

  // Filtered & Sorted History
  const filteredAndSortedHistory = useMemo(() => {
    let result = [...historyList];

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          (item.prompt && item.prompt.toLowerCase().includes(q)) ||
          (item.style && item.style.toLowerCase().includes(q)) ||
          (item.ratio && item.ratio.toLowerCase().includes(q))
      );
    }

    // 2. Date Range Filter
    if (dateFilter !== "All Generations") {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const startOfThisWeek = startOfToday - 7 * 24 * 60 * 60 * 1000;
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

      result = result.filter((item) => {
        const itemTime = item.createdAt ? new Date(item.createdAt).getTime() : 0;
        if (dateFilter === "Today") {
          return itemTime >= startOfToday || item.date === "Today";
        } else if (dateFilter === "This Week") {
          return itemTime >= startOfThisWeek;
        } else if (dateFilter === "This Month") {
          return itemTime >= startOfThisMonth;
        }
        return true;
      });
    }

    // 3. Sorting
    if (sortBy === "Newest First") {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sortBy === "Oldest First") {
      result.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    } else if (sortBy === "Most Liked") {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    return result;
  }, [historyList, search, dateFilter, sortBy]);

  // Group items by timeframe
  const groups = useMemo(() => {
    const todayList = [];
    const yesterdayList = [];
    const thisWeekList = [];
    const earlierList = [];

    filteredAndSortedHistory.forEach((item) => {
      const category = getDateCategory(item.createdAt);
      if (category === "Today") {
        todayList.push(item);
      } else if (category === "Yesterday") {
        yesterdayList.push(item);
      } else if (category === "This Week") {
        thisWeekList.push(item);
      } else {
        earlierList.push(item);
      }
    });

    return [
      { name: "Today", items: todayList },
      { name: "Yesterday", items: yesterdayList },
      { name: "This Week", items: thisWeekList },
      { name: "Earlier", items: earlierList },
    ].filter((g) => g.items.length > 0);
  }, [filteredAndSortedHistory]);

  return (
    <div className="w-full pb-12">
      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[3000] flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-xl animate-fadeIn">
          <Check size={16} className="text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
            <Clock size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Generation History
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View, download, favorite, and manage your previously generated AI images.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {historyList.length > 0 && (
            <button
              type="button"
              onClick={() => setClearModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 active:scale-95"
              title="Clear all generated history"
            >
              <Trash2 size={16} />
              <span>Clear History</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/create-post")}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 active:scale-95"
          >
            <Plus size={17} />
            <span>Generate New</span>
          </button>
        </div>
      </div>

      {/* ================= SEARCH & FILTER CONTROLS ================= */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="flex w-full max-w-md items-center rounded-xl border border-gray-200 bg-white px-4 shadow-sm focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/10">
          <Search size={19} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search history by prompt, style, or ratio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm outline-none transition focus:border-indigo-600"
          >
            <option>All Generations</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm outline-none transition focus:border-indigo-600"
          >
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Most Liked</option>
          </select>
        </div>
      </div>

      {/* ================= GENERATION SECTIONS ================= */}
      {loading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
          <RefreshCw size={24} className="animate-spin text-indigo-600" />
          <span className="text-sm font-medium text-gray-500">Loading history...</span>
        </div>
      ) : groups.length > 0 ? (
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.name}>
              <div className="mb-4 flex items-center gap-2">
                <Clock size={18} className="text-indigo-600" />
                <h2 className="text-lg font-bold text-gray-800">{group.name}</h2>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                  {group.items.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.items.map((item) => (
                  <HistoryCard
                    key={item.id || item._id}
                    item={item}
                    isFavorited={isItemFavorited(item)}
                    onToggleFavorite={() => handleToggleFavorite(item)}
                    onDownload={() => handleDownload(item)}
                    onCopyPrompt={() => handleCopyPrompt(item.prompt)}
                    onRegenerate={() => handleRegenerate(item)}
                    onDelete={() => handleDeleteItem(item)}
                    onViewDetails={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* ================= EMPTY STATE ================= */
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Sparkles size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {search ? "No matches found in history" : "No generation history yet"}
          </h3>
          <p className="mt-1 max-w-md text-sm text-gray-500">
            {search
              ? `No images matched your query "${search}". Try searching for another style, keyword, or clear your search.`
              : "Bring your imagination to life! Generate your first AI artwork and it will automatically be stored here."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/create-post")}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 active:scale-95"
          >
            <Plus size={17} />
            <span>Generate Artwork Now</span>
          </button>
        </div>
      )}

      {/* ================= VIEW DETAILS MODAL ================= */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur transition hover:bg-gray-100"
            >
              <X size={19} />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Image Preview */}
              <div className="flex items-center justify-center bg-gray-950">
                <img
                  src={selectedItem.photo || selectedItem.image}
                  alt={selectedItem.prompt}
                  className="max-h-[420px] w-full object-contain"
                />
              </div>

              {/* Metadata Details */}
              <div className="flex flex-col justify-between p-6">
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                    <h2 className="text-xl font-bold text-gray-900">Generation Details</h2>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                      {selectedItem.style || "Digital Art"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Prompt Description
                      </p>
                      <p className="rounded-xl bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
                        "{selectedItem.prompt}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
                        <p className="text-xs font-medium text-gray-400">Created Date</p>
                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {selectedItem.date || "Today"}
                        </p>
                        <p className="text-xs text-gray-500">{selectedItem.time || ""}</p>
                      </div>

                      <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
                        <p className="text-xs font-medium text-gray-400">Aspect Ratio</p>
                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {selectedItem.ratio || "1:1"}
                        </p>
                        <p className="text-xs text-gray-500">High Definition</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="mt-6 flex flex-col gap-2.5 border-t border-gray-100 pt-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(selectedItem)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(selectedItem.prompt)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-95"
                    >
                      <Copy size={16} />
                      <span>Copy Prompt</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleRegenerate(selectedItem);
                        setSelectedItem(null);
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                    >
                      <RefreshCw size={14} />
                      <span>Regenerate in Studio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleDeleteItem(selectedItem);
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CLEAR ALL CONFIRMATION MODAL ================= */}
      {clearModalOpen && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-lg font-bold text-gray-900">Clear Generation History?</h3>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Are you sure you want to delete all saved generation history? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setClearModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAllHistory}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 active:scale-95"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =====================================================
   HISTORY CARD COMPONENT
===================================================== */
const HistoryCard = ({
  item,
  isFavorited,
  onToggleFavorite,
  onDownload,
  onCopyPrompt,
  onRegenerate,
  onDelete,
  onViewDetails,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on click outside
  useEffect(() => {
    const handleOutsideClick = () => setMenuOpen(false);
    if (menuOpen) {
      window.addEventListener("click", handleOutsideClick);
    }
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [menuOpen]);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* IMAGE BOX */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-950">
        <img
          src={item.photo || item.image}
          alt={item.prompt}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Top Floating Controls */}
        <div className="absolute right-2 top-2 z-20 flex items-center gap-1.5">
          {/* Favorite heart button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:scale-110 hover:bg-white hover:text-red-500 shadow-md"
            title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart
              size={15}
              className={isFavorited ? "fill-red-500 text-red-500" : "text-white"}
            />
          </button>

          {/* Three dot button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-white hover:text-gray-900 shadow-md"
            title="Options"
          >
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div
            className="absolute right-2 top-11 z-50 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                onViewDetails();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Eye size={15} />
              <span>View Details</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onRegenerate();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <RefreshCw size={15} />
              <span>Regenerate</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onToggleFavorite();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Heart size={15} className={isFavorited ? "fill-red-500 text-red-500" : ""} />
              <span>{isFavorited ? "Remove Favorite" : "Add to Favorites"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onDownload();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Download size={15} />
              <span>Download</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onCopyPrompt();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Copy size={15} />
              <span>Copy Prompt</span>
            </button>

            <div className="my-1 border-t border-gray-100" />

            <button
              type="button"
              onClick={() => {
                onDelete();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50"
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* CARD CONTENT */}
      <div className="p-4">
        <h3
          onClick={onViewDetails}
          className="line-clamp-2 cursor-pointer text-sm font-semibold text-gray-800 transition hover:text-indigo-600"
          title={item.prompt}
        >
          {item.prompt}
        </h3>

        {/* METADATA ROW */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span className="font-medium">{item.time || "Recently"}</span>
          <span className="rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
            {item.ratio || "1:1"}
          </span>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-xs font-medium text-gray-400">
            {item.style || "AI Art"}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              title="View Details"
              onClick={onViewDetails}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Eye size={16} />
            </button>

            <button
              type="button"
              title="Download Artwork"
              onClick={onDownload}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            >
              <Download size={16} />
            </button>

            <button
              type="button"
              title="Regenerate"
              onClick={onRegenerate}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
            >
              <RefreshCw size={15} />
            </button>

            <button
              type="button"
              title="Delete from History"
              onClick={onDelete}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;

