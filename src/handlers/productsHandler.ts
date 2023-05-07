import { Application, Request, Response } from "express";
import { Product, ProductStore } from "../models/products";
import { verifyAuthToken } from "../utils/jwtAuthentication";

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await store.show(id);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const productInfo: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      rating: req.body.rating
    };
    const product = await store.create(productInfo);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await store.delete(id);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};

export const productRouter = (app: Application): void => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/products", verifyAuthToken, create);
  app.delete("/products/:id", verifyAuthToken, destroy);
};
