# The Aether Server

## Features
- **Asynchronous WebRTC Signaling**: WebSocket-based SDP offer/answer exchange and real-time input control.
- **Distributed Redis Pub/Sub**: Horizontal multi-instance scalability across server clusters via Redis channels (`/v2/landlord/ws` and `/v2/clients/ws`).
- **In-Memory Fallback Mode**: Single-instance development mode (`/v1/landlord/ws` and `/v1/clients/ws`).
- **PostgreSQL Database**: Async SQLAlchemy + asyncpg with automated session cost calculation triggers.
- **Authentication**: JWT verification, password hashing, and GitHub OAuth support.

## Usage

### 1. Install Dependencies

```sh
$ python -m pip install -r requirements.txt
```

### 2. Environment Configuration (.env)

Make sure your `.env` file looks something like this:
```ini
# PostgreSQL
DB_NAME=aether
DB_USER=root
DB_PASSWORD=secret
DB_HOST=localhost
DB_PORT=5432
USE_DATABASE=1

# Redis Pub/Sub (for distributed signaling)
USE_REDIS=1
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# GitHub OAuth
GITHUB_CLIENT_SECRET="client536secret163githubf96"
GITHUB_CLIENT_ID="IvixUGITUHB_CLIENT_IDXE"

# JWT
JWT_SECRET="secret_is_i_love_you_secretly"
JWT_EXPIRY=120 # minutes
```

### 3. Run via Docker Compose (Recommended)

Start PostgreSQL, Redis, and the Aether Server together:
```sh
$ docker compose up --build
```

### 4. Run Manually

Start PostgreSQL & Redis:
```sh
docker run -d --name aether-postgres -p 5432:5432 -e POSTGRES_PASSWORD=secret -e POSTGRES_USER=root -e POSTGRES_DB=aether postgres:14-alpine
docker run -d --name aether-redis -p 6379:6379 redis:7-alpine
```

Start the Web Server:
```sh
$ python -m aiohttp.web -H 0.0.0.0 -P 7878 aether_server:create_app
```
