const express = require("express");
const cors = require("cors");
const {
  analyzeCustomerFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();
router.use(cors());

router.post("/analyzeFeedback", analyzeCustomerFeedback);

module.exports = router;
