const {Router} = require("express");
const messengerController = require("../controllers/messengerController");
const  {requireAuth} = require("../middleware/authMiddleware")
const multer = require("multer");
const upload = multer({ dest: "profilePictures/" });

const router = Router();


router.get("/api/getContacts/:id/:socketId",requireAuth, messengerController.getContacts)
router.get("/api/getMessages/:id",requireAuth ,messengerController.getMessages)
router.get("/api/getProfilePicture/:id" ,messengerController.getProfilePicture)

router.post("/api/addContact",requireAuth, messengerController.addContact)
router.post("/api/changeProfilePicture",requireAuth, upload.single("file"), messengerController.changeProfilePicture)

router.put("/api/sendMessage",requireAuth,messengerController.sendMessage)

router.delete("/api/removeContact/:id",requireAuth, messengerController.removeContact)



module.exports = router;