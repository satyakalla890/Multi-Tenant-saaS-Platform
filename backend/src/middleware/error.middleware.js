module.exports = (err, req, res, next) => {
  console.error(err);

  if (err.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "Duplicate entry detected",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
