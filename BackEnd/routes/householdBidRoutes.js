const express = require("express");
const router = express.Router();
const {
  placeBid,
  acceptBid,
  getMyComplaintBids,
  getProviderBids,
  counterBid,
  respondToNegotiation,
} = require("../controllers/householdBidController");

const auth = require("../middleware/authMiddleware");

router.post("/place", auth, placeBid);
router.get("/resident-bids", auth, getMyComplaintBids);
router.get("/provider-bids", auth, getProviderBids);
router.put("/counter/:bidId", auth, counterBid);
router.put("/respond/:bidId", auth, respondToNegotiation);
router.put("/accept/:bidId", auth, acceptBid);

module.exports = router;
