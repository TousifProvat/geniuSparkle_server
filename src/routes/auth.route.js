const express = require("express");
const { requireSignin } = require("../common-middleware");
const {
  signup,
  signin,
  verifyUser,
  sendVerifyUserMail,
} = require("../controller/auth.controller");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/verification/send", requireSignin, sendVerifyUserMail);
router.get("/verification/:token", verifyUser);

module.exports = router;
