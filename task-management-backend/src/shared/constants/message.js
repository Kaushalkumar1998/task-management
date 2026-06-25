export const MESSAGES = {
  APP: {
    HEALTH_OK: "Task management API is running",
    ROUTE_NOT_FOUND: (method, url) => `Route not found: ${method} ${url}`,
    JWT_SECRET_REQUIRED: "JWT_SECRET is required",
    SERVER_RUNNING: (port) => `Server running on port ${port}`,
    INTERNAL_SERVER_ERROR: "Internal server error",
  },

  DATABASE: {
    CONNECTED: "MongoDB connected successfully",
    CONNECTION_ERROR: "Error connecting to MongoDB:",
  },

  AUTH: {
    TOKEN_REQUIRED: "Authentication token is required",
    USER_NOT_FOUND: "Authenticated user no longer exists",
    INVALID_TOKEN: "Invalid or expired token",
    INVALID_CREDENTIALS: "Invalid credentials",
    LOGGED_OUT: "Logged out successfully",
    PUBLIC_EMPLOYEE_ONLY: "Public registration can only create employee users",
  },

  USER: {
    DUPLICATE: "User already exists with this email or username",
    NOT_FOUND: "User not found",
    TEAM_LEAD_NOT_FOUND: "Team lead not found",
    TEAM_LEAD_CREATE_EMPLOYEE_ONLY: "Team leads can only create employee users",
    CREATE_ALLOWED_FOR_MANAGER_OR_TEAM_LEAD:
      "Only managers and team leads can create users",
    MANAGER_SEEDED_ONLY:
      "Manager users are created only through controlled seeding",
    MANAGER_TEAM_OVERVIEW_ONLY:
      "Only managers can view team lead task overview",
    MANAGER_MODIFY_USERS_ONLY: "Only managers can modify users",
    UPDATE_NOT_ALLOWED: "You are not allowed to update this user",
    DELETE_MANAGER_ONLY: "Only managers can delete users",
    DELETE_NOT_ALLOWED: "You are not allowed to delete this user",
    CANNOT_PROMOTE_TO_MANAGER:
      "Cannot promote users to manager through this endpoint",
    DEFAULT_MANAGER_EXISTS: "Manager already exists",
    DEFAULT_MANAGER_CREATED: "Default Manager Created",
    DEFAULT_MANAGER_SEED_ERROR: "Manager Seeder Error:",
  },

  TASK: {
    ASSIGNEE_NOT_FOUND: "Assignee not found",
    TEAM_LEAD_ASSIGN_SCOPE:
      "Team leads can assign tasks only to self or team members",
    EMPLOYEE_ASSIGN_SELF_ONLY: "Employees can assign tasks only to themselves",
    DELETE_MANAGER_ONLY: "Only managers can delete tasks",
    NOT_FOUND_OR_DENIED: "Task not found or access denied",
  },

  SOCKET: {
    NOT_INITIALIZED: "Socket.IO not initialized",
  },

  RBAC: {
    ACCESS_DENIED: "Access Denied",
  },

  VALIDATION: {
    EMAIL_REQUIRED: "Email is required",
    EMAIL_INVALID: "Invalid email format",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_STRING: "Password must be a string",
    PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
    PASSWORD_UPPERCASE: "Password must contain at least one uppercase letter",
    PASSWORD_LOWERCASE: "Password must contain at least one lowercase letter",
    PASSWORD_NUMBER: "Password must contain at least one number",
    USERNAME_REQUIRED: "Username is required",
    USERNAME_LENGTH: "Username must be between 3 and 40 characters",
    USER_ID_INVALID: "Invalid userId",
    TASK_ID_INVALID: "Invalid taskId",
    ASSIGNED_TO_INVALID: "Invalid assignedTo",
    ROLE_INVALID: "Invalid role",
    STATUS_INVALID: "Invalid task status",
    TEAM_LEAD_ID_INVALID: "Invalid teamLeadId",
    PAGE_INVALID: "Page must be a positive integer",
    LIMIT_INVALID: "Limit must be between 1 and 100",
    TITLE_LENGTH: "Title must be between 3 and 120 characters",
    DESCRIPTION_LENGTH: "Description cannot exceed 2000 characters",
    FIRST_NAME_LENGTH: "First name cannot exceed 60 characters",
    LAST_NAME_LENGTH: "Last name cannot exceed 60 characters",
  },
};
