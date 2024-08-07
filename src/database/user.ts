import { DataTypes } from "sequelize";
import sequelize from ".";
import { GENDER, USER_ROLE } from "../types/user";

export const User = sequelize.define(
  "users",
  {
    email: {
      type: DataTypes.STRING(256),
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Invalid email",
        },
        notEmpty: {
          msg: "Email required",
        },
      },
    },
    firstName: {
      type: DataTypes.STRING(256),
      allowNull: false,
      field: "firstname",
      validate: {
        notEmpty: {
          msg: "First name required",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING(256),
      allowNull: false,
      field: "lastname",
      validate: {
        notEmpty: {
          msg: "First name required",
        },
      },
    },
    password: DataTypes.STRING(256),
    role: DataTypes.ENUM(...Object.values(USER_ROLE)),
    gender: DataTypes.ENUM(...Object.values(GENDER)),
    dateOfBirth: {
      type: DataTypes.DATE,
      field: "dateofbirth",
    },
    profilePicture: {
      type: DataTypes.STRING(256),
      field: "profilepicture",
    },
  },
  {
    timestamps: false,
  },
);
