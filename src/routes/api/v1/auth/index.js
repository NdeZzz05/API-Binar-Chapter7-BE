var express = require("express");
var router = express.Router();
const AUTH_CONTROLLER = require("../../../../controllers/auth.controller");
const passport = require("../../../../libs/passport");
const { restrict } = require("../../../../middleware/authentication.middleware");

router.post("/register", AUTH_CONTROLLER.register);
router.post("/login", AUTH_CONTROLLER.login);
router.get("/logout", AUTH_CONTROLLER.logout);
router.put("/change-password", restrict, AUTH_CONTROLLER.changePassword);
router.get("/reset-password/:email", AUTH_CONTROLLER.sendResetPassword);
router.put("/reset-password/:token", AUTH_CONTROLLER.resetPassword);
router.post("/google", AUTH_CONTROLLER.googleLoginFrontend);
router.put("/verify-otp", AUTH_CONTROLLER.verifyOTP);
router.get("/decode", restrict, AUTH_CONTROLLER.jwtDecode);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/auth/redirect", session: false }), AUTH_CONTROLLER.LoginWithGoogle);

///failure redirect route
router.get("/redirect", (req, res, next) => {
  try {
    throw new Error("failed to login with gmail", { cause: 401 });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
