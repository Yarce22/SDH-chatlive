import { Router } from "express";
import { getUsersController, postUsersController } from "../controllers/usersController.js";

const router = Router();

router.get("/", getUsersController);
router.post("/", postUsersController);
  
export default router;
