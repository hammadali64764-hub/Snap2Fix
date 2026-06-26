const express = require("express");
const router = express.Router();
const {
  createHouseholdComplaint,
  markComplaintCompleted,
  getAvailableComplaintsForProvider,
  getAssignedComplaintsForProvider,
  getResolvedComplaintsForProvider,
  getResidentComplaintHistory,
  markComplaintUnsatisfactory,
  trackHouseholdComplaint,
} = require("../controllers/householdComplaintController");

const auth = require("../middleware/authMiddleware");

router.post("/create", auth, createHouseholdComplaint);
router.get("/available", auth, getAvailableComplaintsForProvider);
router.put("/complete/:id", auth, markComplaintCompleted);
router.put("/unsatisfactory/:id", auth, markComplaintUnsatisfactory);
router.get("/assigned", auth, getAssignedComplaintsForProvider);
router.get( "/provider-resolved", auth, getResolvedComplaintsForProvider);

router.get("/resident-history",auth,getResidentComplaintHistory);
router.get("/track/:id", auth, trackHouseholdComplaint);

module.exports = router;
