import { Request, Response, NextFunction } from "express";
import { compare as comparePassowrds } from "bcrypt";
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
    res.status(400).send({
      type: AUTH_ERROR.INVALID_SIGN_UP_DATA,
      message: generateErrorMesaage(e),
    });
  }
};

export const validateLoginBody = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.body.email) {
      throw new Error("Email required");
    }

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      throw new Error(`No user with such credentials found!`);
    }

    if (user.dataValues.password) {
      comparePassowrds(req.body.password, user.dataValues.password, (err) => {
        if (err) {
          throw new Error(`No user with such credentials found!`);
        }
      });
    }

    res.locals.user = user;
    next();
  } catch (e) {
    res.status(400).send({
      type: AUTH_ERROR.INVALID_LOGIN_DATA,
      mesaage: generateErrorMesaage(e),
    });
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
