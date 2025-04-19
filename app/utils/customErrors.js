module.exports = {
  NotFoundError: (resource, id) => ({
    status: 404,
    message: `${resource} with ID ${id} not found.`,
  }),

  DuplicateUserError: (userId) => ({
    status: 400,
    message: `User ${userId} is already registered!`,
  }),

  AlreadyVerifiedError: (userId) => ({
    status: 400,
    message: `User ${userId} is already verified!`,
  }),

  InternalServerError: (err) => ({
    status: 500,
    message: "Internal server error.",
    details: err.message || "Unknown error",
  }),

  UnsupportedRoleError: () => ({
    status: 400,
    message: "Unsupported roleId",
  }),
};
