# 🍽️ Food Court Backend — Microservice Architecture

A scalable and maintainable food delivery backend application built with **NestJS**, **Knex.js**, **WebSockets**, **Rabbitmq** and **PostgreSQL**, following a robust **microservices architecture**.

This repository contains the backend logic for managing customer orders, rider logistics, and API routing through an API Gateway. Communication between services is facilitated using **RabbitMQ**, and data operations are abstracted using **Knex.js** for query building and migrations.

---

## 🏗️ Architecture Overview

### Services:

- **api-gateway**: Entry point for all HTTP traffic; handles authentication, routing, and request validation.
- **order-management**: Handles customer order creation, status tracking, and payment logic.
- **rider-management**: Manages rider availability, location tracking, and order dispatch.

Each service is containerized and independently deployable, enabling true microservice autonomy.

---

## 📁 Project Structure

```
.
├── apps/
│   ├── api-gateway/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── ...
│   ├── order-management/
│   │   ├── src/
│   │   │  ├── orders/
│   │   │  ├── models/
│   │   │  ├── migrations/
│   │   │  ├── seeds/
│   │   │  ├── ...
│   │   ├── Dockerfile
│   │   └── ...
│   └── rider-management/
│   │   ├── src/
│   │   │   ├── riders/
│   │   │   ├── models/
│   │   │   ├── migrations/
│   │   │   ├── seeds/
│   │   │   ├── ...
│   │   ├── Dockerfile
│   │   └── ...
├── docker-compose.yml
├── knex-wrapper.ts
└── ...
```

---

## 🐳 Running the Project (via Docker) locally

Ensure Docker is installed and running on your machine.

### 1. Environment Setup

Create a `.env` file at the root level to include environment variables such as:

```env
DB_URL=postgres://user:password@localhost:5432/food_court
RABBITMQ_URI=amqp://rabbitmq
...
```

### 2. Start the Application

```bash
docker-compose up --build
```

This will spin up:

- RabbitMQ on ports `5672` and `15672` (management UI)
- API Gateway on port `4000`
- Order Management and Rider Management services

> Optionally include the PostgreSQL and pgAdmin services by uncommenting them in `docker-compose.yml`. Otherwise you can use anyother one available

---

## 🔧 Development Commands

Knex is used for schema management,migrations and seeding. Thanks to the `knex-wrapper.ts` helper, you can run scoped commands:

### Migrations

```bash
npm run knex -- orders migrate:make create_orders_table --env development
npm run knex -- orders migrate:latest --env development
```

### Seeding

npm run knex -- <service> <command>

```bash
npm run knex -- orders seed:make orders_seed --env development
npm run knex -- orders seed:run --env development
```

Replace `orders` with `riders` for the rider service.

The get the app started for testing,there are datas ready for seeding. Just run:

```bash
npm run knex -- orders migrate:latest --env development
```

then

```bash
npm run knex -- orders seed:run --env development
```

---

## 📡 Inter-Service Communication

All services communicate via RabbitMQ using the `@nestjs/microservices` transport layer with durable queues. This ensures decoupled and asynchronous event-driven processing across modules.

---

## 🌍 Geospatial Optimization with PostGIS

To efficiently handle **proximity-based rider assignment**, especially when scaling to thousands of riders:

- **PostGIS** (a PostgreSQL extension) is recommended for geospatial queries.
- Replace simple `latitude`/`longitude` filtering with PostGIS `geography(Point, 4326)` data type.
- Use spatial indexes (`GIST`) and query with:
  ```sql
  SELECT id, name FROM riders
  WHERE ST_DWithin(location, ST_MakePoint(:lon, :lat)::geography, :radius)
  ORDER BY ST_Distance(location, ST_MakePoint(:lon, :lat)::geography)
  LIMIT 1;
  ```
- This ensures **high performance proximity search**, even with tens of thousands of records.

---

## 🧠 Tech Stack

| Feature           | Technology                 |
| ----------------- | -------------------------- |
| Framework         | NestJS (Monorepo)          |
| ORM/Query Builder | Knex.js                    |
| Messaging         | RabbitMQ                   |
| Database          | PostgreSQL (PostGIS ready) |
| Realtime          | WebSocket (Gateway Layer)  |
| Containerization  | Docker, Docker Compose     |

---

## 🔒 Security Notes

- JWT-based authentication is implemented at the API Gateway.
- Guards and roles are applied for route-level protection.
- Sensitive environment variables are managed via `.env` and **never** committed.

---

## 🚀 Future Improvements

- Add **Redis** for caching frequently accessed resources.

---

## 👨‍💻 Author

**Gabriel Nonso** — Full Stack Engineer  
GitHub: [@GabrielNonso](https://github.com/Gabrielonso)  
LinkedIn: [linkedin.com/in/yourprofile](https://www.linkedin.com/in/gabriel-nonso-onyeaka/)

---

## 📄 License

This project is licensed under the MIT License.
