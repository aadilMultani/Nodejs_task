import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
require('dotenv').config();

export const AppDataSource = new DataSource({
    type: "mongodb",
    database: "user_management",
    url : process.env.DB_URL,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
