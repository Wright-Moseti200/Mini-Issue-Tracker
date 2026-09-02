const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
    });
  }
  next();
};

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  handleValidation,
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  handleValidation,
];

const createIssueValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),
  body("description")
    .optional({ values: "falsy" })
    .trim(),
  body("priority")
    .optional({ values: "falsy" })
    .trim()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
  body("status")
    .optional({ values: "falsy" })
    .trim()
    .isIn(["open", "in_progress", "closed"])
    .withMessage("Status must be open, in_progress, or closed"),
  handleValidation,
];

module.exports = {
  registerValidation,
  loginValidation,
  createIssueValidation,
};
