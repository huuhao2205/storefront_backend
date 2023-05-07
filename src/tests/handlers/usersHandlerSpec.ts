import { User } from "../../models/user";
import { userList, userListWithIdAndNoPwd } from "../helpers/userTestData";
import { ProductStore } from "../../models/products";
import { productList } from "../helpers/productTestData";
import { OrderStore } from "../../models/order";
import { testToken } from "../helpers/testToken";
import app from "../../server";
import supertest from "supertest";
import bcrypt from "bcrypt";
import _ from "lodash";
import dotenv from "dotenv";
import Client from "../../database";

const request = supertest(app);

dotenv.config();
const { PEPPER } = process.env;

describe("Users Handler", () => {
  it("posts /users: returns a token", async () => {
    const response = await request
      .post("/users")
      .set("Authorization", `Bearer ${testToken}`)
      .send(userList[0]);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(String);
    expect(response.body).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    );
  });

  it("gets /users: returns a list of users in JSON format with hashed passwords", async () => {
    const response = await request
      .get("/users")
      .set("Authorization", `Bearer ${testToken}`);
    const returnedUsers = response.body.map((user: User) => {
      return _.pick(user, ["id", "username", "firstName", "lastName"]);
    });
    const pwdChecks = response.body.every((user: User, i: number) => {
      return bcrypt.compareSync(userList[i].password + PEPPER, user.password);
    });

    expect(response.status).toBe(200);
    expect(returnedUsers).toEqual([userListWithIdAndNoPwd[0]]);
    expect(pwdChecks).toBe(true);
  });

  it("gets /users/:id: returns a user in JSON format with a hashed password", async () => {
    const response = await request
      .get("/users/1")
      .set("Authorization", `Bearer ${testToken}`);
    const pwdCheck = bcrypt.compareSync(
      userList[0].password + PEPPER,
      response.body.password
    );

    expect(response.status).toBe(200);
    expect(pwdCheck).toBe(true);
    expect(
      _.pick(response.body, ["id", "username", "firstName", "lastName"])
    ).toEqual(userListWithIdAndNoPwd[0]);
  });

  it("gets /auth: returns a token if the username/password combination is valid", async () => {
    const response = await request
      .get("/auth")
      .set("Authorization", `Bearer ${testToken}`)
      .send({ username: userList[0].username, password: userList[0].password });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(String);
    expect(response.body).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    );
  });

  it("gets /auth: returns an error message if the username/password combination is not valid", async () => {
    const response = await request
      .get("/auth")
      .set("Authorization", `Bearer ${testToken}`)
      .send({ username: userList[0].username, password: "test" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
    expect(response.text).toEqual("Invalid username and/or password");
  });

  it("posts /users/:id/add-product-to-order: returns the order details", async () => {
    const productStore = new ProductStore();
    const orderStore = new OrderStore();
    await productStore.create(productList[0]);
    await orderStore.create(1);

    const response = await request
      .post("/users/1/add-product-to-order")
      .set("Authorization", `Bearer ${testToken}`)
      .send({ productId: 1, quantity: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      productId: 1,
      quantity: 10,
      orderId: 1
    });
  });

  it("deletes /users/:id/remove-product-from-order: returns the order details", async () => {
    const response = await request
      .delete("/users/1/remove-product-from-order")
      .set("Authorization", `Bearer ${testToken}`)
      .send({ productId: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      productId: 1,
      quantity: 10,
      orderId: 1
    });
  });

  afterAll(async () => {
    const connection = await Client.connect();
    await connection.query("DELETE FROM users;");
    await connection.query("ALTER SEQUENCE users_id_seq RESTART WITH 1;");
    await connection.query("DELETE FROM orders;");
    await connection.query("ALTER SEQUENCE orders_id_seq RESTART WITH 1;");
    await connection.query("DELETE FROM products;");
    await connection.query("ALTER SEQUENCE products_id_seq RESTART WITH 1;");
    await connection.query("DELETE FROM order_details;");
    await connection.query(
      "ALTER SEQUENCE order_details_id_seq RESTART WITH 1;"
    );
    connection.release();
  });
});
