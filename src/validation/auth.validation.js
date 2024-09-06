const JOI = require("joi");

const AUTH_VALIDATION = {
  register: (payload) => {
    const schema = JOI.object({
      email: JOI.string().email().required().messages({ "any.required": "Email is required" }),
      username: JOI.string().min(3).max(30).required().messages({ "any.required": "Username is required" }),
      password: JOI.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#\\$%\\^&\\*])")).required().messages({
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
      passwordConfirm: JOI.string().required().valid(JOI.ref("password")).messages({
        "any.only": "Password confirmation does not match the password",
        "any.required": "Password confirmation is required",
      }),
    });
    return schema.validate(payload);
  },
  changePassword: (payload) => {
    const schema = JOI.object({
      oldPassword: JOI.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#\\$%\\^&\\*])")).required().messages({
        "string.pattern.base": "Old Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
      newPassword: JOI.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#\\$%\\^&\\*])")).required().messages({
        "string.pattern.base": "New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
      newPasswordConfirm: JOI.string().required().valid(JOI.ref("newPassword")).messages({
        "any.only": "New Password confirmation does not match the new password",
        "any.required": "New Password confirmation is required",
      }),
    });
    return schema.validate(payload);
  },
  resetPassword: (payload) => {
    const schema = JOI.object({
      password: JOI.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#\\$%\\^&\\*])")).required().messages({
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
      passwordConfirm: JOI.string().required().valid(JOI.ref("password")).messages({
        "any.only": "Password confirmation does not match the password",
        "any.required": "Password confirmation is required",
      }),
    });
    return schema.validate(payload);
  },
};

module.exports = AUTH_VALIDATION;
