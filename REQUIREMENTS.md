## API Endpoints
#### Products
- Index : `'/products' [GET]`
- Show : `'/products/:id' [GET]`
- Create [token required] : `'/products' [POST]`
- Delete [token required] : `'/products/:id' [DELETE]`

#### Users
- Index [token required] : `'/users' [GET]`
- Show [token required] : `'/users/:id' [GET]`
- Create [token required] : `'/users' [POST]`
- Authenticate (args: username, password) [token required] : `'/auth' [GET]`
- AddProductToOrder (args: orderId, productId, quantity) [token required]: `'/users/:id/add-product-to-order' [POST]`
- RemoveProductFromOrder (args: orderId, productId) [token required] `'/users/:id/remove-product-from-order' [DELETE]`

#### Orders
- Create (args: userId) [token required] : `'/orders' [POST]`
- UpdateStatus (args: userId) [token required]: `'/orders' [PUT]`
- Active Order by user (args: user id) [token required] : `'orders/users/:userId/active' [GET]`
- Completed Orders by user (args: user id) [token required] `'orders/users/:userId/completed' [GET]`

## Data Shapes
#### Product

| Column        | Type               |
| ------------- |:------------------:|
| id            | SERIAL PRIMARY KEY |
| name          | VARCHAR            |
| price         | INTEGER            |
| category      | VARCHAR            |
| rating        | NUMERIC(3,2) MAX 5 |

#### User

| Column        | Type               |
| ------------- |:------------------:|
| id            | SERIAL PRIMARY KEY |
| username      | VARCHAR  UNIQUE    |
| firstName     | VARCHAR            |
| lastName      | VARCHAR            |
| password      | VARCHAR            |

#### Orders

| Column        | Type                        |
| ------------- |:---------------------------:|
| id            | SERIAL PRIMARY KEY          |
| userId        | FOREIGN KEY to USERS        |
| currentStatus | ENUM ('active','complete')  |


##### Order_details

| Column        | Type                       |
| ------------- |:--------------------------:|
| id            | SERIAL PRIMARY KEY         |
| productId     | FOREIGN KEY to PRODUCTS    |
| quantity      | INTEGER                    |
| orderId       | FOREIGN KEY to ORDERS      |

