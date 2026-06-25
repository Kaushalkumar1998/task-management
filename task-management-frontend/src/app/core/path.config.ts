import { environment } from '../../environments/environment';

export class PathConfig {
  public static get API_ENDPOINT(): string {
    return environment.API_URL;
  }

  // Authentication endpoints
  public static readonly AUTH_LOGIN = `${PathConfig.API_ENDPOINT}/auth/login`;
  public static readonly AUTH_REGISTER = `${PathConfig.API_ENDPOINT}/auth/register`;

  // Task endpoints
  public static readonly TASKS = `${PathConfig.API_ENDPOINT}/tasks`;
  public static readonly TASK_BY_ID = `${PathConfig.API_ENDPOINT}/tasks`;

  // User endpoints
  public static readonly USERS = `${PathConfig.API_ENDPOINT}/users`;
  public static readonly USER_BY_ID = `${PathConfig.API_ENDPOINT}/users`;
  public static readonly TEAM_LEAD_TASKS = `${PathConfig.API_ENDPOINT}/users/team-leads/tasks`;
}
