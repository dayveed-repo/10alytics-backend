function validateFields(requiredFields, allowMissedField) {
  return (req, res, next) => {
    const errors = [];

    requiredFields.forEach((field) => {
      if (allowMissedField && !(field in req.body)) {
      } else {
        if (
          req.body[field] === undefined ||
          req.body[field] === null ||
          req.body[field].toString().trim() === ""
        ) {
          errors.push(`${field} is required`);
        }

        if (field?.toLowerCase().includes("email")) {
          let value = req.body[field];
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (!emailRegex) errors.push(`${field} is not valid`);
        }

        if (
          field?.toLowerCase()?.includes("password") &&
          req.body[field]?.length < 6
        ) {
          errors.push(`${field} must be at least 6 characters long`);
        }
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    next();
  };
}

export default validateFields;
