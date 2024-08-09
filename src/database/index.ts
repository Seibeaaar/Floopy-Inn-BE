import { Sequelize } from "sequelize";

export default new Sequelize({
  dialect: "postgres",
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
});
