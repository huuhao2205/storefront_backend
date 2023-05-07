import { Application, Request, Response } from "express";
import { OrderStore } from "../models/order";
import { verifyAuthToken } from "../utils/jwtAuthentication";

const store = new OrderStore();

const create = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const order = await store.create(userId);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const order = await store.updateStatus(userId);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};

const active = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const order = await store.getActiveOrder(userId);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};

const completed = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const order = await store.getCompletedOrders(userId);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};

export const orderRouter = (app: Application): void => {
  app.post("/orders", verifyAuthToken, create);
  app.put("/orders", verifyAuthToken, update);
  app.get("/orders/users/:userId/active", verifyAuthToken, active);
  app.get("/orders/users/:userId/completed", verifyAuthToken, completed);
};
