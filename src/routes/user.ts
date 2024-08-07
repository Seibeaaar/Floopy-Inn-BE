import { Router } from "express";
import { User } from "../database/user";
import { checkEmailInUse } from "../middlewares/auth";
import { checkIfValidationError, generateErrorMesaage } from "@/utils/common";
import { AUTH_ERROR, COMMON_ERROR } from "@/types/errors";

const UserRouter = Router();

UserRouter.post("/sign-up", checkEmailInUse, async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).send(user);
  } catch (e) {
    const isValidationError = checkIfValidationError(e);
    const status = isValidationError ? 400 : 500;
    const errorType = isValidationError
      ? AUTH_ERROR.INVALID_SIGN_UP_DATA
      : COMMON_ERROR.SERVER_ERROR;
    res.status(status).send({
      type: errorType,
      message: generateErrorMesaage(e),
    });
  }
});

export default UserRouter;
