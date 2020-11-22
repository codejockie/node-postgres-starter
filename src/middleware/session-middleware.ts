import { NextFunction, Response } from "express";
import Session from "@/data/sessions";
import { CRequest } from "@/types/request";

const sessionMiddleware = async (request: CRequest, response: Response, next: NextFunction) => {
  if (!request.session?.id) {
    return response.sendStatus(401);
  }

  try {
    const session = await Session.find(request.session.id);
    if (!session) {
      request.session.id = null;
      return response.sendStatus(401);
    }

    request.userId = session.userId;
    next();
  } catch (error) {
    console.error(
      `SessionMiddleware(${request.session.id}) >> Error: ${error.stack}`
    );
    return response.sendStatus(500);
  }
};

export default sessionMiddleware;
