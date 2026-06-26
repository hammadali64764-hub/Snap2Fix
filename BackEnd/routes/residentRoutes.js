const router = require("express").Router();
const {
  registerResident,
  verifyResidentOtp,
  loginResident,
  approveResident,
  declineResident,
  getResidentProfile,
  updateResidentProfile,
} = require("../controllers/residentController");

router.post("/register", registerResident);
router.post("/verify-otp", verifyResidentOtp);
router.post("/login", loginResident);
router.get("/:id/profile", getResidentProfile);
router.put("/:id/profile", updateResidentProfile);

module.exports = router;
