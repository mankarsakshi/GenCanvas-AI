import { body, validationResult } from "express-validator";

// Middleware to handle validation error responses
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: errorDetails[0]?.message || "Validation failed",
      errors: errorDetails,
    });
  }
  next();
};

// Validation rules for User Registration
export const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

// Validation rules for User Login
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Validation rules for Profile Update
export const validateProfileUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),
  body("username")
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage("Username cannot exceed 30 characters"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Bio cannot exceed 300 characters"),
  handleValidationErrors,
];

// Validation rules for Settings Update
export const validateSettingsUpdate = [
  body("theme")
    .optional()
    .isIn(["Light", "Dark", "System"])
    .withMessage("Theme must be Light, Dark, or System"),
  body("quality")
    .optional()
    .isIn(["Standard", "High", "Ultra"])
    .withMessage("Quality must be Standard, High, or Ultra"),
  body("aspectRatio")
    .optional()
    .isIn(["1:1", "16:9", "9:16", "4:3"])
    .withMessage("Aspect ratio must be 1:1, 16:9, 9:16, or 4:3"),
  handleValidationErrors,
];

// Validation rules for AI Image Generation
export const validateGeneration = [
  body("prompt")
    .trim()
    .notEmpty()
    .withMessage("Prompt description is required")
    .isLength({ min: 2, max: 1000 })
    .withMessage("Prompt must be between 2 and 1000 characters"),
  body("width")
    .optional()
    .isInt({ min: 128, max: 1024 })
    .withMessage("Width must be an integer between 128 and 1024"),
  body("height")
    .optional()
    .isInt({ min: 128, max: 1024 })
    .withMessage("Height must be an integer between 128 and 1024"),
  handleValidationErrors,
];

// Validation rules for Creating a Shared Community Post
export const validateCreatePost = [
  body("prompt")
    .trim()
    .notEmpty()
    .withMessage("Prompt is required")
    .isLength({ min: 2, max: 1000 })
    .withMessage("Prompt must be between 2 and 1000 characters"),
  body("photo")
    .trim()
    .notEmpty()
    .withMessage("Photo image URL or data is required"),
  handleValidationErrors,
];

// Validation rules for Adding to History
export const validateCreateHistory = [
  body("prompt")
    .trim()
    .notEmpty()
    .withMessage("Prompt is required"),
  body("photo")
    .trim()
    .notEmpty()
    .withMessage("Photo image data is required"),
  handleValidationErrors,
];

// Validation rules for Favorites
export const validateFavorite = [
  body("photo")
    .trim()
    .notEmpty()
    .withMessage("Photo image data is required"),
  handleValidationErrors,
];
