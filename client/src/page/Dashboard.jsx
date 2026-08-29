import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Image as ImageIcon,
  Heart,
  Download,
  History,
  ArrowRight,
  Plus,
  Wand2,
  Dice5,
  Copy,
  Check,
  Eye,
  RotateCw,
  X,
  Layers,
  Search,
  ExternalLink,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getUserHistory,
  getUserFavorites,
  setUserFavorites,
  getUserId,
  getRandomPrompt,
  downloadImage,
} from "../utils";
import "./Dashboard.css";

const PROMPT_SUGGESTION_CHIPS = [
  "Cyberpunk neon metropolis with flying cars in rainy night",
  "Mystical cosmic nebula with glowing aurora crystals",
  "Studio Ghibli enchanted wildflower meadow with ancient shrine",
  "3D isometric floating fantasy island in clouds, octane render",
  "Hyperrealistic portrait of an ancient cyberpunk warrior",
  "Vibrant watercolor lotus pond at sunrise with golden koi fish",
];

const FALLBACK_SPOTLIGHT = [
  {
    _id: "spotlight-1",
    photo: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80",
    prompt: "Futuristic city with flying neon vehicles in purple mist",
    name: "Alex Rivera",
    likes: 48,
    style: "Cyberpunk",
  },
  {
    _id: "spotlight-2",
    photo: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
    prompt: "Mystical mountain peaks beneath radiant cosmic aurora",
    name: "Sarah Chen",
    likes: 82,
    style: "Fantasy",
  },
  {
    _id: "spotlight-3",
    photo: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80",
    prompt: "Enchanted ancient forest with glowing bioluminescent flora",
    name: "John Miller",
    likes: 34,
    style: "Digital Art",
  },
  {
    _id: "spotlight-4",
    photo: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80",
    prompt: "AI robotic consciousness with holographic glass reflections",
    name: "Elena Rostova",
    likes: 65,
    style: "3D Render",
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Stats & data state
  const [stats, setStats] = useState({
    totalGenerations: 0,
    totalFavorites: 0,
    totalPosts: 0,
    totalDownloads: 0,
  });

  const [historyItems, setHistoryItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [communitySpotlight, setCommunitySpotlight] = useState(FALLBACK_SPOTLIGHT);
  const [loading, setLoading] = useState(true);

  // Quick Prompt Bar State
  const [quickPrompt, setQuickPrompt] = useState("");

  // Inspection Modal State
  const [selectedCreation, setSelectedCreation] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Filter tabs for Recent section
  const [activeTab, setActiveTab] = useState("All");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Load Dashboard Data from Backend API + User-Scoped Storage
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const uid = getUserId(user);

      // 1. Load user-scoped local fallback
      const localHistory = getUserHistory(user);
      const localFavs = getUserFavorites(user);
      setHistoryItems(localHistory);
      setFavorites(localFavs);

      setStats({
        totalGenerations: localHistory.length,
        totalFavorites: localFavs.length,
        totalPosts: Math.max(0, Math.floor(localHistory.length * 0.4)),
        totalDownloads: Math.max(0, Math.floor(localHistory.length * 0.75)),
      });

      // 2. Fetch aggregated data from Backend Dashboard API via JWT
      try {
        const res = await apiFetch(`http://localhost:8080/api/v1/dashboard/stats`);
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.stats) {
            setStats({
              totalGenerations: Math.max(data.stats.totalGenerations || 0, localHistory.length),
              totalFavorites: Math.max(data.stats.totalFavorites || 0, localFavs.length),
              totalPosts: data.stats.totalPosts || 0,
              totalDownloads: data.stats.totalDownloads || Math.max(0, Math.floor(localHistory.length * 0.75)),
            });
          }

          if (Array.isArray(data.recentCreations) && data.recentCreations.length > 0) {
            // Deduplicate backend + local
            const combined = [...data.recentCreations, ...localHistory];
            const unique = [];
            const seen = new Set();
            for (const item of combined) {
              const photoKey = item.photo || item.image;
              if (photoKey && !seen.has(photoKey)) {
                seen.add(photoKey);
                unique.push(item);
              }
            }
            setHistoryItems(unique);
          }

          if (Array.isArray(data.communitySpotlight) && data.communitySpotlight.length > 0) {
            setCommunitySpotlight(data.communitySpotlight);
          }
        }
      } catch (backendErr) {
        console.warn("Backend dashboard fetch notice:", backendErr.message);
      }
    } catch (err) {
      console.warn("Dashboard data load notice:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // Handle Quick Surprise Me
  const handleSurpriseMe = () => {
    const random = getRandomPrompt(quickPrompt);
    setQuickPrompt(random);
  };

  // Launch Studio with Prompt
  const handleLaunchStudio = (promptToUse) => {
    const p = (promptToUse || quickPrompt).trim();
    navigate("/create-post", {
      state: p ? { prompt: p } : undefined,
    });
  };

  // Toggle Favorite for an item
  const handleToggleFavorite = (item, e) => {
    if (e) e.stopPropagation();
    try {
      const photoKey = item.photo || item.image;
      const isFav = favorites.some((f) => (f.photo || f.image) === photoKey || f._id === item._id);
      let updatedFavs = [];

      if (isFav) {
        updatedFavs = favorites.filter((f) => (f.photo || f.image) !== photoKey && f._id !== item._id);
        showToast("Removed from favorites");
      } else {
        const favObj = {
          ...item,
          _id: item._id || item.id || Date.now().toString(),
          photo: photoKey,
          image: photoKey,
          name: item.name || user?.name || "GenCanvas Creator",
        };
        updatedFavs = [favObj, ...favorites];
        showToast("✨ Added to favorites!");
      }

      setFavorites(updatedFavs);
      setUserFavorites(user, updatedFavs);

      // Backend sync via JWT
      apiFetch("http://localhost:8080/api/v1/favorite/toggle", {
        method: "POST",
        body: JSON.stringify({
          photo: photoKey,
          prompt: item.prompt,
          name: item.name || user?.name || "GenCanvas Creator",
          style: item.style,
          ratio: item.ratio,
        }),
      }).catch(() => {});
    } catch (err) {
      console.warn("Fav toggle error:", err);
    }
  };

  // Quick Download handler
  const handleQuickDownload = async (item, e) => {
    if (e) e.stopPropagation();
    try {
      showToast("Downloading artwork...");
      await downloadImage(item._id || item.id || Date.now(), item.photo || item.image);
    } catch (err) {
      showToast("Download failed");
    }
  };

  // Copy prompt helper
  const handleCopyPrompt = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    showToast("Prompt copied to clipboard!");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Filtered recent items based on tab
  const displayedRecentCreations = useMemo(() => {
    if (activeTab === "Favorites") {
      return favorites.slice(0, 8);
    }
    if (activeTab === "Today") {
      return historyItems.filter((i) => i.date === "Today" || (i.createdAt && new Date(i.createdAt).toDateString() === new Date().toDateString())).slice(0, 8);
    }
    return historyItems.slice(0, 8);
  }, [activeTab, historyItems, favorites]);

  return (
    <div className="dashboard-app">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl transition-all">
          <Sparkles size={16} className="text-indigo-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <main className="dashboard-content">
        {/* =====================================================
            HERO & GREETING (No waving hand symbol)
        ===================================================== */}
        <section className="welcome-section">
          <div className="welcome-text">
            <div className="workspace-badge">
              <Sparkles size={14} />
              <span>GenCanvas AI Studio</span>
            </div>

            <h1>Welcome back, {user?.name || "Creator"}</h1>

            <p>
              Generate high-resolution AI visual art, manage your personal creations, and explore endless styles.
            </p>
          </div>

          <Link to="/create-post" className="create-button">
            <Plus size={18} />
            <span>Open Studio</span>
          </Link>
        </section>

        {/* =====================================================
            HERO QUICK PROMPT GENERATOR BAR
        ===================================================== */}
        <section className="quick-prompt-banner mb-10">
          <div className="quick-prompt-inner">
            <div className="quick-prompt-header">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Wand2 size={15} />
                <span>Instant Art Generator</span>
              </div>
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800"
                title="Get inspiration with a random prompt"
              >
                <Dice5 size={14} />
                <span>Surprise Me</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLaunchStudio();
              }}
              className="quick-prompt-form"
            >
              <div className="quick-prompt-input-wrapper">
                <Search size={18} className="quick-prompt-search-icon" />
                <input
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder="Describe your imagination (e.g. Cyberpunk samurai in rainy neon Tokyo)..."
                  className="quick-prompt-input"
                />
                {quickPrompt && (
                  <button
                    type="button"
                    onClick={() => setQuickPrompt("")}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <button type="submit" className="quick-prompt-submit-btn">
                <Sparkles size={16} />
                <span>Generate</span>
              </button>
            </form>

            {/* Prompt Inspiration Chips */}
            <div className="quick-prompt-chips">
              <span className="text-xs font-medium text-gray-400">Try prompt:</span>
              <div className="flex flex-wrap gap-2">
                {PROMPT_SUGGESTION_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuickPrompt(chip)}
                    className="quick-prompt-chip"
                  >
                    {chip.length > 34 ? `${chip.slice(0, 34)}...` : chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            INTERACTIVE STATS OVERVIEW
        ===================================================== */}
        <section className="overview-section mb-12">
          <div className="section-title flex items-center justify-between">
            <div>
              <h2>Your Creative Overview</h2>
              <p>Track your generations, favorites, and creative metrics in real time.</p>
            </div>
            <button
              type="button"
              onClick={loadDashboardData}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400"
            >
              <RotateCw size={13} className={loading ? "animate-spin" : ""} />
              <span>Refresh Stats</span>
            </button>
          </div>

          <div className="stats-grid">
            {/* Images Generated */}
            <div
              onClick={() => navigate("/history")}
              className="stat-card cursor-pointer group"
              title="Click to view history"
            >
              <div className="stat-icon purple group-hover:scale-110 transition-transform">
                <ImageIcon size={22} />
              </div>
              <div className="stat-info">
                <strong>{stats.totalGenerations}</strong>
                <span>Images Generated</span>
              </div>
              <div className="stat-card-arrow">
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Favorites */}
            <div
              onClick={() => navigate("/favorites")}
              className="stat-card cursor-pointer group"
              title="Click to view favorites"
            >
              <div className="stat-icon pink group-hover:scale-110 transition-transform">
                <Heart size={22} />
              </div>
              <div className="stat-info">
                <strong>{stats.totalFavorites}</strong>
                <span>Favorite Artworks</span>
              </div>
              <div className="stat-card-arrow">
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Shared Posts / Gallery */}
            <div
              onClick={() => navigate("/gallery")}
              className="stat-card cursor-pointer group"
              title="Click to view gallery"
            >
              <div className="stat-icon blue group-hover:scale-110 transition-transform">
                <Layers size={22} />
              </div>
              <div className="stat-info">
                <strong>{stats.totalPosts}</strong>
                <span>Community Posts</span>
              </div>
              <div className="stat-card-arrow">
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Account Tier */}
            <div
              onClick={() => navigate("/profile")}
              className="stat-card cursor-pointer group"
              title="Click to view profile"
            >
              <div className="stat-icon violet group-hover:scale-110 transition-transform">
                <Shield size={22} />
              </div>
              <div className="stat-info">
                <strong className="text-lg font-bold">{user?.plan || "Free Creator"}</strong>
                <span>Studio Tier</span>
              </div>
              <div className="stat-card-arrow">
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            INTERACTIVE RECENT CREATIONS WITH TABS & MODAL
        ===================================================== */}
        <section className="recent-section mb-12">
          <div className="recent-header flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="section-title mb-0">
                <h2>Recent Creations</h2>
                <p>Your latest AI artwork generated and saved to your account.</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
                {["All", "Today", "Favorites"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                      activeTab === tab
                        ? "bg-white text-indigo-600 shadow-sm dark:bg-gray-900 dark:text-indigo-400"
                        : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <Link to="/history" className="view-all">
                <span>View Full History</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Grid of Creations */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {displayedRecentCreations.length > 0 ? (
              displayedRecentCreations.map((item) => {
                const photoSrc = item.photo || item.image;
                const isFav = favorites.some((f) => (f.photo || f.image) === photoSrc || f._id === item._id);

                return (
                  <div
                    key={item._id || item.id}
                    onClick={() => setSelectedCreation(item)}
                    className="interactive-creation-card group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-square w-full overflow-hidden bg-gray-900">
                      <img
                        src={photoSrc}
                        alt={item.prompt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      {/* Top Action Icons */}
                      <div className="absolute right-2.5 top-2.5 flex translate-y-[-10px] items-center gap-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => handleToggleFavorite(item, e)}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-md transition ${
                            isFav
                              ? "bg-pink-600 text-white"
                              : "bg-black/60 text-white hover:bg-pink-600 hover:text-white"
                          }`}
                          title={isFav ? "Favorited" : "Add to favorites"}
                        >
                          <Heart size={14} className={isFav ? "fill-white" : ""} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleQuickDownload(item, e)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md transition hover:bg-indigo-600"
                          title="Download Image"
                        >
                          <Download size={14} />
                        </button>
                      </div>

                      {/* Style Tag */}
                      {item.style && (
                        <div className="absolute left-2.5 top-2.5">
                          <span className="rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-md">
                            {item.style}
                          </span>
                        </div>
                      )}

                      {/* Hover details */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <p className="line-clamp-2 text-xs font-medium drop-shadow-sm">
                          {item.prompt}
                        </p>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between border-t border-gray-100 p-3 dark:border-gray-800">
                      <span className="truncate text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {item.prompt}
                      </span>
                      <span className="shrink-0 text-[10px] text-gray-400">
                        {item.time || item.date || "Recent"}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-12 text-center dark:border-gray-800">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                  <Wand2 size={26} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">No creations yet</h3>
                <p className="mb-5 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                  Start creating with AI Studio. Your generated artworks will be stored here privately.
                </p>
                <Link to="/create-post" className="create-button text-xs py-2 px-4">
                  <Plus size={16} />
                  <span>Generate Your First Art</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            COMMUNITY INSPIRATION SPOTLIGHT
        ===================================================== */}
        <section className="mb-12">
          <div className="section-title flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h2>Trending Inspiration</h2>
              </div>
              <p>Top artistic styles and prompts created by the community.</p>
            </div>
            <Link to="/gallery" className="view-all">
              <span>Explore Gallery</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {communitySpotlight.map((spot, idx) => (
              <div
                key={spot._id || idx}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-900">
                  <img
                    src={spot.photo}
                    alt={spot.prompt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="mb-1 inline-block rounded bg-indigo-600/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                      {spot.style || "Featured"}
                    </span>
                    <p className="line-clamp-2 text-xs font-medium">{spot.prompt}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-xs font-medium text-gray-500">{spot.name || "Creator"}</span>
                  <button
                    type="button"
                    onClick={() => handleLaunchStudio(spot.prompt)}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400"
                  >
                    <span>Try Prompt</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            QUICK ACTIONS SHORTCUTS
        ===================================================== */}
        <section className="quick-actions-section mb-6">
          <div className="section-title">
            <h2>Quick Actions</h2>
            <p>Direct shortcuts to your favorite creative tools.</p>
          </div>

          <div className="quick-actions-grid">
            <Link to="/create-post" className="action-card generate-card">
              <div className="action-icon">
                <Wand2 size={24} />
              </div>
              <div className="action-content">
                <h3>Generate Art</h3>
                <p>Create high-resolution AI art with custom aspect ratios, styles, and prompt engineering.</p>
                <span className="action-link">
                  Open Studio
                  <ArrowRight size={15} />
                </span>
              </div>
            </Link>

            <Link to="/gallery" className="action-card gallery-card">
              <div className="action-icon">
                <ImageIcon size={24} />
              </div>
              <div className="action-content">
                <h3>Community Gallery</h3>
                <p>Discover thousands of community prompt masterpieces, styles, and artistic inspirations.</p>
                <span className="action-link">
                  Explore Gallery
                  <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* =====================================================
          INTERACTIVE ARTWORK INSPECTION MODAL
      ===================================================== */}
      {selectedCreation && (
        <div
          onClick={() => setSelectedCreation(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900 md:flex-row"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedCreation(null)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black"
            >
              <X size={18} />
            </button>

            {/* Modal Image */}
            <div className="relative flex max-h-[45vh] w-full items-center justify-center bg-black md:max-h-none md:w-1/2">
              <img
                src={selectedCreation.photo || selectedCreation.image}
                alt={selectedCreation.prompt}
                className="max-h-full w-full object-contain"
              />
            </div>

            {/* Modal Details */}
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                    {selectedCreation.style || "Digital Art"}
                  </span>
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {selectedCreation.ratio || "1:1"}
                  </span>
                  <span className="ml-auto text-xs text-gray-400">
                    {selectedCreation.time || selectedCreation.date || "Recent"}
                  </span>
                </div>

                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Prompt</h3>
                <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  <p className="leading-relaxed">{selectedCreation.prompt}</p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-4 dark:border-gray-800">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(selectedCreation.prompt)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    {copiedPrompt ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    <span>{copiedPrompt ? "Copied!" : "Copy Prompt"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDownload(selectedCreation)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleLaunchStudio(selectedCreation.prompt);
                    setSelectedCreation(null);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-xs font-bold text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700"
                >
                  <Wand2 size={15} />
                  <span>Re-Generate in Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;