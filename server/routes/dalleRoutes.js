import express from "express";
import axios from "axios";
import { generationRateLimiter } from "../middleware/rateLimiter.js";
import { validateGeneration } from "../middleware/validate.js";

const router = express.Router();

// Apply rate limiting to image generation routes
router.use(generationRateLimiter);

// Provider info endpoint
router.get("/", (req, res) => {
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  res.json({
    success: true,
    engine: "Pollinations AI (Flux) + OpenAI DALL-E Engine",
    defaultProvider: "Pollinations AI",
    openAIConfigured: hasOpenAI,
    message: "AI Image Generation API is active and ready.",
  });
});

// Generate Image Route
router.post("/", validateGeneration, async (req, res) => {
  try {
    const { prompt, width = 512, height = 512, model = "flux", provider = "pollinations" } = req.body;

    const trimmedPrompt = prompt.trim();

    // Clamp dimensions
    const validWidth = Math.min(Math.max(parseInt(width, 10) || 512, 256), 1024);
    const validHeight = Math.min(Math.max(parseInt(height, 10) || 512, 256), 1024);

    // Option 1: OpenAI DALL-E (if explicitly requested and key exists)
    if (provider === "openai" && process.env.OPENAI_API_KEY) {
      try {
        const openAIRes = await axios.post(
          "https://api.openai.com/v1/images/generations",
          {
            prompt: trimmedPrompt,
            n: 1,
            size: `${validWidth}x${validHeight}`,
            response_format: "b64_json",
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            timeout: 60000,
          }
        );

        const b64 = openAIRes.data?.data?.[0]?.b64_json;
        if (b64) {
          return res.status(200).json({
            success: true,
            photo: `data:image/png;base64,${b64}`,
            provider: "OpenAI DALL-E",
            width: validWidth,
            height: validHeight,
            prompt: trimmedPrompt,
          });
        }
      } catch (openAIErr) {
        console.warn("OpenAI generation fallback to Pollinations AI:", openAIErr.message);
      }
    }

    // Option 2: Pollinations AI (High-speed, free, Flux engine)
    const seed = Math.floor(Math.random() * 2147483647);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      trimmedPrompt
    )}?width=${validWidth}&height=${validHeight}&seed=${seed}&nologo=true&model=${encodeURIComponent(
      model
    )}`;

    console.log(`[AI Engine] Generating image | Model: ${model} | Dimensions: ${validWidth}x${validHeight}`);

    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 75000,
    });

    const base64Image = Buffer.from(response.data).toString("base64");
    const mimeType = response.headers["content-type"] || "image/png";

    return res.status(200).json({
      success: true,
      photo: `data:${mimeType};base64,${base64Image}`,
      provider: "Pollinations AI (Flux)",
      seed,
      width: validWidth,
      height: validHeight,
      prompt: trimmedPrompt,
    });
  } catch (error) {
    console.error("========== IMAGE GENERATION ERROR ==========");
    console.error("Message:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
    }
    console.error("============================================");

    return res.status(500).json({
      success: false,
      message: "Unable to generate image at this moment. Please try a different prompt or retry in a few seconds.",
    });
  }
});

export default router;