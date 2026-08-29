import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  Download,
  Heart,
  Eye,
  RefreshCw,
  Plus,
  X,
  Copy,
  Check,
  Filter,
  Image as ImageIcon,
  User,
} from "lucide-react";
import { downloadImage, getUserGallery, getUserHistory } from "../utils";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const SHOWCASE_FALLBACK = [
  {
    _id: "demo-1",
    photo: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80",
    prompt: "A beautiful futuristic city at night with neon lights and flying vehicles",
    name: "Alex Rivera",
    likes: 48,
    style: "Cyberpunk",
    ratio: "16:9",
    createdAt: "2026-08-20T10:00:00.000Z",
  },
  {
    _id: "demo-2",
    photo: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
    prompt: "Mystical mountains under a starry sky with glowing nebula",
    name: "Sarah Chen",
    likes: 82,
    style: "Fantasy",
    ratio: "16:9",
    createdAt: "2026-08-20T12:30:00.000Z",
  },
  {
    _id: "demo-3",
    photo: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80",
    prompt: "Enchanted emerald forest in the morning mist with fireflies",
    name: "John Miller",
    likes: 34,
    style: "Nature",
    ratio: "4:3",
    createdAt: "2026-08-21T08:15:00.000Z",
  },
  {
    _id: "demo-4",
    photo: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80",
    prompt: "Futuristic android portrait with holographic interface reflections",
    name: "David Vance",
    likes: 95,
    style: "Cyberpunk",
    ratio: "1:1",
    createdAt: "2026-08-21T15:40:00.000Z",
  },
  {
    _id: "demo-5",
    photo: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    prompt: "Fantasy floating castle surrounded by waterfalls and purple clouds",
    name: "Emma Watson",
    likes: 67,
    style: "Fantasy",
    ratio: "16:9",
    createdAt: "2026-08-21T17:20:00.000Z",
  },
  {
    _id: "demo-6",
    photo: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80",
    prompt: "Modern architectural luxury villa with minimalist lighting and glass pool",
    name: "Sophia Taylor",
    likes: 53,
    style: "Realistic",
    ratio: "1:1",
    createdAt: "2026-08-21T19:00:00.000Z",
  },
];

