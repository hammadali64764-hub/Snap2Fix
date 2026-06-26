const express = require("express");
const router = express.Router();

const {
  loginAdmin,
  getPendingRequests,
  approveSociety,
  rejectSociety,
  getRegisteredSocieties,
} = require("../controllers/administratorController");

router.get("/requests", getPendingRequests);
router.post("/approve/:id", approveSociety);
router.get("/societies", getRegisteredSocieties);

router.post("/reject/:id", rejectSociety);
router.post("/login" , loginAdmin)
module.exports = router;
