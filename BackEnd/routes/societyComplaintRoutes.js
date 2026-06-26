const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  createSocietyComplaint,
  getProviderSocietyComplaints,
  getResolvedSocietyComplaintsForProvider,
  forwardAuthorityComplaint,
  submitSocietyProof,
  markSocietyComplaintCompleted,
  markSocietyComplaintUnsatisfactory,
} = require("../controllers/societyComplaintController");

router.post("/", auth, upload.single("image"), createSocietyComplaint);
router.get("/provider", auth, getProviderSocietyComplaints);
router.get("/provider-resolved", auth, getResolvedSocietyComplaintsForProvider);
router.put("/forward-department/:id", auth, forwardAuthorityComplaint);
router.put("/proof/:id", auth, upload.single("proofImage"), submitSocietyProof);
router.put("/complete/:id", auth, markSocietyComplaintCompleted);
router.put("/unsatisfactory/:id", auth, markSocietyComplaintUnsatisfactory);

module.exports = router;
