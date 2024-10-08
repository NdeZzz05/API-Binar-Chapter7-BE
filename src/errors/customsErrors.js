class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = this.constructor.name;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = this.constructor.name;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = this.constructor.name;
  }
}
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = this.constructor.name;
  }
}

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
    this.name = this.constructor.name;
  }
}

module.exports = { BadRequest, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError };
