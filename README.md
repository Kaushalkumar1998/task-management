# Task Management

MEAN stack task management application with separate Angular frontend and
Node.js API folders.

## Project Structure

```text
task-management/
|-- task-management-backend/
|-- task-management-frontend/
`-- render.yaml
```

## Prerequisites

- Node.js 20 or later
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Kaushalkumar1998/task-management.git
cd task-management
```

### 2. Configure and run the backend

```bash
cd task-management-backend
npm install
```

Create a `.env` file in `task-management-backend` using `.env.example`:

```env
MONGO_URI=mongodb://localhost:27017/task-management
PORT=3000
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:4200
```

For MongoDB Atlas, replace `MONGO_URI` with the Atlas connection string:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/task-management
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:3000/api`.

Health check:

```text
http://localhost:3000/api/health
```

The first backend startup automatically creates a default manager when no
manager exists:

```text
Email: kaushal@gmail.com
Password: admin@123
```

### 3. Configure and run the frontend

Open another terminal:

```bash
cd task-management/task-management-frontend
npm install
npm start
```

The frontend development environment is already configured to use:

```text
http://localhost:3000/api
```

Open `http://localhost:4200` in the browser.

## Production Build

Build the Angular frontend:

```bash
cd task-management-frontend
npm run build
```

Run the backend without Nodemon:

```bash
cd task-management-backend
npm start
```

## Free Demo Deployment

The repository includes a Render Blueprint that deploys:

- Angular as a free Render Static Site
- Node.js/Express as a free Render Web Service
- MongoDB using a MongoDB Atlas M0 free cluster

### 1. Create MongoDB Atlas

1. Create an M0 free cluster.
2. Create a database user.
3. Allow network access from `0.0.0.0/0` for the demo.
4. Copy the Node.js connection string and set the database name to
   `task-management`.

### 2. Deploy on Render

1. Push the latest code to GitHub.
2. In Render, select **New > Blueprint**.
3. Connect the `Kaushalkumar1998/task-management` repository.
4. Render reads `render.yaml` and creates both services.
5. Enter the Atlas connection string when Render requests `MONGO_URI`.

Frontend:
`https://kaushal-task-management.onrender.com`

Backend health check:
`https://kaushal-task-management-api.onrender.com/api/health`

The free backend sleeps after 15 minutes without traffic, so its first request
after being idle can take about one minute.
