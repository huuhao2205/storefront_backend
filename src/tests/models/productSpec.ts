import { ProductStore } from "../../models/products";
import { productList, prodListWithId } from "../helpers/productTestData";
import Client from "../../database";

const store = new ProductStore();

describe("Product model", () => {
  it("has an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("has a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("has a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("has a delete method", () => {
    expect(store.delete).toBeDefined();
  });
});

describe("Product model method", () => {
  beforeAll(async () => {
    const connection = await Client.connect();
    const sql =
      "INSERT INTO products (name, price, category, rating) VALUES ($1, $2, $3, $4);";
    for (const product of productList) {
      await connection.query(sql, [
        product.name,
        product.price,
        product.category,
        product.rating
      ]);
    }
    connection.release();
  });

  it("index should return a list of all products", async () => {
    const result = await store.index();

    expect(result).toEqual(prodListWithId);
  });

  it("create should add a product", async () => {
    const result = await store.create({
      name: "notepad",
      price: 9,
      category: "office",
      rating: 4.2
    });

    expect(result).toEqual({
      id: 8,
      name: "notepad",
      price: 9,
      category: "office",
      rating: 4.2
    });
  });

  it("show should return the product with the given id", async () => {
    const result = await store.show(8);

    expect(result).toEqual({
      id: 8,
      name: "notepad",
      price: 9,
      category: "office",
      rating: 4.2
    });
  });

  it("delete should remove the product with the given id", async () => {
    const deletedProduct = await store.delete(8);
    const products = await store.index();

    expect(products).not.toContain(deletedProduct);
    expect(deletedProduct).toEqual({
      id: 8,
      name: "notepad",
      price: 9,
      category: "office",
      rating: 4.2
    });
  });

  afterAll(async () => {
    const connection = await Client.connect();
    await connection.query("DELETE FROM products;");
    await connection.query("ALTER SEQUENCE products_id_seq RESTART WITH 1;");
    connection.release();
  });
});
