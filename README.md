# Inventory Management System

This is a full-stack inventory management application.

## Prerequisites

- [Docker](https.docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Build the Docker images

This command will build the Docker image for the application service based on the `Dockerfile`.

```bash
docker-compose build
```

### 3. Start the services

This command will start the application and the PostgreSQL database containers.

```bash
docker-compose up -d
```

The `-d` flag runs the containers in detached mode, so you can continue to use your terminal.

The application will be available at [http://localhost:5000](http://localhost:5000).

### 4. Apply database migrations

After starting the services for the first time, you need to apply the database schema.

```bash
docker-compose exec app npm run db:push
```

This command executes the `npm run db:push` script inside the `app` container, which will synchronize the database schema with your Drizzle ORM schema definitions.

## Day-to-Day Commands

### Starting the application

```bash
docker-compose up -d
```

### Stopping the application

```bash
docker-compose down
```

### Viewing logs

To view the logs from the application and database containers:

```bash
docker-compose logs -f
```

To view the logs for a specific service:

```bash
docker-compose logs -f app
# or
docker-compose logs -f db
```

### Running commands inside the app container

You can run any command inside the `app` container using `docker-compose exec app <command>`.

For example, to open a shell inside the container:

```bash
docker-compose exec app sh
```
