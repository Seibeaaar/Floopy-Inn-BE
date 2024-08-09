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
    const token = req.cookies["sign-jwt"];
    if (!token) {
      return res.status(401).send({
        type: AUTH_ERROR.INVALID_TOKEN,
        message: "No token provided",
      });
    }
    const { id } = verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
    res.locals.id = id;
    next();
  } catch (e) {
    res.status(403).send({
      type: AUTH_ERROR.INVALID_TOKEN,
      message: generateErrorMesaage(e),
    });
  }
};
