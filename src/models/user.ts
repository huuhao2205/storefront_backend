import Client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import {
  columnNamesToUserProps,
  columnNamesToOrderDetails
} from "../utils/namingConventions";
import { OrderDetails } from "../utils/customTypes";

dotenv.config();
const { PEPPER, SALT_ROUNDS } = process.env;

export type User = {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const connection = await Client.connect();
      const sql = "SELECT * FROM users;";
      const result = await connection.query(sql);
      connection.release();
      return result.rows.map(dbData => {
        return columnNamesToUserProps(
          dbData.id,
          dbData.username,
          dbData.first_name,
          dbData.last_name,
          dbData.password
        );
      });
    } catch (err) {
      throw new Error(`Cannot get users: ${err}`);
    }
  }

  async show(userId: number): Promise<User> {
    try {
      const connection = await Client.connect();
      const sql = "SELECT * FROM users WHERE id = ($1);";
      const result = await connection.query(sql, [userId]);
      const { id, username, first_name, last_name, password } = result.rows[0];
      connection.release();
      return columnNamesToUserProps(
        id,
        username,
        first_name,
        last_name,
        password
      );
    } catch (err) {
      throw new Error(`Cannot get user: ${err}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const connection = await Client.connect();
      const sql =
        "INSERT INTO users (username, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *;";
      const hashedPassword = bcrypt.hashSync(
        user.password + PEPPER,
        parseInt(SALT_ROUNDS as unknown as string)
      );
      const result = await connection.query(sql, [
        user.username,
        user.firstName,
        user.lastName,
        hashedPassword
      ]);
      const { id, username, first_name, last_name, password } = result.rows[0];
      connection.release();
      return columnNamesToUserProps(
        id,
        username,
        first_name,
        last_name,
        password
      );
    } catch (err) {
      throw new Error(`Cannot create user ${user.username}: ${err}`);
    }
  }

  async authenticate(
    username: string,
    pwdString: string
  ): Promise<null | User> {
    try {
      const connection = await Client.connect();
      const sql = "SELECT * FROM users WHERE username=($1);";
      const result = await connection.query(sql, [username]);
      let auth: null | User = null;
      if (result.rows.length) {
        const { id, username, first_name, last_name, password } =
          result.rows[0];
        const user: User = columnNamesToUserProps(
          id,
          username,
          first_name,
          last_name,
          password
        );
        if (bcrypt.compareSync(pwdString + PEPPER, user.password)) {
          auth = user;
        }
      }
      return auth;
    } catch (err) {
      throw new Error(`Cannot authenticate user ${username}: ${err}`);
    }
  }

  async addProductToOrder(
    userId: number,
    productId: number,
    quantityInput: number
  ): Promise<OrderDetails | undefined> {
    try {
      const connection = await Client.connect();
      const orderQuery =
        "SELECT id FROM orders WHERE user_id = ($1) AND current_status = 'active';";
      const orderResult = await connection.query(orderQuery, [userId]);
      const orderId: number = orderResult.rows[0].id;
      if (orderId) {
        const addProductQuery =
          "INSERT INTO order_details (product_id, quantity, order_id) VALUES ($1, $2, $3) RETURNING *;";
        const result = await connection.query(addProductQuery, [
          productId,
          quantityInput,
          orderId
        ]);
        const { id, product_id, quantity, order_id } = result.rows[0];
        connection.release();
        return columnNamesToOrderDetails(
          id,
          Number(product_id),
          quantity,
          Number(order_id)
        );
      } else {
        connection.release();
        console.error(`There are no active orders for user ${userId}`);
      }
    } catch (err) {
      throw new Error(`Cannot add product ${productId} to order: ${err}`);
    }
  }

  async removeProductFromOrder(
    userId: number,
    productId: number
  ): Promise<OrderDetails | undefined> {
    try {
      const connection = await Client.connect();
      const orderQuery =
        "SELECT id FROM orders WHERE user_id = ($1) AND current_status = 'active';";
      const orderResult = await connection.query(orderQuery, [userId]);
      const orderId: number = orderResult.rows[0].id;
      if (orderId) {
        const sql =
          "DELETE FROM order_details WHERE order_id = ($1) AND product_id = ($2) RETURNING *;";
        const result = await connection.query(sql, [orderId, productId]);
        const { id, product_id, quantity, order_id } = result.rows[0];
        connection.release();
        return columnNamesToOrderDetails(
          id,
          Number(product_id),
          quantity,
          Number(order_id)
        );
      } else {
        connection.release();
        console.error(`There are no active orders for user ${userId}`);
      }
    } catch (err) {
      throw new Error(
        `Could not delete product ${productId} from order: ${err}`
      );
    }
  }
}
