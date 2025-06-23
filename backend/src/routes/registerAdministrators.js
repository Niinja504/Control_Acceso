import express from "express";
import registerAdministratorsController from "../controllers/registerAdministratorsController.js";
import multer from "multer";

const router = express.Router();

const upload = multer({dest: "administrators/"})

router.route("/")
.post(upload.single("photo"), registerAdministratorsController.register);

export default router;