import { AUTH_ERROR } from "@/types/errors";
import { generateErrorMesaage } from "@/utils/common";
import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

export const validateJWToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies["sign-wt"];
    if (!token) {
      return res.status(401).send({
        type: AUTH_ERROR.INVALID_TOKEN,
        message: "No token provided",
      });
    }
    const { email } = verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
    res.locals.email = email;
    next();
  } catch (e) {
    res.status(403).send({
      type: AUTH_ERROR.INVALID_TOKEN,
      message: generateErrorMesaage(e),
    });
  }
};
