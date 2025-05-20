import { Router } from "express";
import registerCoordinatorsController from "../controllers/registerCoordinatorsController.js";

const router = Router();

// Ruta para registrar coordinadores
router.post("/", registerCoordinatorsController.register);

export default router;