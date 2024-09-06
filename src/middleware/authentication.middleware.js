const { JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY } = process.env;
const { UnauthorizedError } = require("../errors/customsErrors");
const { decodeToken, signToken } = require("../utils/authUtils");

module.exports = {
  restrict: async (req, res, next) => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) throw new UnauthorizedError("Unauthorized");
      const user = await decodeToken(accessToken, JWT_SECRET_KEY);
      req.user = user;
      next();
    } catch (err) {
      const refreshToken = req.cookies.refreshToken;

      try {
        if (!refreshToken) throw new UnauthorizedError("Unauthorized");

        const userData = await decodeToken(refreshToken, JWT_REFRESH_SECRET_KEY);
        const userConstruct = {
          id: userData.id,
          email: userData.email,
          username: userData.username,
        };
        const accessToken = await signToken("access", userConstruct, JWT_SECRET_KEY);
        req.user = userConstruct;

        res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 3600000 * 24 * 7, sameSite: "Strict", secure: true });
        next();
      } catch (err) {
        next(err);
      }
    }
  },
};
