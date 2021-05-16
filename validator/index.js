
exports.userSignupValidator = (req, res, next) => {
    req.check("name", "Name is required").notEmpty();
    req.check("email", "Email is required")
        .isEmail()
        .withMessage("Email is Invalid");
    req.check("password", "Password is required").notEmpty().isLength({ min: 8 })
        .withMessage("Password must be atleast 8 characters")
        .matches(/\d/).withMessage("Password must contain a number");
    const errors = req.validationErrors();
    if (errors) {
        const validateError = errors.map(error => error.msg);
        return res.status(400).json({ error: validateError });
    }
    next();

}