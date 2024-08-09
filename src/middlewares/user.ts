import { Request, Response, NextFunction } from "express";
import { USER_ERROR } from "@/types/errors";
import { generateErrorMesaage } from "@/utils/common";

import { ProfileCompleteValidator } from "@/validators/user";

export const checkProfileCompleteData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await ProfileCompleteValidator.validate(req.body);
    next();
  } catch (e) {
    res.status(400).send({
      type: USER_ERROR.INVALID_PROFILE_COMPLETE_DATA,
      message: generateErrorMesaage(e),
    });
  }
};
