import { Order } from "../models/order";
import { User } from "../models/user";
import { OrderDetails } from "./customTypes";

export const columnNamesToUserProps = (
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  password: string
): User => {
  const user: User = {
    id: id,
    username: username,
    firstName: first_name,
    lastName: last_name,
    password: password
  };
  return user;
};

export const columnNamesToOrderDetails = (
  id: number,
  product_id: number,
  quantity: number,
  order_id: number
): OrderDetails => {
  return {
    id: id,
    productId: product_id,
    quantity: quantity,
    orderId: order_id
  };
};

export const columnNamesToOrderProps = (
  id: number,
  user_id: number,
  current_status: string
): Order => {
  const order: Order = {
    id: id,
    userId: user_id,
    currentStatus: current_status
  };
  return order;
};
