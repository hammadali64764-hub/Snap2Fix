const express = require("express");
const router = express.Router();

const {
  registerSociety,
  loginSociety,
  getSocietyProfile,
  updateSocietyProfile,
  getApprovedSocieties,
  verifySocietyOtp,
  
} = require("../controllers/societyController");


const {
  getProviderRequests,
  approveProvider,
  declineProvider,
} = require("../controllers/providerController");

const { 
  getResidentRequests,
approveResident,
declineResident } = require("../controllers/residentController");





const auth = require("../middleware/authMiddleware");

router.get("/:id/profile", auth, getSocietyProfile);
router.put("/:id/profile", auth, updateSocietyProfile);


router.post("/register", registerSociety);
router.post("/verify-otp", verifySocietyOtp);

router.post("/login", loginSociety);
router.get("/approved-societies", getApprovedSocieties);

router.get("/provider-requests/:societyId",getProviderRequests);

router.post("/provider-approve/:id",approveProvider);

router.post( "/provider-decline/:id", declineProvider);

router.get("/resident-requests/:societyId", getResidentRequests);
router.post("/approve-resident/:id", approveResident);
router.post("/decline-resident/:id", declineResident);



module.exports = router;
