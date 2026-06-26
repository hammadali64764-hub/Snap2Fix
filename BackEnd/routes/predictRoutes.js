const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const predictionController = require("../controllers/predictionController");

router.post(
  "/predict",
  upload.single("image"),
  predictionController.predictImage
);

module.exports = router;