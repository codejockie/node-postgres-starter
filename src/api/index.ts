import { Router } from "express";

import user from "./user";
import session from "./session";

const router = Router();


router.use("/api/users", user);
router.use("/api/sessions", session);

export default router;
