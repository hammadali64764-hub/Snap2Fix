const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createFeedback,
  getProviderFeedback,
  getAllFeedback,
} = require("../controllers/feedbackController");

router.post("/", auth, createFeedback);
router.get("/provider", auth, getProviderFeedback);
router.get("/all", getAllFeedback);

module.exports = router;
