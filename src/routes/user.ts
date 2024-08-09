import { Router } from "express";
import { sign as signToken } from "jsonwebtoken";
import { hashSync } from "bcrypt";
import { User } from "../database/user";
import {
  checkEmailInUse,
  validateLoginBody,
  validatePassword,
} from "../middlewares/auth";
import { checkIfValidationError, generateErrorMesaage } from "@/utils/common";
import { AUTH_ERROR } from "@/types/errors";
import { validateJWToken } from "@/middlewares/common";

const UserRouter = Router();

UserRouter.post(
  "/sign-up",
  validateJWToken,
  checkEmailInUse,
  validatePassword,
  async (req, res) => {
    try {
      if (req.body.password) {
        req.body.password = hashSync(req.body.password, 10);
      }
      const user = await User.create(req.body);

      const { email } = user.dataValues;
      const token = signToken({ email }, process.env.TOKEN_SECRET!, {
        expiresIn: "4h",
      });
      res.cookie("sign-jwt", token);
      res.status(201).send(user);
    } catch (e) {
      const isValidationError = checkIfValidationError(e);
      const status = isValidationError ? 400 : 500;
      const errorType = isValidationError
        ? AUTH_ERROR.INVALID_SIGN_UP_DATA
        : AUTH_ERROR.SERVER_ERROR;
      res.status(status).send({
        type: errorType,
        message: generateErrorMesaage(e),
      });
    }
  },
);

UserRouter.post("/login", validateLoginBody, async (req, res) => {
  try {
    const { user } = res.locals;
    const { email } = user.dataValues;
    const token = signToken({ email }, process.env.TOKEN_SECRET!, {
      expiresIn: "4h",
    });
    res.cookie("sign-jwt", token);
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send({
      type: AUTH_ERROR.SERVER_ERROR,
      message: generateErrorMesaage(e),
    });
  }
});

export default UserRouter;
