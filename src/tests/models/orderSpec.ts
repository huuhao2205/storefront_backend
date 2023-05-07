import { OrderStore } from "../../models/order";
import { UserStore } from "../../models/user";
import { userList } from "../helpers/userTestData";
import Client from "../../database";

const orderStore = new OrderStore();
const userStore = new UserStore();

describe("Order model", () => {
  it("has a create method", () => {
    expect(orderStore.create).toBeDefined();
  });

  it("has a updateStatus method", () => {
    expect(orderStore.updateStatus).toBeDefined();
  });

  it("has a getActiveOrder method", () => {
    expect(orderStore.getActiveOrder).toBeDefined();
  });

  it("has a getCompletedOrders method", () => {
    expect(orderStore.getCompletedOrders).toBeDefined();
  });
});

describe("Order model method", () => {
  beforeAll(async () => {
    await userStore.create(userList[0]);
  });

  it("create should add an order", async () => {
    const result = await orderStore.create(1);

    expect(result).toEqual({
      id: 1,
      userId: 1,
      currentStatus: "active"
    });
  });

  it("create should throw an error if an active order already exist with the same user id", async () => {
    let error;
    try {
      await orderStore.create(1);
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
  });

  it("updateStatus should update an order to complete if an active order is present for given user id", async () => {
    const result = await orderStore.updateStatus(1);

    expect(result).toEqual({
      id: 1,
      userId: 1,
      currentStatus: "complete"
    });
  });

  it("updateStatus should throw an error if there are no active orders for given user id", async () => {
    let error;
    try {
      await orderStore.updateStatus(1);
    } catch (err) {
      error = err;
    }

    expect(error).not.toBeNull();
  });

  it("getActiveOrder should return an active order for the user, if it exists", async () => {
    await orderStore.create(1);
    const result = await orderStore.getActiveOrder(1);

    expect(result).toEqual({
      id: 2,
      userId: 1,
      currentStatus: "active"
    });
  });

  it("getCompletedOrders should return a all completed orders for user", async () => {
    let result = await orderStore.getCompletedOrders(1);

    expect(result).toEqual([
      {
        id: 1,
        userId: 1,
        currentStatus: "complete"
      }
    ]);

    await orderStore.updateStatus(1);
    result = await orderStore.getCompletedOrders(1);

    expect(result).toEqual([
      {
        id: 1,
        userId: 1,
        currentStatus: "complete"
      },
      {
        id: 2,
        userId: 1,
        currentStatus: "complete"
      }
    ]);
  });

  afterAll(async () => {
    const connection = await Client.connect();
    await connection.query("DELETE FROM users;");
    await connection.query("ALTER SEQUENCE users_id_seq RESTART WITH 1;");
    await connection.query("DELETE FROM orders;");
    await connection.query("ALTER SEQUENCE orders_id_seq RESTART WITH 1;");
    connection.release();
  });
});
