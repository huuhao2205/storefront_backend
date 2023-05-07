import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();
const { TOKEN_SECRET } = process.env;

export const createAuthToken = (username: string): string => {
  return jwt.sign({ username: username }, TOKEN_SECRET as unknown as string);
};

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader ? authorizationHeader.split(" ")[1] : "";
    jwt.verify(token, TOKEN_SECRET as unknown as jwt.Secret);

    next();
  } catch (error) {
    res.status(401);
  }
};
