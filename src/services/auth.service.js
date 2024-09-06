const bcrypt = require("bcrypt");
const AUTH_MODELS = require("../models/auth.models");
const { BadRequest, UnauthorizedError } = require("../errors/customsErrors");
const { resetPasswordHtml } = require("../views/resetPassword");
const sendEmailAuthConfig = require("../config/nodemailer");
const { signToken, decodeToken, generateOtp } = require("../utils/authUtils");
const { otpVerificationHtml } = require("../views/otpVerification");
const { JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY, RESET_PASSWORD_URL, JWT_RESETPASSWORD_SECRET } = process.env;

const AUTH_SERVICE = {
  register: async (data) => {
    const checkEmail = await AUTH_MODELS.checkEmail(data.email);
    const checkUsername = await AUTH_MODELS.checkUsername(data.username);

    if (checkEmail || checkUsername) {
      throw new BadRequest("Registrasi gagal, Harap coba lagi");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const result = await AUTH_MODELS.register(data);
    return result;
  },
  login: async (data) => {
    const userAgent = data.headers["user-agent"];
    const { email, password } = data.body;

    const result = await AUTH_MODELS.checkEmail(email);
    if (!result) throw new BadRequest("User tidak terdaftar");

    const isPasswordMatch = bcrypt.compareSync(password, result.password);
    if (!isPasswordMatch) throw new BadRequest("Email atau password salah");

    if (userAgent === result.userAgent) {
      const payload_token = {
        id: result.id,
        email: result.email,
        username: result.username,
      };
      const accessToken = await signToken("access", payload_token, JWT_SECRET_KEY);
      const refreshToken = await signToken("refresh", payload_token, JWT_REFRESH_SECRET_KEY);

      return {
        message: "Successfully login",
        data: payload_token,
        accessToken,
        refreshToken,
      };
    } else {
      const otp = generateOtp();

      const data = {
        id: result.id,
        otp,
      };

      await AUTH_MODELS.sendOTP(data);
      const html = otpVerificationHtml(otp);
      await sendEmailAuthConfig(result.email, "OTP Verification", html);

      await AUTH_MODELS.sendOTP(data);

      return {
        message: "OTP sent successfully to Email",
        data: {
          isNeedOTP: true,
        },
      };
    }
  },

  verifyOTP: async (data) => {
    const { email, OTP } = data.body;

    const result = await AUTH_MODELS.checkEmail(email);
    if (!result) throw new BadRequest("User tidak terdaftar");

    if (OTP !== result.otp.otp) throw new UnauthorizedError("OTP is not matching");
    if (result.otp.expiration < new Date()) throw new UnauthorizedError("Expiration OTP");

    const userAgent = data.headers["user-agent"];
    const dataUserAgent = {
      email: result.email,
      userAgent,
    };
    await AUTH_MODELS.updateUserAgent(dataUserAgent);

    const payload_token = {
      id: result.id,
      email: result.email,
      username: result.username,
    };

    const accessToken = await signToken("access", payload_token, JWT_SECRET_KEY);
    const refreshToken = await signToken("refresh", payload_token, JWT_REFRESH_SECRET_KEY);

    return {
      user: payload_token,
      accessToken,
      refreshToken,
    };
  },
  googleLoginFrontend: async (data) => {
    console.log(data);
    const result = await AUTH_MODELS.googleLoginFrontend(data);
    console.log(result);

    const userConstruct = {
      id: result.id,
      email: result.email,
      username: result.username,
    };

    const accessToken = await signToken("access", userConstruct, JWT_SECRET_KEY);
    const refreshToken = await signToken("refresh", userConstruct, JWT_REFRESH_SECRET_KEY);

    return { userConstruct, accessToken, refreshToken };
  },

  changePassword: async (data) => {
    const { oldPassword, newPassword } = data.value;
    const { email } = data.user;

    const checkUser = await AUTH_MODELS.checkEmail(email);
    if (!checkUser) throw new BadRequest("User tidak terdaftar");

    const isPasswordMatch = bcrypt.compareSync(oldPassword, checkUser.password);
    if (!isPasswordMatch) throw new UnauthorizedError("Password lama salah");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    data.password = hashedPassword;

    const datas = {
      email,
      password: hashedPassword,
    };

    const result = await AUTH_MODELS.updatePassword(datas);

    return result;
  },
  sendResetPassword: async (data) => {
    const checkUser = await AUTH_MODELS.checkEmail(data.email);
    if (!checkUser) throw new BadRequest("User tidak terdaftar");

    const token = await signToken("resetPassword", { email: checkUser.email }, JWT_SECRET_KEY);
    const html = resetPasswordHtml(token, RESET_PASSWORD_URL);
    await sendEmailAuthConfig(checkUser.email, "Reset Your Password", html);

    return token;
  },
  resetPassword: async (data, token) => {
    const decode = await decodeToken(token, JWT_SECRET_KEY);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const datas = {
      email: decode.email,
      password: hashedPassword,
    };

    const result = await AUTH_MODELS.updatePassword(datas);

    return result;
  },
};

module.exports = AUTH_SERVICE;
