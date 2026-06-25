import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse, Task, TaskStatus } from './api.models';
import { PathConfig } from './path.config';

export interface TaskFormPayload {
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo?: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private readonly http: HttpClient) {}

  getTasks(status: TaskStatus | 'ALL' = 'ALL'): Observable<ApiResponse<PaginatedResponse<Task>>> {
    let params = new HttpParams().set('page', 1).set('limit', 50);

    if (status !== 'ALL') {
      params = params.set('status', status);
    }

    return this.http.get<ApiResponse<PaginatedResponse<Task>>>(PathConfig.TASKS, { params });
  }

  createTask(payload: TaskFormPayload): Observable<ApiResponse<Task>> {
    return this.http.post<ApiResponse<Task>>(PathConfig.TASKS, payload);
  }

  updateTask(taskId: string, payload: Partial<TaskFormPayload>): Observable<ApiResponse<Task>> {
    return this.http.patch<ApiResponse<Task>>(`${PathConfig.TASK_BY_ID}/${taskId}`, payload);
  }

  deleteTask(taskId: string): Observable<ApiResponse<{ taskId: string }>> {
    return this.http.delete<ApiResponse<{ taskId: string }>>(`${PathConfig.TASK_BY_ID}/${taskId}`);
  }
}
