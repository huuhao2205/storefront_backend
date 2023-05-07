import { Application, Request, Response } from "express";
import { User, UserStore } from "../models/user";
import { createAuthToken, verifyAuthToken } from "../utils/jwtAuthentication";

const store = new UserStore();

const index = async (req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await store.show(id);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};

const create = async (req: Request, res: Response) => {
  const userInfo: User = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  };
  try {
    const user = await store.create(userInfo);
    const token = createAuthToken(user.username);
    res.json(token);
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const user = await store.authenticate(req.body.username, req.body.password);
    if (user) {
      const token = createAuthToken(user.username);
      res.json(token);
    } else {
      res.send("Invalid username and/or password");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { productId, quantity } = req.body;
    const orderDetails = await store.addProductToOrder(
      userId,
      productId,
      quantity
    );
    res.json(orderDetails);
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};

const removeProduct = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const productId = req.body.productId;
    const orderDetails = await store.removeProductFromOrder(userId, productId);
    res.json(orderDetails);
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};

export const userRouter = (app: Application): void => {
  app.get("/users", verifyAuthToken, index);
  app.get("/users/:id", verifyAuthToken, show);
  app.post("/users", verifyAuthToken, create);
  app.get("/auth", verifyAuthToken, authenticate);
  app.post("/users/:id/add-product-to-order", verifyAuthToken, addProduct);
  app.delete(
    "/users/:id/remove-product-from-order",
    verifyAuthToken,
    removeProduct
  );
};
