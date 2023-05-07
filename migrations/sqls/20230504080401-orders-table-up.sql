CREATE TYPE status AS ENUM ('active', 'complete');

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  current_status status NOT NULL,
  user_id BIGINT NOT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
);