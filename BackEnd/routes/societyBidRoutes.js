const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  placeSocietyBid,
  getProviderSocietyBids,
  getAdminSocietyBids,
  adminCounterSocietyBid,
  providerRespondSocietyBid,
  finalizeSocietyBid,
} = require("../controllers/societyBidController");

const router = express.Router();
router.post("/", auth, placeSocietyBid);
router.get("/provider", auth, getProviderSocietyBids);
router.get("/admin", auth, getAdminSocietyBids);
router.put("/:bidId/admin-counter", auth, adminCounterSocietyBid);
router.put("/:bidId/provider-response", auth, providerRespondSocietyBid);
router.put("/:bidId/finalize", auth, finalizeSocietyBid);

module.exports = router;
