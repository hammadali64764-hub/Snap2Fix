const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { trackComplaint } = require("../controllers/trackingController");

router.get("/:id", auth, trackComplaint);

module.exports = router;
