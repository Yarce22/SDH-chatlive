import { Router } from "express";
import users from "./users.js";
import messages from "./messages.js";

const router = Router();

router.use("/users", users);
router.use("/messages", messages);

export default router;
