import React, { useMemo, useState } from "react";

const images = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80",
    prompt: "A beautiful futuristic city at night",
    author: "Alex",
    likes: 24,
    style: "Realistic",
    ratio: "16:9",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
    prompt: "Mystical mountains under a starry sky",
    author: "Sarah",
    likes: 51,
    style: "Fantasy",
    ratio: "16:9",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80",
    prompt: "Enchanted forest in the morning",
    author: "John",
    likes: 18,
    style: "Nature",
    ratio: "4:3",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    prompt: "Fantasy castle surrounded by mountains",
    author: "Emma",
    likes: 42,
    style: "Fantasy",
    ratio: "16:9",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80",
    prompt: "Futuristic robot in a cyberpunk city",
    author: "David",
    likes: 67,
    style: "Cyberpunk",
    ratio: "1:1",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80",
    prompt: "Golden sunset over a peaceful landscape",
    author: "Mia",
    likes: 35,
    style: "Nature",
    ratio: "4:3",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800&q=80",
    prompt: "Beautiful futuristic architecture",
    author: "Ryan",
    likes: 29,
    style: "Realistic",
    ratio: "16:9",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80",
    prompt: "Modern architectural masterpiece",
    author: "Sophia",
    likes: 73,
    style: "Realistic",
    ratio: "1:1",
  },
];

function ImageCard({ item }) {
  const [liked, setLiked] = useState(false);
  const [favorite, setFavorite] = useState(false);

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={item.image}
          alt={item.prompt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Favorite */}
        <button
          onClick={() => setFavorite(!favorite)}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all hover:scale-110 ${
            favorite ? "text-yellow-500" : "text-gray-700"
          }`}
        >
          {favorite ? "★" : "☆"}
        </button>

        {/* View button */}
        <button className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-3 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          View Image
        </button>
      </div>

      {/* Card information */}
      <div className="p-4">
        <p className="mb-3 line-clamp-2 text-sm font-medium text-gray-800 dark:text-gray-200">
          {item.prompt}
        </p>

        <div className="flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-xs font-bold text-white">
              {item.author.charAt(0)}
            </div>

            <span className="text-sm text-gray-600 dark:text-gray-400">
              @{item.author.toLowerCase()}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1 text-sm transition-colors ${
                liked
                  ? "text-red-500"
                  : "text-gray-500 hover:text-red-500 dark:text-gray-400"
              }`}
            >
              {liked ? "♥" : "♡"}
              <span>{item.likes + (liked ? 1 : 0)}</span>
            </button>

            <button
              className="text-gray-500 transition-colors hover:text-blue-500 dark:text-gray-400"
              title="Download"
            >
              ↓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Trending");
  const [style, setStyle] = useState("All Styles");
  const [ratio, setRatio] = useState("All Ratios");
  const [sort, setSort] = useState("Popular");

  const filteredImages = useMemo(() => {
    let result = [...images];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (item) =>
          item.prompt.toLowerCase().includes(query) ||
          item.author.toLowerCase().includes(query)
      );
    }

    // Style
    if (style !== "All Styles") {
      result = result.filter((item) => item.style === style);
    }

    // Ratio
    if (ratio !== "All Ratios") {
      result = result.filter((item) => item.ratio === ratio);
    }

    // Sort
    if (sort === "Popular") {
      result.sort((a, b) => b.likes - a.likes);
    }

    if (sort === "Latest") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [search, style, ratio, sort]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-gray-950 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Explore AI Creations
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Discover amazing images created by the AI community.
            </p>
          </div>

          <button className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            + Create Image
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search images, prompts or creators..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-800"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {["Trending", "Latest", "Popular"].map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
              category === item
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        {/* Style */}
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
        >
          <option>All Styles</option>
          <option>Realistic</option>
          <option>Fantasy</option>
          <option>Cyberpunk</option>
          <option>Nature</option>
        </select>

        {/* Ratio */}
        <select
          value={ratio}
          onChange={(e) => setRatio(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
        >
          <option>All Ratios</option>
          <option>1:1</option>
          <option>4:3</option>
          <option>16:9</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
        >
          <option>Popular</option>
          <option>Latest</option>
        </select>
      </div>

      {/* Results count */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {category} Creations
        </h2>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredImages.length} images
        </span>
      </div>

      {/* Image Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredImages.map((item) => (
            <ImageCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 text-4xl">🔍</div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            No images found
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try changing your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}