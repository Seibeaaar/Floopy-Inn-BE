import { Request, Response, NextFunction } from "express";
import { User } from "../database/user";
import { generateErrorMesaage } from "../utils/common";
import { AUTH_ERROR } from "@/types/errors";
import { PASSWORD_REGEX } from "@/constants/auth";

export const validatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password } = req.body;
    if (password !== undefined && !PASSWORD_REGEX.test(password)) {
      throw new Error("Invalid password");
    }

    next();
  } catch (e) {
    res.status(400).send(generateErrorMesaage(e));
  }
};

export const checkEmailInUse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const existingUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (existingUser) {
      throw new Error(`User with email ${req.body.email} already exists`);
    }
    next();
  } catch (e) {
    res.status(400).send({
      message: generateErrorMesaage(e),
      type: AUTH_ERROR.EMAIL_IN_USE,
    });
  }
};
