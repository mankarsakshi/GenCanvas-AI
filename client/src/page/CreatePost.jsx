import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sparkles,
  Wand2,
  Download,
  Share2,
  Copy,
  Check,
  Maximize2,
  Heart,
  RotateCw,
  Image as ImageIcon,
  Layers,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  getRandomPrompt,
  downloadImage,
  getUserHistory,
  setUserHistory,
  getUserGallery,
  setUserGallery,
  getUserFavorites,
  setUserFavorites,
  getUserId,
} from "../utils";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import "./CreatePost.css";

const STYLE_PRESETS = [
  { id: "digital-art", label: "Digital Art", suffix: ", digital art, vibrant colors, 8k trending on artstation" },
  { id: "cyberpunk", label: "Cyberpunk", suffix: ", cyberpunk aesthetic, neon lighting, highly detailed, futuristic city" },
  { id: "3d-render", label: "3D Render", suffix: ", 3d render, octane render, smooth cinematic lighting, blender 3d" },
  { id: "photorealistic", label: "Photorealistic", suffix: ", photorealistic, 50mm lens photography, 8k ultra high resolution, award winning" },
  { id: "anime", label: "Anime / Manga", suffix: ", anime aesthetic, Makoto Shinkai style, studio ghibli, beautiful scenery" },
  { id: "fantasy", label: "Fantasy Realm", suffix: ", epic fantasy world, magical glow, ethereal lighting, concept art" },
  { id: "cinematic", label: "Cinematic", suffix: ", cinematic movie shot, dramatic lighting, anamorphic lens, masterpiece" },
  { id: "oil-painting", label: "Oil Painting", suffix: ", textured oil painting, impressionism, thick brush strokes, artistic masterpiece" },
  { id: "vaporwave", label: "Vaporwave", suffix: ", 80s vaporwave aesthetic, pastel gradients, synthwave retro grid" },
];

const ASPECT_RATIOS = [
  { id: "1:1", label: "1:1 Square", width: 512, height: 512, iconClass: "ratio-icon-1-1" },
  { id: "16:9", label: "16:9 Wide", width: 768, height: 432, iconClass: "ratio-icon-16-9" },
  { id: "9:16", label: "9:16 Story", width: 432, height: 768, iconClass: "ratio-icon-9-16" },
  { id: "4:3", label: "4:3 Classic", width: 640, height: 480, iconClass: "ratio-icon-4-3" },
];

