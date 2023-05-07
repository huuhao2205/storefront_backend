import { Product } from "../../models/products";

export const productList: Product[] = [
  {
    name: "bike",
    price: 150,
    category: "sports",
    rating: 4.35
  },
  {
    name: "kayak",
    price: 600,
    category: "sports",
    rating: 4.6
  },
  {
    name: "carpet",
    price: 40,
    category: "household",
    rating: 3.43
  },
  {
    name: "desk",
    price: 200,
    category: "office",
    rating: 3.9
  },
  {
    name: "pen",
    price: 2,
    category: "office",
    rating: 2.91
  },
  {
    name: "laptop",
    price: 2000,
    category: "office",
    rating: 4.9
  },
  {
    name: "chair",
    price: 40,
    category: "household",
    rating: 4.2
  }
];

export const prodListWithId = productList.map((product, index) => {
  product.id = index + 1;
  return product;
});
