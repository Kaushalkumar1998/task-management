# Task Management

MEAN stack task management application with separate Angular frontend and
Node.js API folders.

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
