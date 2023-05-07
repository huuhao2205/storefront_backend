import app from "../../server";
import supertest from "supertest";
import Client from "../../database";
import { testToken } from "../helpers/testToken";

const request = supertest(app);

describe("Products Handler", () => {
  it("posts /products: returns a product in JSON format", async () => {
    const response = await request
      .post("/products")
      .set("Authorization", `Bearer ${testToken}`)
      .send({ name: "bike", price: 200, category: "sports", rating: 4.32 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: "bike",
      price: 200,
      category: "sports",
      rating: 4.32
    });
  });

  it("gets /products: returns a list of products in JSON format", async () => {
    const response = await request.get("/products");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        name: "bike",
        price: 200,
        category: "sports",
        rating: 4.32
      }
    ]);
  });

  it("gets /products/:id: returns a product in JSON format", async () => {
    const response = await request.get("/products/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: "bike",
      price: 200,
      category: "sports",
      rating: 4.32
    });
  });

  it("deletes /products/:id: returns the deleted product in JSON format", async () => {
    const response = await request
      .delete("/products/1")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: "bike",
      price: 200,
      category: "sports",
      rating: 4.32
    });
  });

  afterAll(async () => {
    const connection = await Client.connect();
    await connection.query("DELETE FROM products;");
    await connection.query("ALTER SEQUENCE products_id_seq RESTART WITH 1;");
    connection.release();
  });
});
