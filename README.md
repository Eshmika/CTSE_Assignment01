# CTSE_Assignment01

Food ordering microservices system built with Spring Boot, Spring Cloud, MongoDB, Maven, and Docker.

## System Overview

This project is organized as five Java 17 microservices:

| Service | Port | Frameworks and Libraries | Database |
| --- | --- | --- | --- |
| API Gateway | 8080 | Spring Boot 3.2.5, Spring WebFlux, Spring Cloud Gateway, Spring Security, JWT, Bucket4j, Springdoc OpenAPI | None |
| Auth Service | 8081 | Spring Boot 4.0.3, Spring Web MVC, Spring Security, Spring Data MongoDB, JWT, Springdoc OpenAPI | MongoDB `authdb` |
| Catalog Service | 8082 | Spring Boot 4.0.3, Spring Web MVC, Spring Security, Spring Data MongoDB, Springdoc OpenAPI | MongoDB `catalogdb` |
| Order Service | 8083 | Spring Boot 3.2.5, Spring Web MVC, Spring Security, Spring Data MongoDB, Spring Cloud OpenFeign, Resilience4j, Springdoc OpenAPI | MongoDB `orderdb` |
| Payment Service | 8084 | Spring Boot 3.2.5, Spring Web MVC, Spring Security, Spring Data MongoDB, Spring Cloud OpenFeign, Resilience4j, Springdoc OpenAPI | MongoDB `paymentdb` |

The services use a shared MongoDB cluster with separate databases per bounded context.

## Microservice Integration

The services communicate in the following way:

1. Clients should call the system through the API Gateway on port `8080`.
2. The API Gateway validates JWT tokens for protected routes.
3. After successful JWT validation, the gateway forwards identity headers to downstream services:
	 - `X-User-Id`
	 - `X-Username`
	 - `X-User-Roles`
4. Order Service calls Catalog Service through OpenFeign to load item details.
5. Payment Service calls Order Service through OpenFeign to update order status after payment.
6. Auth Service is responsible for authentication, token validation, user profile management, and admin user management.

## API Gateway Endpoints

