# Logistics Route Optimization System

A scalable logistics route optimization backend system built using Node.js, Express.js, MongoDB, and Redis.

The system models delivery hubs and routes as a weighted graph and provides optimized delivery path computation, dynamic route recalculation, cycle detection, analytics, and real-time operational route management.

A minimal React dashboard has also been included for testing and demonstrating the APIs and system behavior.

---

# Features

## Route Optimization
- Calculates the most efficient delivery path between hubs
- Considers:
  - Distance
  - Travel Time
  - Fuel Cost
  - Traffic Conditions
  - Blocked Routes
- Uses Dijkstra’s shortest path algorithm for weighted graph traversal

---

## Dynamic Route Recalculation
- Supports:
  - Traffic updates
  - Route blocking/unblocking
- Automatically invalidates cached graph data
- Recomputes optimized routes dynamically

---

## Circular Route Detection
- Detects cyclic dependencies in route networks

Example:

```txt
A → B → C → A
```

- Implemented using DFS recursion stack traversal

---

## Fastest Route Analytics
- Retrieves Top 5 fastest available delivery routes
- Optimized using indexed queries and sorting

---

## Security
- JWT Authentication
- Role-based Authorization
- Request Validation using Joi
- Protected API routes
- Environment-based configuration

---

## Scalability Considerations
- Redis graph caching
- Event-driven cache invalidation
- Modular service-based architecture
- Indexed MongoDB queries
- Stateless API design

---

# Tech Stack

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis

## Security & Validation
- JWT
- Joi

---

# System Architecture

```txt
Client
   ↓
API Layer (Express)
   ↓
Controllers
   ↓
Services
   ↓
Graph Engine
   ↓
MongoDB / Redis
```

---

# Route Optimization Strategy

Routes are internally modeled as a weighted directed graph.

Each hub represents a node.

Each route represents an edge containing:
- Distance
- Travel Time
- Fuel Cost
- Traffic Conditions
- Availability

The optimized route is calculated using Dijkstra’s Algorithm with a composite weighted cost formula.

---

# Cost Formula

```txt
weight =
(distance * 0.4) +
(travelTime * 0.3) +
(fuelCost * 0.2) +
(trafficPenalty * 0.1)
```

Traffic Penalty:
- LOW → 1
- MEDIUM → 5
- HIGH → 10

Blocked routes are excluded during graph generation.

---

# Project Structure

```txt
src/
 ├── config/
 ├── middleware/
 ├── models/
 ├── modules/
 │    ├── analytics/
 │    ├── auth/
 │    ├── hubs/
 │    └── routes/
 │
 ├── services/
 │    ├── graph/
 │    └── routeEngine/
 │
 ├── validations/
 ├── utils/
 ├── app.js
 └── server.js
```

---

# API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

---

## Hubs

### Create Hub

```http
POST /api/hubs
```

### Get All Hubs

```http
GET /api/hubs
```

---

## Routes

### Create Route

```http
POST /api/routes
```

### Get All Routes

```http
GET /api/routes
```

### Optimize Route

```http
POST /api/routes/optimize
```

Request:

```json
{
  "start": "hubId",
  "end": "hubId"
}
```

---

### Update Traffic

```http
PATCH /api/routes/:id/traffic
```

---

### Block / Unblock Route

```http
PATCH /api/routes/:id/block
```

---

### Detect Cycles

```http
GET /api/routes/cycles
```

---

## Analytics

### Top 5 Fastest Routes

```http
GET /api/analytics/fastest-routes
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/logistics_db

JWT_SECRET=your_jwt_secret
```

---

# Installation & Setup

## Backend Setup

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

## Frontend Setup

Navigate to frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

---

# Redis Setup

Start Redis locally:

```bash
redis-server
```

Redis is used for:
- Graph caching
- Faster route retrieval
- Dynamic cache invalidation

---

# Production Readiness Considerations

## Database Optimization
- Indexed route queries
- Lean MongoDB reads
- Graph caching with Redis

---

## Scalability
- Stateless API architecture
- Horizontal scaling support
- Queue-system ready design

---

## Queue & Background Jobs

For large-scale systems:
- BullMQ / RabbitMQ can be integrated
- Route recomputation can be offloaded to background workers

---

## Monitoring

Can be extended using:
- Winston / Pino logging
- Prometheus
- Grafana

---

# Tradeoffs & Assumptions

- Route recalculation is currently synchronous
- Graph rebuild occurs on route updates
- Simplified event-driven recalculation implemented using EventEmitter
- Minimal frontend included for operational testing

---

# Future Improvements

- Real-time WebSocket updates
- Kubernetes deployment
- Advanced graph optimization algorithms
- Geo-spatial route visualization
- Distributed queue processing
- AI-based traffic prediction

---

# Author

Mary Metilda