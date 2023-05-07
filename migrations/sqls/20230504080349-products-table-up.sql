CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  rating NUMERIC(3,2) NOT NULL CONSTRAINT max_rating CHECK (rating <= 5)
);