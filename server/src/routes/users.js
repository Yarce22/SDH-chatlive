import { Router } from "express";
import { getUsersController, postUserController, deleteUserController } from "../controllers/usersController.js";

const router = Router();

router.get("/", getUsersController);
router.post("/", postUserController);
router.delete("/:name", deleteUserController);
  
export default router;
