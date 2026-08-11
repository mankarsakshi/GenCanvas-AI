import React from "react";
import { Heart, Download, MoreVertical, Search } from "lucide-react";

const favoriteImages = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
    title: "Mountain Landscape",
    creator: "@sakshi",
    likes: 42,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    title: "Beautiful Nature",
    creator: "@creator",
    likes: 35,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
    title: "Fantasy Landscape",
    creator: "@alex",
    likes: 58,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    title: "Ocean View",
    creator: "@john",
    likes: 27,
  },
];

const Favorites = () => {
  return (
    <div className="min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="mb-8">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Favorites ❤️
            </h1>

            <p className="mt-2 text-gray-500">
              Your saved AI creations in one place.
            </p>
          </div>

          {/* SEARCH */}
          <div className="flex w-full items-center rounded-xl border border-gray-200 bg-white px-4 md:w-[300px]">

            <Search
              size={19}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Search favorites..."
              className="w-full bg-transparent px-3 py-3 text-sm outline-none"
            />

          </div>

        </div>

      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="mb-6 flex flex-wrap items-center gap-3">

        <button className="rounded-lg bg-[#6469ff] px-4 py-2 text-sm font-medium text-white">
          All
        </button>

        <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
          My Creations
        </button>

        <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
          Community
        </button>

        <select className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 outline-none">
          <option>Newest</option>
          <option>Most Liked</option>
          <option>Recently Viewed</option>
        </select>

      </div>

      {/* ================= COUNT ================= */}
      <div className="mb-5">

        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-800">
            {favoriteImages.length}
          </span>{" "}
          saved images
        </p>

      </div>

      {/* ================= IMAGE GRID ================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {favoriteImages.map((item) => (

          <div
            key={item.id}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >

            {/* IMAGE */}
            <div className="relative aspect-square overflow-hidden">

              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />

              {/* FAVORITE */}
              <button
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur"
                title="Remove from favorites"
              >
                <Heart
                  size={18}
                  className="fill-red-500 text-red-500"
                />
              </button>

            </div>

            {/* CARD CONTENT */}
            <div className="p-4">

              <div className="mb-3 flex items-start justify-between">

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {item.creator}
                  </p>
                </div>

                <button className="text-gray-400 hover:text-gray-700">
                  <MoreVertical size={18} />
                </button>

              </div>

              {/* CARD FOOTER */}
              <div className="flex items-center justify-between border-t pt-3">

                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Heart
                    size={15}
                    className="fill-red-500 text-red-500"
                  />
                  {item.likes}
                </div>

                <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  <Download size={16} />
                  Download
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Favorites;