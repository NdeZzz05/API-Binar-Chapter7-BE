const prisma = require("../config/prisma");

const AUTH_MODELS = {
  checkEmail: async (email) => {
    const result = await prisma.user.findFirst({
      where: { email },
      include: {
        otp: true,
      },
    });
    return result;
  },

  checkUsername: async (username) => {
    const result = await prisma.user.findFirst({ where: { username } });
    return result;
  },

  register: async (data) => {
    const { username, email, password } = data;

    const result = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });
    return result;
  },

  sendOTP: async (data) => {
    const result = await prisma.otp.upsert({
      where: {
        authorId: data.id,
      },
      update: {
        otp: data.otp,
        expiration: new Date(new Date().getTime() + 10 * 60000),
      },
      create: {
        otp: data.otp,
        expiration: new Date(new Date().getTime() + 10 * 60000),
        authorId: data.id,
      },
    });

    return result;
  },

  updateUserAgent: async (data) => {
    const result = await prisma.user.update({
      where: { email: data.email },
      data: { userAgent: data.userAgent },
    });

    return result;
  },

  googleLoginFrontend: async (data) => {
    const result = await prisma.user.upsert({
      where: {
        email: data.email,
      },
      update: {
        googleId: data.sub,
        username: data.given_name,
      },
      create: {
        email: data.email,
        googleId: data.sub,
        username: data.given_name,
      },
    });

    return result;
  },
  updatePassword: async (data) => {
    const { email, password } = data;

    const result = await prisma.user.update({
      where: { email },
      data: { password },
    });
    return result;
  },
};

module.exports = AUTH_MODELS;
