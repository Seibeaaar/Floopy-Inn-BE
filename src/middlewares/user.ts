import { Request, Response, NextFunction } from "express";
import { USER_ERROR } from "@/types/errors";
import { generateErrorMesaage } from "@/utils/common";

export const checkUserRequestWithId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = res.locals;
    if (userId.toString() !== req.params.id) {
      throw new Error("You are now allowed to perform this operation");
    }

    next();
  } catch (e) {
    res.status(403).send({
      type: USER_ERROR.NOT_ALLOWED,
      message: generateErrorMesaage(e),
    });
  }
};
