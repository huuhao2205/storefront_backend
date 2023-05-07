import express, { Request, Response } from "express";
import { productRouter } from "./handlers/productsHandler";
import { userRouter } from "./handlers/usersHandler";
import { orderRouter } from "./handlers/ordersHandler";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: express.Application = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: `http://localhost:${PORT}`
  })
);

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
});

productRouter(app);
userRouter(app);
orderRouter(app);

app.listen(PORT, function () {
  console.log(`starting app on port ${PORT}`);
});

export default app;
