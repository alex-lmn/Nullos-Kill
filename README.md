# Real-time Score Project

This project consists of a Next.js frontend and a Nest.js backend, using PostgreSQL and Docker.

## Prerequisites

- Docker and Docker Compose

## Getting Started

1.  Build and start the containers:

    ```bash
    docker-compose up --build
    ```

2.  Access the application:

    -   **Admin Interface:** [http://localhost:3000/admin](http://localhost:3000/admin)
    -   **Stream Interface:** [http://localhost:3000/stream](http://localhost:3000/stream)
    -   **Backend API:** [http://localhost:3001](http://localhost:3001)

## Development

-   The `backend` and `frontend` directories are mounted as volumes, so changes should reflect in real-time (if dev servers are running).
-   To install new dependencies, you may need to rebuild the containers or install them inside the container.

## Features

-   Real-time score updates using WebSockets.
-   Admin panel to control scores.
-   Stream overlay for broadcasting.
-   PostgreSQL database for persistence.
