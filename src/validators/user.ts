import { GENDER, USER_ROLE } from "@/types/user";
import * as yup from "yup";
import dayjs from "dayjs";

export const ProfileCompleteValidator = yup.object({
  role: yup
    .string()
    .required("Role required")
    .oneOf(Object.values(USER_ROLE), "Invalid role"),
  gender: yup
    .string()
    .required("Gender required")
    .oneOf(Object.values(GENDER), "Invalid gender"),
  dateOfBirth: yup
    .string()
    .required("Date of birth required")
    .test("dateOfBirth", "Invalid date of birth", (value) => {
      return dayjs(value).isValid();
    })
    .test("dateOfBirth", "You must be 18 or order", (value) => {
      const customDate = dayjs(value);
      const currentDate = dayjs();
      return currentDate.diff(customDate, "y") >= 18;
    }),
});
