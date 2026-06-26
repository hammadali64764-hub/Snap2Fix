const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getMyNotifications,
  markNotificationRead,
} = require("../controllers/notificationController");

router.get("/", auth, getMyNotifications);
router.put("/:id/read", auth, markNotificationRead);

module.exports = router;