const INSPIRATIONAL_QUOTES = [
  "Synthesizing creative latent dimensions...",
  "Painting high-definition textures & lighting...",
  "Applying compositional harmonies...",
  "Rendering final artistic details...",
];

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0]);
  const [generatingImg, setGeneratingImg] = useState(false);
  const [sharing, setSharing] = useState(false);

  const [currentImage, setCurrentImage] = useState(null);
  const [recentCreations, setRecentCreations] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Load prompt / style / ratio from navigation state (e.g. Regenerate from History)
  useEffect(() => {
    if (location.state?.prompt) {
      setPrompt(location.state.prompt);
      if (location.state.style) {
        const foundStyle = STYLE_PRESETS.find(
          (s) => s.label.toLowerCase() === location.state.style.toLowerCase() || s.id === location.state.style
        );
        if (foundStyle) setSelectedStyle(foundStyle.id);
      }
      if (location.state.ratio) {
        const foundRatio = ASPECT_RATIOS.find((r) => r.id === location.state.ratio);
        if (foundRatio) setSelectedRatio(foundRatio);
      }
      setStatusMsg({
        type: "success",
        text: "Loaded prompt from History! Ready to generate or refine.",
      });
    }
  }, [location.state]);

  // Rotate quotes during generation
  useEffect(() => {
    let interval;
    if (generatingImg) {
      interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length);
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [generatingImg]);

  // Load existing user-scoped session history on mount or user change
  useEffect(() => {
    try {
      const userHistory = getUserHistory(user);
      if (Array.isArray(userHistory) && userHistory.length > 0) {
        setRecentCreations(userHistory.slice(0, 10));
        if (!location.state?.prompt) {
          setCurrentImage(userHistory[0]);
        }
      } else {
        setRecentCreations([]);
        if (!location.state?.prompt) {
          setCurrentImage(null);
        }
      }
    } catch (e) {
      console.warn("Could not load user history", e);
    }
  }, [user, location.state]);

  const handleSurpriseMe = () => {
    const random = getRandomPrompt(prompt);
    setPrompt(random);
    setSelectedStyle("");
    setStatusMsg({ type: "", text: "" });
  };

  const handleStyleToggle = (style) => {
    if (selectedStyle === style.id) {
      setSelectedStyle("");
    } else {
      setSelectedStyle(style.id);
    }
  };

  const buildFullPrompt = () => {
    let full = prompt.trim();
    if (!full) return "";
    if (selectedStyle) {
      const styleObj = STYLE_PRESETS.find((s) => s.id === selectedStyle);
      if (styleObj && !full.toLowerCase().includes(styleObj.label.toLowerCase())) {
        full += styleObj.suffix;
      }
    }
    return full;
  };

  // Generate Image Handler
  const handleGenerate = async () => {
    const finalPrompt = buildFullPrompt();
    if (!finalPrompt) {
      setStatusMsg({ type: "error", text: "Please enter a descriptive prompt first." });
      return;
    }

    try {
      setGeneratingImg(true);
      setStatusMsg({ type: "", text: "" });
      setIsFavorited(false);

      const response = await fetch("http://localhost:8080/api/v1/dalle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: finalPrompt,
          width: selectedRatio.width,
          height: selectedRatio.height,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.photo) {
        throw new Error(data.message || "Server was unable to generate the image");
      }

      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const currentUid = getUserId(user);

      const newCreation = {
        _id: Date.now().toString(),
        id: Date.now().toString(),
        userId: currentUid,
        prompt: finalPrompt,
        photo: data.photo,
        image: data.photo,
        name: user?.name || "GenCanvas Creator",
        author: user?.name || "GenCanvas Creator",
        ratio: selectedRatio.id,
        style: selectedStyle ? STYLE_PRESETS.find(s => s.id === selectedStyle)?.label : "Digital Art",
        likes: 0,
        createdAt: now.toISOString(),
        time: timeString,
        date: "Today",
      };

      setCurrentImage(newCreation);

      // Save to user-scoped generation history
      try {
        const existingHistory = getUserHistory(user);
        const updatedHistory = [newCreation, ...existingHistory.filter((p) => (p.photo || p.image) !== newCreation.photo)].slice(0, 100);
        setUserHistory(user, updatedHistory);
        setRecentCreations(updatedHistory.slice(0, 10));
      } catch (storageErr) {
        console.warn("User history storage warning:", storageErr);
      }

      // Save to user-scoped gallery storage
      try {
        const existingGallery = getUserGallery(user);
        const updatedGallery = [newCreation, ...existingGallery.filter((p) => (p.photo || p.image) !== newCreation.photo)].slice(0, 100);
        setUserGallery(user, updatedGallery);
      } catch (storageErr) {
        console.warn("User gallery storage warning:", storageErr);
      }

      // Sync with MongoDB backend history API
      try {
        apiFetch("http://localhost:8080/api/v1/history", {
          method: "POST",
          body: JSON.stringify({
            prompt: finalPrompt,
            photo: data.photo,
            ratio: selectedRatio.id,
            style: selectedStyle ? STYLE_PRESETS.find(s => s.id === selectedStyle)?.label : "Digital Art",
            time: timeString,
            date: "Today",
          }),
        }).catch(err => console.warn("Backend history auto-save notice:", err.message));
      } catch (err) {
        console.warn("History auto-save notice:", err);
      }

      // Automatically store in MongoDB post database in the background
      try {
        apiFetch("http://localhost:8080/api/v1/post", {
          method: "POST",
          body: JSON.stringify({
            name: user?.name || "GenCanvas Creator",
            prompt: finalPrompt,
            photo: data.photo,
            ratio: selectedRatio.id,
            style: selectedStyle ? STYLE_PRESETS.find(s => s.id === selectedStyle)?.label : "Digital Art",
          }),
        }).then(res => res.json()).then(postData => {
          if (postData?.data?._id) {
            newCreation._id = postData.data._id;
          }
        }).catch(err => console.warn("Backend auto-post notice:", err.message));
      } catch (err) {
        console.warn("Auto-post notice:", err);
      }

      setStatusMsg({
        type: "success",
        text: "✨ Artwork generated and saved directly to your personal History!",
      });
    } catch (err) {
      console.error("Image generation error:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Failed to generate image. Please try another prompt.",
      });
    } finally {
      setGeneratingImg(false);
    }
  };

  // Download Image
  const handleDownload = async () => {
    if (!currentImage?.photo) return;
    await downloadImage(currentImage.id || Date.now(), currentImage.photo);
    setStatusMsg({ type: "success", text: "Artwork downloaded successfully!" });
  };

  // Copy Prompt
  const handleCopyPrompt = () => {
    if (!currentImage?.prompt) return;
    navigator.clipboard.writeText(currentImage.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Toggle Favorite
  const handleToggleFavorite = () => {
    if (!currentImage) return;
    try {
      let favList = getUserFavorites(user);

      if (isFavorited) {
        favList = favList.filter((item) => (item.id || item._id) !== (currentImage.id || currentImage._id));
        setIsFavorited(false);
        setStatusMsg({ type: "success", text: "Removed from favorites." });
      } else {
        favList.unshift(currentImage);
        setIsFavorited(true);
        setStatusMsg({ type: "success", text: "Saved to your favorites!" });
      }
      setUserFavorites(user, favList);

      // Sync with backend using verified JWT
      apiFetch("http://localhost:8080/api/v1/favorite/toggle", {
        method: "POST",
        body: JSON.stringify({
          photo: currentImage.photo,
          prompt: currentImage.prompt,
          name: user?.name || "GenCanvas Creator",
          style: currentImage.style,
          ratio: currentImage.ratio,
        }),
      }).catch(e => console.warn("Backend fav toggle notice:", e.message));
    } catch (e) {
      console.warn("Favorite toggle failed:", e);
    }
  };

  // Share to Community
  const handleSharePost = async () => {
    if (!currentImage?.photo || !currentImage?.prompt) {
      setStatusMsg({ type: "error", text: "Please generate an image first before sharing." });
      return;
    }

    try {
      setSharing(true);
      setStatusMsg({ type: "", text: "" });

      const response = await apiFetch("http://localhost:8080/api/v1/post", {
        method: "POST",
        body: JSON.stringify({
          name: user?.name || "GenCanvas Creator",
          prompt: currentImage.prompt,
          photo: currentImage.photo,
          style: currentImage.style,
          ratio: currentImage.ratio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to share post");
      }

      setStatusMsg({
        type: "success",
        text: "Art successfully shared with the community!",
      });

      setTimeout(() => {
        navigate("/gallery");
      }, 900);
    } catch (err) {
      console.error("Share error:", err);
      setStatusMsg({
        type: "error",
        text: err.message || "Could not publish post. Please try again.",
      });
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="create-studio-container">
      {/* Header */}
      <div className="create-studio-header">
        <div className="create-badge">
          <Wand2 size={15} />
          <span>AI Creative Studio</span>
        </div>
        <h1 className="create-studio-title">Generate Art</h1>
        <p className="create-studio-subtitle">
          Transform your creative descriptions into stunning, high-resolution AI visual artwork.
        </p>
      </div>

      {/* Status Alert Banner */}
      {statusMsg.text && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.65rem",
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            marginBottom: "1.5rem",
            fontSize: "0.875rem",
            backgroundColor: statusMsg.type === "error" ? "#fef2f2" : "#f0fdf4",
            color: statusMsg.type === "error" ? "#b91c1c" : "#15803d",
            border: `1px solid ${statusMsg.type === "error" ? "#fecaca" : "#bbf7d0"}`,
          }}
        >
          {statusMsg.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="create-studio-grid">
        {/* Left Column: Creative Controls */}
        <div className="create-controls-card">
          {/* Prompt Section */}
          <div className="control-section">
            <div className="control-label-row">
              <label className="control-label">
                <Sparkles size={16} className="text-indigo-600" />
                <span>Prompt Description</span>
              </label>
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="surprise-btn"
                title="Get inspiring prompt ideas"
              >
                <Wand2 size={13} />
                <span>Surprise Me</span>
              </button>
            </div>

            <textarea
              className="prompt-textarea"
              placeholder="Describe what you want to see in detail... (e.g. A cybernetic dragon flying through a glowing crystal cave, cinematic lighting)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>

          {/* Style Presets */}
          <div className="control-section">
            <div className="control-label-row">
              <label className="control-label">
                <Layers size={16} className="text-purple-600" />
                <span>Artistic Style</span>
              </label>
            </div>
            <div className="style-chips-container">
              {STYLE_PRESETS.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleStyleToggle(style)}
                  className={`style-chip ${selectedStyle === style.id ? "active" : ""}`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="control-section">
            <div className="control-label-row">
              <label className="control-label">
                <ImageIcon size={16} className="text-blue-600" />
                <span>Aspect Ratio</span>
              </label>
            </div>
            <div className="ratio-grid">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  type="button"
                  onClick={() => setSelectedRatio(ratio)}
                  className={`ratio-card ${selectedRatio.id === ratio.id ? "active" : ""}`}
                >
                  <div className={`ratio-icon ${ratio.iconClass}`} />
                  <span className="ratio-name">{ratio.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generatingImg || !prompt.trim()}
            className="generate-btn"
          >
            {generatingImg ? (
              <>
                <Loader />
                <span>Generating Image...</span>
              </>
            ) : (
              <>
                <Sparkles size={19} />
                <span>Generate Artwork</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Canvas & Inspector */}
        <div className="create-canvas-card">
          <div className="canvas-header">
            <span className="canvas-title">
              <ImageIcon size={17} className="text-indigo-600" />
              <span>Studio Preview Canvas</span>
            </span>
            {currentImage && (
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                {currentImage.ratio} Resolution
              </span>
            )}
          </div>

          {/* Interactive Canvas Box */}
          <div className="canvas-box">
            {generatingImg && (
              <div className="generating-overlay">
                <div className="scanning-beam" />
                <Loader />
                <span className="generating-text">Creating your AI Masterpiece</span>
                <span className="generating-quote">
                  "{INSPIRATIONAL_QUOTES[quoteIndex]}"
                </span>
              </div>
            )}

            {currentImage ? (
              <img
                src={currentImage.photo}
                alt={currentImage.prompt}
                className="canvas-img"
              />
            ) : (
              <div className="canvas-placeholder">
                <div className="placeholder-icon-wrap">
                  <Sparkles size={32} />
                </div>
                <h3 className="placeholder-title">Your Canvas Awaits</h3>
                <p className="placeholder-desc">
                  Enter a creative prompt or select a style above and click <strong>Generate Artwork</strong> to bring your imagination to life.
                </p>
              </div>
            )}
          </div>

          {/* Post-Generation Action Toolbar */}
          {currentImage && (
            <>
              <div className="canvas-actions-toolbar">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="action-tool-btn"
                  title="Download full resolution image"
                >
                  <Download size={16} />
                  <span>Download</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="action-tool-btn"
                  title="Copy generation prompt"
                >
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  <span>{copied ? "Copied!" : "Copy Prompt"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className={`action-tool-btn ${isFavorited ? "active" : ""}`}
                  title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Heart size={16} className={isFavorited ? "fill-red-500" : ""} />
                  <span>{isFavorited ? "Favorited" : "Favorite"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFullscreenOpen(true)}
                  className="action-tool-btn"
                  title="View full size"
                >
                  <Maximize2 size={16} />
                  <span>Fullscreen</span>
                </button>
              </div>

              {/* Share to Community Banner */}
              <div className="share-community-card">
                <div className="share-info">
                  <h4>Showcase Your Art</h4>
                  <p>Publish to GenCanvas community gallery for other creators to discover.</p>
                </div>
                <button
                  type="button"
                  onClick={handleSharePost}
                  disabled={sharing}
                  className="share-btn"
                >
                  <Share2 size={15} />
                  <span>{sharing ? "Sharing..." : "Share to Gallery"}</span>
                </button>
              </div>
            </>
          )}

          {/* Filmstrip Recent Generations */}
          {recentCreations.length > 1 && (
            <div className="filmstrip-section">
              <div className="filmstrip-header">Recent Session Generations</div>
              <div className="filmstrip-scroll">
                {recentCreations.map((item) => (
                  <img
                    key={item.id}
                    src={item.photo}
                    alt={item.prompt}
                    onClick={() => {
                      setCurrentImage(item);
                      setIsFavorited(false);
                    }}
                    className={`filmstrip-thumb ${
                      currentImage?.id === item.id ? "active" : ""
                    }`}
                    title={item.prompt}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {fullscreenOpen && currentImage && (
        <div className="preview-modal-backdrop" onClick={() => setFullscreenOpen(false)}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setFullscreenOpen(false)}
            >
              <X size={20} />
            </button>
            <img
              src={currentImage.photo}
              alt={currentImage.prompt}
              className="preview-modal-img"
            />
            <div style={{ marginTop: "1rem", color: "#f8fafc", textAlign: "center", maxWidth: "600px" }}>
              <p style={{ fontSize: "0.95rem", margin: "0 0 0.5rem 0" }}>"{currentImage.prompt}"</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginTop: "0.75rem" }}>
                <button
                  type="button"
                  onClick={handleDownload}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.45rem 0.9rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#6366f1",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Download size={14} />
                  <span>Download Artwork</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.45rem 0.9rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Copy size={14} />
                  <span>Copy Prompt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
