const express = require("express");
// const { protect, authorize } = require("../middlewares/protect");
const router = express.Router();
// const { zoomSignature } = require("../controller/zoom.js");

router.get("/").get((req, res, next) => {
  res.send("started");
});

module.exports = router;
