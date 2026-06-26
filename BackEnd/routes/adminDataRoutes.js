const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  getSocietyComplaints,
  getAuthorityComplaints,
  getSocietyProviders,
  getSocietyBids,
  getSocietyPayments,
  updatePaymentStatus,
  getResolvedFeedback,
} = require("../controllers/adminDataController");

const router = express.Router();

router.get("/complaints", auth, getSocietyComplaints);
router.get("/authority-complaints", auth, getAuthorityComplaints);
router.get("/providers", auth, getSocietyProviders);
router.get("/bids", auth, getSocietyBids);
router.get("/payments", auth, getSocietyPayments);
router.put("/payments/:id", auth, updatePaymentStatus);
router.get("/feedback", auth, getResolvedFeedback);

module.exports = router;