Base URL: `http://localhost:8080`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/` | Public | Gateway service info and route summary |
| GET | `/health` | Public | Gateway health check |
| ANY | `/auth/**` | Mixed | Routes to Auth Service |
| ANY | `/catalog/**` | Catalog reads public, writes protected | Routes to Catalog Service |
| ANY | `/orders/**` | Protected | Routes to Order Service |
| ANY | `/payments/**` | Protected | Routes to Payment Service |
| GET | `/actuator/health` | Public | Gateway actuator health |
| GET | `/swagger-ui.html` | Public | Aggregated Swagger UI |
| GET | `/v3/api-docs` | Public | Gateway OpenAPI document |

## Auth Service Endpoints

Gateway base URL: `http://localhost:8080/auth`

Direct service base URL: `http://localhost:8081/auth`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/login` | Public | User login |
| POST | `/register` | Public | User registration |
| POST | `/refresh` | Public | Refresh access token |
| POST | `/logout` | Public in current configuration | Logout using refresh token payload |
| POST | `/change-password` | Authenticated | Change current user password |
| POST | `/forgot-password` | Public | Generate password reset token |
| POST | `/reset-password` | Public | Reset password using reset token |
| POST | `/validate` | Public | Validate JWT token |
| GET | `/health` | Public | Auth service health check |
| GET | `/users/me` | Authenticated | Get current user profile |
| PUT | `/users/profile` | Authenticated | Update current user profile |
| POST | `/users/addresses` | Authenticated | Add an address for current user |
| GET | `/users/addresses` | Authenticated | List current user addresses |
| PUT | `/users/addresses/{id}` | Authenticated | Update a user address |
| DELETE | `/users/addresses/{id}` | Authenticated | Delete a user address |
| POST | `/admin/users` | Admin | Create a user as admin |
| GET | `/admin/users` | Admin | List all users |
| GET | `/admin/users/{id}` | Admin | Get user by ID |
| PATCH | `/admin/users/{id}/status` | Admin | Activate or deactivate a user |
| DELETE | `/admin/users/{id}` | Admin | Delete a user |
| GET | `/actuator/health` | Public | Spring Boot actuator health |
| GET | `/swagger-ui.html` | Public | Swagger UI |
| GET | `/v3/api-docs` | Public | OpenAPI document |

## Catalog Service Endpoints

Gateway base URL: `http://localhost:8080/catalog`

Direct service base URL: `http://localhost:8082/catalog`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/items` | Public | Get all menu items |
| GET | `/items/{id}` | Public | Get menu item by ID |
| GET | `/items/category/{category}` | Public | Get menu items by category |
| POST | `/items` | Admin via `X-User-Roles` from gateway | Create a new menu item |
| PATCH | `/items/{id}/availability?availability=AVAILABLE` | Admin via `X-User-Roles` from gateway | Update item availability |
| DELETE | `/items/{id}` | Admin via `X-User-Roles` from gateway | Delete a menu item |
| GET | `/actuator/health` | Public | Spring Boot actuator health |
| GET | `/swagger-ui.html` | Public | Swagger UI |
| GET | `/v3/api-docs` | Public | OpenAPI document |

## Order Service Endpoints

Gateway base URL: `http://localhost:8080/orders`

Direct service base URL: `http://localhost:8083/orders`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/` | Authenticated | Create a new order |
| GET | `/{id}` | Authenticated | Get order by ID |
| GET | `/my` | Authenticated | Get orders for current user |
| PATCH | `/{id}/status?status=PAID` | Authenticated, intended for admin or internal update | Update order status |
| GET | `/actuator/health` | Public | Spring Boot actuator health |
| GET | `/swagger-ui.html` | Public | Swagger UI |
| GET | `/v3/api-docs` | Public | OpenAPI document |

### Order Service Internal Dependency

When an order is created, Order Service uses OpenFeign to call:

- `GET /catalog/items/{id}` on Catalog Service

This is the main catalog lookup used for inter-service integration.

## Payment Service Endpoints

Gateway base URL: `http://localhost:8080/payments`

Direct service base URL: `http://localhost:8084/payments`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/charge` | Authenticated | Process payment for an order |
| GET | `/{orderId}` | Authenticated | Get payment details by order ID |
| GET | `/actuator/health` | Public | Spring Boot actuator health |
| GET | `/swagger-ui.html` | Public | Swagger UI |
| GET | `/v3/api-docs` | Public | OpenAPI document |

### Payment Service Internal Dependency

After payment processing, Payment Service uses OpenFeign to call:

- `PATCH /orders/{id}/status?status=...` on Order Service

## Build and Run with Docker

### Build All Docker Images

```bash
docker compose build
```

### Start the Full System

```bash
docker compose up -d
```

### Watch Logs

```bash
docker compose logs -f
```

### Stop the System

```bash
docker compose down
```

### Rebuild and Restart After Changes

```bash
docker compose up -d --build
```

## Run Without Docker

If you want to run the services directly with Maven, start them in this order:

1. Auth Service
2. Catalog Service
3. Order Service
4. Payment Service
5. API Gateway

Then run this inside each service directory:

```powershell
.\mvnw spring-boot:run
```

## Swagger and Health URLs

Preferred entry point:

- Gateway Swagger UI: `http://localhost:8080/swagger-ui.html`
- Gateway Health: `http://localhost:8080/health`

Direct service Swagger and docs:

- Auth Swagger: `http://localhost:8081/auth/swagger-ui.html`
- Auth OpenAPI: `http://localhost:8081/auth/v3/api-docs`
- Catalog Swagger: `http://localhost:8082/catalog/swagger-ui.html`
- Catalog OpenAPI: `http://localhost:8082/catalog/v3/api-docs`
- Order Swagger: `http://localhost:8083/orders/swagger-ui.html`
- Order OpenAPI: `http://localhost:8083/orders/v3/api-docs`
- Payment Swagger: `http://localhost:8084/payments/swagger-ui.html`
- Payment OpenAPI: `http://localhost:8084/payments/v3/api-docs`

Direct service health endpoints:

- Auth Health: `http://localhost:8081/auth/health`
- Catalog Health: `http://localhost:8082/catalog/actuator/health`
- Order Health: `http://localhost:8083/orders/actuator/health`
- Payment Health: `http://localhost:8084/payments/actuator/health`