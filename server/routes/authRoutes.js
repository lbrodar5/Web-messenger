const {Router} = require("express");

const authController = require("../controllers/authController")

const router = Router();

router.post("/api/signup",authController.signUp)
router.post("/api/login", authController.login)

module.exports = router;