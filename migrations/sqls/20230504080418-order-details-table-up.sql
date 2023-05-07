CREATE TABLE order_details (
  id SERIAL PRIMARY KEY,
  product_id BIGINT,
  quantity INTEGER,
  order_id BIGINT,
  CONSTRAINT fk_product
  FOREIGN KEY(product_id)
    REFERENCES products(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_order
  FOREIGN KEY(order_id)
    REFERENCES orders(id)
    ON DELETE CASCADE
);