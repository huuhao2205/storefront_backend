import Client from "../database";
import { columnNamesToOrderProps } from "../utils/namingConventions";

export type Order = {
  id?: number;
  userId: number;
  currentStatus: string;
};

export class OrderStore {
  async create(userId: number): Promise<Order> {
    try {
      const connection = await Client.connect();
      const checkActiveQuery =
        "SELECT id FROM orders WHERE user_id = ($1) AND current_status = 'active';";
      const checkActiveQueryRes = await connection.query(checkActiveQuery, [
        userId
      ]);
      if (checkActiveQueryRes.rows[0]) {
        connection.release();
        throw new Error("an active order for this user already exists");
      } else {
        const sql =
          "INSERT INTO orders (user_id, current_status) VALUES ($1, $2) RETURNING *;";
        const result = await connection.query(sql, [userId, "active"]);
        const { id, user_id, current_status } = result.rows[0];
        connection.release();
        return columnNamesToOrderProps(id, Number(user_id), current_status);
      }
    } catch (err) {
      throw new Error(`Cannot create order: ${err}`);
    }
  }

  async updateStatus(userId: number): Promise<Order> {
    try {
      const connection = await Client.connect();
      const checkActiveQuery =
        "SELECT id FROM orders WHERE user_id = ($1) AND current_status = 'active';";
      const checkActiveQueryRes = await connection.query(checkActiveQuery, [
        userId
      ]);
      if (checkActiveQueryRes.rows[0]) {
        const orderId = checkActiveQueryRes.rows[0].id;
        const sql =
          "UPDATE orders SET current_status = 'complete' WHERE id = ($1) RETURNING *;";
        const result = await connection.query(sql, [orderId]);
        const { id, user_id, current_status } = result.rows[0];
        connection.release();
        return columnNamesToOrderProps(id, Number(user_id), current_status);
      } else {
        connection.release();
        throw new Error(`there are no active orders for user ${userId}`);
      }
    } catch (err) {
      throw new Error(`Cannot update order: ${err}`);
    }
  }

  async getActiveOrder(userId: number): Promise<Order> {
    try {
      const connection = await Client.connect();
      const sql =
        "SELECT * FROM orders WHERE user_id = ($1) AND current_status = 'active'";
      const result = await connection.query(sql, [userId]);
      const { id, user_id, current_status } = result.rows[0];
      connection.release();
      return columnNamesToOrderProps(id, Number(user_id), current_status);
    } catch (err) {
      throw new Error(`Cannot retrieve active order: ${err}`);
    }
  }

  async getCompletedOrders(userId: number): Promise<Order[]> {
    try {
      const connection = await Client.connect();
      const sql =
        "SELECT * FROM orders WHERE user_id = ($1) AND current_status = 'complete'";
      const result = await connection.query(sql, [userId]);
      const orderList: Order[] = result.rows.map(order => {
        const { id, user_id, current_status } = order;
        return columnNamesToOrderProps(id, Number(user_id), current_status);
      });
      connection.release();
      return orderList;
    } catch (err) {
      throw new Error(`Cannot retrieve completed orders: ${err}`);
    }
  }
}