function GalleryCard({ item, onOpenModal }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes || 12);
  const [downloading, setDownloading] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    if (liked) {
      setLikeCount((prev) => prev - 1);
      setLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      setDownloading(true);
      await downloadImage(item._id, item.photo);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const authorName = item.name || "GenCanvas Creator";
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <div
      onClick={() => onOpenModal(item)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={item.photo}
          alt={item.prompt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Quick Action Buttons (Top Right on hover) */}
        <div className="absolute right-3 top-3 flex translate-y-[-10px] items-center gap-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm transition hover:bg-indigo-600 hover:text-white"
            title="Download image"
          >
            <Download size={14} />
          </button>
        </div>

        {/* Style Tag (Top Left) */}
        {item.style && (
          <div className="absolute left-3 top-3">
            <span className="rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
              {item.style}
            </span>
          </div>
        )}

        {/* Bottom Details on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="line-clamp-2 text-xs font-medium leading-relaxed drop-shadow-sm">
            {item.prompt}
          </p>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-[10px] font-bold text-white">
            {authorInitial}
          </div>
          <span className="max-w-[100px] truncate text-xs font-medium text-gray-700">
            {authorName}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition ${
              liked
                ? "bg-pink-50 text-pink-600"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Heart
              size={12}
              className={liked ? "fill-pink-600 text-pink-600" : "text-gray-400"}
            />
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [styleFilter, setStyleFilter] = useState("All Styles");
  const [selectedPost, setSelectedPost] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch posts from Backend and Local User Gallery
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get user locally created posts
      let localGallery = [];
      try {
        const stored = getUserGallery(user);
        const history = getUserHistory(user);
        const combined = [...stored, ...history];
        const seenPhotos = new Set();
        for (const item of combined) {
          if (item?.photo && !seenPhotos.has(item.photo)) {
            seenPhotos.add(item.photo);
            localGallery.push(item);
          }
        }
      } catch (err) {
        console.warn("Could not read user gallery:", err);
      }

      // 2. Fetch from Backend MongoDB
      let backendPosts = [];
      try {
        const response = await fetch("http://localhost:8080/api/v1/post");
        const result = await response.json();
        if (response.ok && result.success && Array.isArray(result.data)) {
          backendPosts = result.data;
        }
      } catch (err) {
        console.warn("Could not fetch backend posts, falling back to local:", err.message);
      }

      // 3. Merge: Local user creations + Backend MongoDB posts + Showcase Fallback
      const allMerged = [];
      const seen = new Set();

      for (const item of [...localGallery, ...backendPosts, ...SHOWCASE_FALLBACK]) {
        const key = item.photo || item._id || item.id;
        if (key && !seen.has(key)) {
          seen.add(key);
          allMerged.push(item);
        }
      }

      setPosts(allMerged);
    } catch (err) {
      console.warn("Fetch posts error:", err);
      setPosts(SHOWCASE_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  // Filtered and searched posts
  const filteredPosts = useMemo(() => {
    let list = [...posts];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (item) =>
          (item.prompt && item.prompt.toLowerCase().includes(q)) ||
          (item.name && item.name.toLowerCase().includes(q))
      );
    }

    // Category sorting / filtering
    if (category === "Popular") {
      list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (category === "Latest") {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    // Style filter
    if (styleFilter !== "All Styles") {
      list = list.filter((item) =>
        item.style ? item.style.toLowerCase() === styleFilter.toLowerCase() : true
      );
    }

    return list;
  }, [posts, search, category, styleFilter]);

  const handleCopyPrompt = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Community Gallery
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Explore AI Showcase
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Discover imaginative and stunning visual artwork generated by AI creators worldwide.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchPosts}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95"
                title="Reload latest community posts"
              >
                <RefreshCw size={15} className={loading ? "animate-spin text-indigo-600" : ""} />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/create-post")}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 active:scale-95"
              >
                <Plus size={17} />
                <span>Create Image</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search creations, prompts, or artists..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
            />
          </div>

          {/* Category Tabs & Style Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Popular", "Latest"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  category === cat
                    ? "bg-gray-900 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}

            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm outline-none transition focus:border-indigo-600"
            >
              <option>All Styles</option>
              <option>Cyberpunk</option>
              <option>Fantasy</option>
              <option>Digital Art</option>
              <option>Realistic</option>
              <option>Nature</option>
            </select>
          </div>
        </div>

        {/* Gallery Content */}
        {loading ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center gap-3">
            <Loader />
            <span className="text-sm font-medium text-gray-500">
              Loading community gallery creations...
            </span>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPosts.map((item) => (
              <GalleryCard
                key={item._id || item.id}
                item={item}
                onOpenModal={setSelectedPost}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <ImageIcon size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No creations found</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              {search ? `No images matched "${search}". Try another keyword.` : "Be the first to generate and publish an image to the community gallery!"}
            </p>
            <button
              type="button"
              onClick={() => navigate("/create-post")}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus size={16} />
              <span>Create Artwork Now</span>
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Inspector Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative flex max-h-[90vh] max-w-4xl flex-col md:flex-row overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-gray-300 hover:bg-red-600 hover:text-white transition shadow-lg"
            >
              <X size={18} />
            </button>

            {/* Left: Image */}
            <div className="flex items-center justify-center bg-black md:max-w-[55%]">
              <img
                src={selectedPost.photo}
                alt={selectedPost.prompt}
                className="max-h-[80vh] w-full object-contain"
              />
            </div>

            {/* Right: Details & Tools */}
            <div className="flex flex-1 flex-col justify-between p-6 text-slate-200">
              <div>
                {/* Author Info */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white">
                    {(selectedPost.name || "C").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {selectedPost.name || "GenCanvas Creator"}
                    </h3>
                    <span className="text-xs text-slate-400">
                      Community Artist
                    </span>
                  </div>
                </div>

                {/* Prompt Section */}
                <div className="mb-4 rounded-xl bg-slate-800/80 p-4 border border-slate-700/50">
                  <span className="text-xs font-semibold text-indigo-400 block mb-1.5">
                    PROMPT
                  </span>
                  <p className="text-sm leading-relaxed text-slate-200">
                    "{selectedPost.prompt}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => downloadImage(selectedPost._id, selectedPost.photo)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500"
                >
                  <Download size={16} />
                  <span>Download Full Resolution</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyPrompt(selectedPost.prompt)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  <span>{copied ? "Prompt Copied!" : "Copy Prompt"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
