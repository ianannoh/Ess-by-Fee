# Ess by Fee

A small server-rendered e-commerce web app for **Ess by Fee**, a shop selling mini perfumes,
designer fragrances, splashes and mists. Prices are quoted in Ghanaian cedis (GH₵).

Customers can browse the catalogue, view product details, leave star-rated reviews, and place an
order. Orders land in a simple admin dashboard where the seller can see the buyer's contact and
delivery details.

---

## Tech stack

| Concern    | Choice                                    |
| ---------- | ----------------------------------------- |
| Runtime    | Node.js                                   |
| Framework  | Express 4                                 |
| Template   | EJS, with `ejs-mate` for layouts          |
| Database   | MongoDB via Mongoose 8                    |
| Auth       | `passport` + `passport-local-mongoose` (work in progress) |
| Styling    | Bootstrap 5 (CDN) + plain CSS             |

---

## Features

- **Storefront landing page** (`/`) with the shop logo and a link into the catalogue.
- **Product catalogue** with an image, name, price and description per product.
- **Product detail page** showing image, price, description and star-rating reviews.
- **CRUD for products** — create, view, edit and delete, including cascading delete of a
  product's reviews.
- **Reviews** — 1–5 star rating, author name and comment; reviews can be deleted.
- **Purchase flow** — an order form capturing name, phone, email, region, town/city and notes.
  Product id/name/price are copied onto the order server-side so the order is self-contained.
- **Admin orders dashboard** listing every order with buyer details.
- **Search** by product name.
- **Error handling** — 404 page for unknown URLs plus a central error handler.

---

## Project structure

```
.
├── index.js              # Express app, all routes, DB connection
├── seeds.js              # Script that inserts sample products
├── models/
│   ├── ess.js            # Product schema (+ cascading review delete)
│   ├── reviews.js        # Review schema (body, rating, author)
│   ├── orders.js         # Order schema (customer + product snapshot)
│   └── admin.js          # Admin schema with passport-local-mongoose
├── utils/
│   ├── catchAsync.js     # Async route wrapper
│   └── ExpressError.js   # HTTP error helper
├── views/
│   ├── layout/boilerplate.ejs   # Base layout (Bootstrap + navbar/footer)
│   ├── partials/                # navbar.ejs, footer.ejs
│   ├── ess/                    # home, all, show, add, edit, search, purchase, admin, login
│   └── extras/                 # error.ejs, flash.ejs
└── public/
    ├── stylesheets/     # Per-page CSS (nav, show, search, admin, all, footer, star)
    ├── prod/            # Product images: prod1.jpg … prod6.jpg
    └── *.jpg|png|webp   # Logo, cart and error artwork
```

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 16+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, or an accessible
  MongoDB URI

### Install

```bash
npm install
```

### Configure the database

The connection string is currently hardcoded in `index.js` and `seeds.js`:

```js
const mongo = 'mongodb://localhost:27017/essByFee';
```

Change it there (ideally move it to an environment variable) if your MongoDB runs elsewhere.

### Seed sample data (optional)

```bash
node seeds.js
```

This inserts ten sample products with random names, prices and `prod1`–`prod6` images.

### Run

There is no `start` script yet, so launch the app directly:

```bash
node index.js
```

Then open <http://localhost:3000>.

---

## Routes

### Products

| Method   | URL                    | Description                          |
| -------- | ---------------------- | ------------------------------------ |
| `GET`    | `/`                    | Storefront landing page              |
| `GET`    | `/ess`                 | All products                         |
| `GET`    | `/ess/add`             | Form to create a product             |
| `POST`   | `/ess`                 | Create a product                     |
| `GET`    | `/ess/search?q=`       | Search products by name              |
| `GET`    | `/ess/admin`           | Orders dashboard                     |
| `GET`    | `/ess/adminsignup`     | Dev-only route that creates an admin |

### Single product

| Method   | URL                          | Description                     |
| -------- | ---------------------------- | ------------------------------- |
| `GET`    | `/ess/:id`                   | Product detail + reviews        |
| `GET`    | `/ess/:id/edit`              | Edit form                       |
| `PUT`    | `/ess/:id`                   | Update a product                |
| `DELETE` | `/ess/:id`                   | Delete a product and its reviews|

`PUT` and `DELETE` are sent from HTML forms via `method-override` (`?_method=DELETE`).

### Purchases and reviews

| Method   | URL                                | Description                       |
| -------- | ---------------------------------- | --------------------------------- |
| `GET`    | `/ess/:id/purchase`                | Order form                        |
| `POST`   | `/ess/:id/purchase`                | Place an order                    |
| `POST`   | `/ess/:id/review`                  | Add a review                      |
| `DELETE` | `/ess/:id/review/:reviewId`        | Delete a review                   |

---

## Data models

**Product** (`models/ess.js`)

| Field         | Type       | Notes                                      |
| ------------- | ---------- | ------------------------------------------ |
| `name`        | String     |                                            |
| `price`       | Number     |                                            |
| `description` | String     |                                            |
| `Image`       | String     | Filename without extension, e.g. `prod1`   |
| `review`      | [ObjectId] | References to `Review`                     |

A `findOneAndDelete` hook removes the product's reviews.

**Review** (`models/reviews.js`) — `body`, `rating` (1–5), `author`.

**Order** (`models/orders.js`) — buyer details (`Firstname`, `Lastname`, `Region`, `TownCity`,
`Phone`, `Email`, `AddNotes`) plus a snapshot of the purchased product (`productId`,
`productName`, `productPrice`).

**Admin** (`models/admin.js`) — `email` plus `username`/`password` added by
`passport-local-mongoose`.

---