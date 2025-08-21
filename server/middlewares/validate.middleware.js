const validate = (schema) => async (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Renote body cannot be empty.",
    });
  }

  try {
    const parsedData = await schema.parseAsync(req.body);
    req.body = parsedData;
    next();
  } catch (err) {
    console.error("Validation Errors:", {
      errors: err.errors || err.message,
      renoteBody: req.body,
    });
    const errors = err.errors
      ? err.errors.map((error) => ({
          path: error.path.join("."),
          message: error.message,
        }))
      : [{ path: "unknown", message: "An unknown validation error occurred" }];

    res.status(422).json({
      success: false,
      message: "Validation failed.  Please check your input.",
      errors,
    });
  }
};

export default validate;
