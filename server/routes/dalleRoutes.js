import express from "express";
import axios from "axios";

const router = express.Router();


// Test route
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Pollinations AI API is working",
  });
});


// Generate Image Route
router.post("/", async (req, res) => {

  try {

    const { prompt } = req.body;


    // Validate prompt
    if (!prompt || prompt.trim() === "") {

      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });

    }



    // Pollinations accepts seed <= 2147483647
    const seed = Math.floor(
      Math.random() * 2147483647
    );



    const imageUrl =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=${seed}`;



    console.log("Generating image:", imageUrl);



    // Generate image from Pollinations AI
    const response = await axios.get(
      imageUrl,
      {
        responseType: "arraybuffer",
        timeout: 60000,
      }
    );



    console.log(
      "Content-Type:",
      response.headers["content-type"]
    );


    console.log(
      "Status:",
      response.status
    );



    // Convert image buffer to Base64
    const base64Image =
      Buffer.from(response.data).toString("base64");



    res.status(200).json({

      success: true,

      photo:
        `data:image/png;base64,${base64Image}`

    });



  } catch (error) {


    console.log("========== IMAGE ERROR ==========");



    console.log(
      "Message:",
      error.message
    );



    if (error.response) {

      console.log(
        "Status:",
        error.response.status
      );


      console.log(
        "Data:",
        Buffer.from(error.response.data).toString()
      );

    }



    console.log("===============================");



    res.status(500).json({

      success: false,

      message:
        "Unable to generate image. Please try again."

    });


  }

});


export default router;