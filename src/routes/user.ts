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
import { AUTH_ERROR, USER_ERROR } from "@/types/errors";
import { validateJWToken } from "@/middlewares/common";
import { checkProfileCompleteData } from "@/middlewares/user";

const UserRouter = Router();

UserRouter.post(
  "/sign-up",
  checkEmailInUse,
  validatePassword,
  async (req, res) => {
    try {
      if (req.body.password) {
        req.body.password = hashSync(req.body.password, 10);
      }
      const user = await User.create(req.body);

      const { id } = user.dataValues;
      const token = signToken({ id }, process.env.TOKEN_SECRET!, {
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
    const { id } = user.dataValues;
    const token = signToken({ id }, process.env.TOKEN_SECRET!, {
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

UserRouter.delete("/delete", validateJWToken, async (req, res) => {
  try {
    const { id } = res.locals;
    await User.destroy({
      where: {
        id,
      },
    });

    res.status(200).send("User deleted successfully");
  } catch (e) {
    res.status(500).send({
      type: USER_ERROR.SERVER_ERROR,
      message: generateErrorMesaage(e),
    });
  }
});

UserRouter.put("/update", validateJWToken, async (req, res) => {
  try {
    const { id } = res.locals;
    await User.update(req.body, {
      where: {
        id,
      },
    });

    const updatedUser = await User.findByPk(id);

    res.status(200).send(updatedUser);
  } catch (e) {
    const isValidationError = checkIfValidationError(e);
    const status = isValidationError ? 400 : 500;
    const errorType = isValidationError
      ? USER_ERROR.INVALID_UPDATE_DATA
      : USER_ERROR.SERVER_ERROR;
    res.status(status).send({
      type: errorType,
      message: generateErrorMesaage(e),
    });
  }
});

UserRouter.post(
  "/complete-profile",
  validateJWToken,
  checkProfileCompleteData,
  async (req, res) => {
    try {
      const { id } = res.locals;
      await User.update(
        {
          ...req.body,
          profileComplete: true,
        },
        {
          where: {
            id,
          },
        },
      );

      const user = await User.findByPk(id);
      res.status(200).send(user);
    } catch (e) {
      res.status(500).send({
        type: USER_ERROR.SERVER_ERROR,
        messsage: generateErrorMesaage(e),
      });
    }
  },
);

export default UserRouter;
