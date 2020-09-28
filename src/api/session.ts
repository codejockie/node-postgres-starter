import * as bcrypt from "bcrypt";
import { Router } from "express";

import User from "../data/users";
import Session from "../data/sessions";
import { CRequest } from "@/types/request";
import sessionMiddleware from "../middleware/session-middleware";

const router = Router();

router.post("/", async (request: CRequest, response) => {
  try {
    const { email, password } = request.body;
    const user = await User.find(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return response.status(403).json({});
    }

    const sessionId = await Session.create(user.id);
    if (request.session) {
      request.session.id = sessionId;
    }
    response.status(201).json();
  } catch (error) {
    console.error(
      `POST session ({ email: ${request.body.email} }) >> ${error.stack})`
    );
    response.status(500).json();
  }
});

router.get("/", sessionMiddleware, (request: CRequest, response) => {
  response.json({ userId: request.userId });
});

router.delete("/", async (request: CRequest, response) => {
  try {
    if (request.session?.id) {
      await Session.delete(request.session.id);
      request.session.id = null;
    }

    response.status(200).json();
  } catch (error) {
    console.error(`DELETE session >> ${error.stack}`);
    response.status(500).json();
  }
});

export default router;
