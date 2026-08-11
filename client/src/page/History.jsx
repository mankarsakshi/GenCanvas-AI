
import React, { useState } from "react";
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
  X,
} from "lucide-react";

const historyData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800",
    prompt: "Futuristic city at night with neon lights",
    time: "10:42 AM",
    date: "Today",
    ratio: "16:9",
    likes: 24,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    prompt: "Advanced AI robot portrait",
    time: "09:30 AM",
    date: "Today",
    ratio: "1:1",
    likes: 18,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800",
    prompt: "Beautiful galaxy and stars in deep space",
    time: "08:15 AM",
    date: "Today",
    ratio: "4:3",
    likes: 42,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800",
    prompt: "Mountain landscape during sunset",
    time: "06:45 PM",
    date: "Yesterday",
    ratio: "16:9",
    likes: 31,
  },
];

const History = () => {
  const [search, setSearch] = useState("");

  const filteredHistory = historyData.filter((item) =>
    item.prompt.toLowerCase().includes(search.toLowerCase())
  );

  const today = filteredHistory.filter(
    (item) => item.date === "Today"
  );

  const yesterday = filteredHistory.filter(
    (item) => item.date === "Yesterday"
  );

  return (
    <div className="w-full">

      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef0ff] text-[#6469ff]">
            <Clock size={23} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Generation History
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View and manage your previously generated AI images.
            </p>
          </div>

        </div>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        <div className="flex w-full max-w-md items-center rounded-xl border border-gray-200 bg-white px-4 shadow-sm">

          <Search
            size={19}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm outline-none"
          />

        </div>

        <div className="flex gap-3">

          <select className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none">
            <option>All Generations</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>

          <select className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none">
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Most Liked</option>
          </select>

        </div>

      </div>

      {/* ================= TODAY ================= */}

      {today.length > 0 && (
        <section className="mb-10">

          <div className="mb-4 flex items-center gap-2">

            <Clock
              size={18}
              className="text-[#6469ff]"
            />

            <h2 className="text-lg font-bold text-gray-800">
              Today
            </h2>

            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
              {today.length}
            </span>

          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {today.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
              />
            ))}

          </div>

        </section>
      )}

      {/* ================= YESTERDAY ================= */}

      {yesterday.length > 0 && (
        <section>

          <div className="mb-4 flex items-center gap-2">

            <Clock
              size={18}
              className="text-gray-500"
            />

            <h2 className="text-lg font-bold text-gray-800">
              Yesterday
            </h2>

            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
              {yesterday.length}
            </span>

          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {yesterday.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
              />
            ))}

          </div>

        </section>
      )}

    </div>
  );
};


/* =====================================================
   HISTORY CARD
===================================================== */

const HistoryCard = ({ item }) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.prompt);
    setMenuOpen(false);
  };

  return (
    <>
      {/* CARD */}

      <div className="group overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

        {/* IMAGE */}

        <div className="relative h-56 overflow-visible rounded-t-2xl bg-gray-100">

          <img
            src={item.image}
            alt={item.prompt}
            className="h-full w-full rounded-t-2xl object-cover transition duration-500 group-hover:scale-105"
          />

          {/* THREE DOT BUTTON */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md backdrop-blur transition hover:bg-white"
          >
            <MoreVertical size={18} />
          </button>

          {/* ================= DROPDOWN MENU ================= */}

          {menuOpen && (
            <div className="absolute right-3 top-14 z-50 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl">

              {/* View Details */}

              <button
                onClick={() => {
                  setShowDetails(true);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-[#f5f6ff]"
              >
                <Eye size={17} />
                <span>View Details</span>
              </button>

              {/* Regenerate */}

              <button
                onClick={() => {
                  console.log("Regenerate:", item.prompt);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-[#f5f6ff]"
              >
                <RefreshCw size={17} />
                <span>Regenerate</span>
              </button>

              {/* Add Favorite */}

              <button
                onClick={() => {
                  console.log("Add to favorites:", item.id);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-[#f5f6ff]"
              >
                <Heart size={17} />
                <span>Add to Favorites</span>
              </button>

              {/* Download */}

              <button
                onClick={() => {
                  console.log("Download:", item.image);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-[#f5f6ff]"
              >
                <Download size={17} />
                <span>Download</span>
              </button>

              {/* Copy Prompt */}

              <button
                onClick={handleCopyPrompt}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-[#f5f6ff]"
              >
                <Copy size={17} />
                <span>Copy Prompt</span>
              </button>

              <div className="my-1 border-t border-gray-100" />

              {/* Delete */}

              <button
                onClick={() => {
                  console.log("Delete:", item.id);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 transition hover:bg-red-50"
              >
                <Trash2 size={17} />
                <span>Delete</span>
              </button>

            </div>
          )}

        </div>

        {/* CONTENT */}

        <div className="p-4">

          <h3 className="line-clamp-2 text-sm font-semibold text-gray-800">
            {item.prompt}
          </h3>

          {/* META */}

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">

            <span>{item.time}</span>

            <span className="rounded-md bg-gray-100 px-2 py-1">
              {item.ratio}
            </span>

          </div>

          {/* ACTIONS */}

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">

            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Heart
                size={16}
                className="text-red-400"
              />
              {item.likes}
            </div>

            <div className="flex items-center gap-2">

              <button
                title="View"
                onClick={() => setShowDetails(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-[#eef0ff] hover:text-[#6469ff]"
              >
                <Eye size={17} />
              </button>

              <button
                title="Download"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100"
              >
                <Download size={17} />
              </button>

              <button
                title="Delete"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={17} />
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          VIEW DETAILS MODAL
      ===================================================== */}

      {showDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* CLOSE */}

            <button
              onClick={() => setShowDetails(false)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
            >
              <X size={19} />
            </button>

            <div className="grid md:grid-cols-2">

              {/* IMAGE */}

              <div className="bg-gray-100">
                <img
                  src={item.image}
                  alt={item.prompt}
                  className="h-full min-h-[350px] w-full object-cover"
                />
              </div>

              {/* DETAILS */}

              <div className="p-6">

                <h2 className="mb-5 text-xl font-bold text-gray-900">
                  Generation Details
                </h2>

                <div className="space-y-5">

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase text-gray-400">
                      Prompt
                    </p>

                    <p className="text-sm leading-6 text-gray-700">
                      {item.prompt}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <p className="text-xs text-gray-400">
                        Generated
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {item.date}
                      </p>

                      <p className="text-sm text-gray-500">
                        {item.time}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Aspect Ratio
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {item.ratio}
                      </p>
                    </div>

                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Likes
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <Heart
                        size={17}
                        className="text-red-500"
                        fill="currentColor"
                      />

                      <span className="text-sm font-medium">
                        {item.likes}
                      </span>
                    </div>
                  </div>

                  {/* MODAL ACTIONS */}

                  <div className="flex gap-3 pt-3">

                    <button
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6469ff] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#5559e8]"
                    >
                      <Download size={17} />
                      Download
                    </button>

                    <button
                      onClick={handleCopyPrompt}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <Copy size={17} />
                      Copy Prompt
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </>
  );
};

export default History;

