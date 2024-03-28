import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../services/prismaProvider";

async function authenticateToken(
  token: string | undefined
): Promise<string | null> {
  if (!token) return null;
  try {
    const jwtKey = process.env.TOKEN_KEY ?? "INSTA";

    const decoded: any = jwt.verify(token.split(" ")[1], jwtKey);
    return decoded.email;
  } catch (error) {
    return null;
  }
}

export function auth(req: Request, res: Response, next: NextFunction) {
  (async (req, res, next) => {
    try {
      const email = await authenticateToken(req.headers.authorization);

      if (!email) {
        const error: any = new Error();
        error.details = { reason: "Invalid token" };
        return next(error);
      }

      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        const error: any = new Error();
        error.details = { reason: "Invalid token" };
        return res.status(401).json({ error });
      }

      req.body.user = user;
      next();
    } catch (error) {
      const customError: any = new Error();
    }
  })(req, res, next);
}
