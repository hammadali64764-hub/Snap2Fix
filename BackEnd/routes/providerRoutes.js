const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  registerProvider,
  verifyProviderOtp,
  loginProvider,
  getProviderProfile,
  updateProviderProfile,
  getProviderRequests,
  approveProvider,
  declineProvider,
} = require("../controllers/providerController");

router.post("/register", registerProvider);
router.post("/verify-otp", verifyProviderOtp);
router.post("/login", loginProvider);
router.get("/:id/profile", auth , getProviderProfile);
router.put("/:id/profile", auth ,updateProviderProfile);


module.exports = router;
