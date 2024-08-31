import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/User"
import { config } from "dotenv"
import { Order } from "../entity/Order";
import { OrderProduct } from "../entity/OrderProduct";
import { Product } from "../entity/Product";
import { ProductImage } from "../entity/ProductImage";

config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test",
  entities: [Order, User, OrderProduct, Product, ProductImage],
  synchronize: true,
  logging: false,
})


AppDataSource.initialize()
  .then(() => {
    console.log("Database connected")
  })
  .catch((error) => console.log(error))

export default AppDataSource;