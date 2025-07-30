import { Router } from "express";
import { getMessagesController } from "../controllers/messagesController.js";

const router = Router();

router.get("/:room", getMessagesController);
  
export default router;
