import { Request } from "express";

export type CRequest = Request & {
  session?: { id: string | null };
  userId?: string;
};
