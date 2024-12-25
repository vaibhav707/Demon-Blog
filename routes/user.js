const {Router} = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signup", (req, res) => {
    return res.render("signup", {error: null});
});

router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;

    // Define a regex for a strong password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    try {
        if (!passwordRegex.test(password)) {
            return res.render("signup", {
                error: "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.",
            });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            await User.create({ fullName, email, password });
            return res.redirect("/user/signin");
        }
        return res.render("signup", {
            error: "Email already in use",
        });
    } catch (error) {
        return res.render("signup", {
            error: "An unexpected error occurred. Please try again.",
        });
    }
});


router.post("/signin", async (req, res) => {
    try{
        const { email, password } = req.body;
        const token = await User.matchPassword(email, password);
    
        return res.cookie("token",token).redirect("/");
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password",
        });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/");
})

module.exports = router;