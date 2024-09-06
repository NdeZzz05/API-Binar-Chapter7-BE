const { BadRequest } = require("../errors/customsErrors");
const AUTH_SERVICE = require("../services/auth.service");
const AUTH_VALIDATION = require("../validation/auth.validation");

const AUTH_CONTROLLER = {
  register: async (req, res, next) => {
    try {
      const { error, value } = AUTH_VALIDATION.register(req.body);
      if (error) throw new BadRequest(error.details[0].message);

      const result = await AUTH_SERVICE.register(value);
      res.status(201).json({
        success: true,
        message: "Successfully get regis",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const data = {
        headers: req.headers,
        body: req.body,
      };

      const result = await AUTH_SERVICE.login(data);

      res
        .cookie("accessToken", result.accessToken, { httpOnly: true, maxAge: 3600000 * 24 * 7, secure: true, sameSite: "Strict" })
        .cookie("refreshToken", result.refreshToken, { httpOnly: true, maxAge: 3600000 * 24 * 7, secure: true, sameSite: "Strict" })
        .status(200)
        .json({
          success: true,
          message: result.message,
          data: result.data,
        });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      res
        .cookie("accessToken", "", { httpOnly: true, maxAge: 0, secure: true, sameSite: "Strict" }) // Menghapus accessToken
        .cookie("refreshToken", "", { httpOnly: true, maxAge: 0, secure: true, sameSite: "Strict" }) // Menghapus refreshToken
        .status(200)
        .json({
          success: true,
          message: "Logged out successfully",
          data: null,
        });
    } catch (error) {
      next(error);
    }
  },

  verifyOTP: async (req, res, next) => {
    try {
      const data = {
        headers: req.headers,
        body: req.body,
      };

      const result = await AUTH_SERVICE.verifyOTP(data);

      res
        .cookie("accessToken", result.accessToken, { httpOnly: true, maxAge: 3600000 * 24 * 7, secure: true, sameSite: "Strict" })
        .cookie("refreshToken", result.refreshToken, { httpOnly: true, maxAge: 3600000 * 24 * 7, secure: true, sameSite: "Strict" })
        .status(200)
        .json({
          success: true,
          message: "Successfully",
          data: result,
        });
    } catch (error) {
      next(error);
    }
  },
  googleLoginFrontend: async (req, res, next) => {
    try {
      const result = await AUTH_SERVICE.googleLoginFrontend(req.body);

      res
        .cookie("accessToken", result.accessToken, { httpOnly: true, maxAge: 3600000 * 24 * 7, secure: true, sameSite: "Strict" })
        .cookie("refreshToken", result.refreshToken, { httpOnly: true, maxAge: 3600000 * 24 * 7, secure: true, sameSite: "Strict" })
        .status(200)
        .json({
          success: true,
          message: "Successfully login with google",
          data: result,
        });
    } catch (error) {
      next(error);
    }
  },
  LoginWithGoogle: async (req, res, next) => {
    try {
      res.redirect("http://localhost:5173");
    } catch (error) {
      next(err);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      const { error, value } = AUTH_VALIDATION.changePassword(req.body);
      if (error) throw new BadRequest(error.details[0].message);

      const data = {
        value,
        user: req.user,
      };

      const result = await AUTH_SERVICE.changePassword(data);

      res.status(200).json({
        success: true,
        message: "Successfully change password",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  sendResetPassword: async (req, res, next) => {
    try {
      const result = await AUTH_SERVICE.sendResetPassword(req.params);

      res.status(200).json({
        success: true,
        message: "Successfully send email reset password",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const { token } = req.params;

      const { error, value } = AUTH_VALIDATION.resetPassword(req.body);
      if (error) throw new BadRequest(error.details[0].message);

      const result = await AUTH_SERVICE.resetPassword(value, token);
      res.status(200).json({
        success: true,
        message: "Successfully reset password",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  jwtDecode: (req, res, next) => {
    try {
      if (req.accessToken) {
        return res
          .status(200)
          .cookie("accessToken", req.accessToken, { httpOnly: true, maxAge: 3600000 * 24 * 7, sameSite: "Strict", secure: true })
          .json({
            success: true,
            message: "verifikasi token sukses",
            data: req.user,
          });
      }

      return res.status(200).json({
        success: true,
        message: "verifikasi token sukses",
        data: req.user,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AUTH_CONTROLLER;
