function errorHandler(err, req, res, next) {
  // Log the error stack trace to the console
  console.error(err.stack);

  // Respond with a detailed error message
  res.status(500).json({
    error: {
      message: err.message,
      stack: err.stack, // Include the stack trace for debugging
    },
  });
}

module.exports = errorHandler;
