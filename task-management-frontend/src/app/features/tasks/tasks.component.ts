import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/auth.service';
import { Task, TaskStatus, User } from '../../core/api.models';
import { TaskFormPayload, TaskService } from '../../core/task.service';
import { UserService } from '../../core/user.service';
import { DashboardLayoutComponent } from '../../shared/dashboard-layout.component';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';

const STATUS_OPTIONS: Array<{ label: string; value: TaskStatus | 'ALL' }> = [
  { label: 'All status', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'In progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
];

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayoutComponent,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  @ViewChild(MatSort) set sort(sort: MatSort | undefined) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  readonly statuses = STATUS_OPTIONS;
  readonly users = signal<User[]>([]);
  readonly selectedStatus = signal<TaskStatus | 'ALL'>('ALL');
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly user = computed(() => this.authService.currentUser());
  readonly canDelete = computed(() => this.user()?.role === 'MANAGER');
  readonly canAssign = computed(() => this.user()?.role !== 'EMPLOYEE');
  readonly displayedColumns = ['title', 'status', 'assignedTo', 'createdBy', 'updatedAt', 'actions'];
  readonly dataSource = new MatTableDataSource<Task>([]);

  constructor(
    private readonly authService: AuthService,
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private readonly dialog: MatDialog,
  ) {
    this.dataSource.filterPredicate = (task, filter) => {
      const search = filter.trim().toLowerCase();
      return [
        task.title,
        task.description,
        task.status,
        task.assignedTo?.username,
        task.createdBy?.username,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(search);
    };

    this.dataSource.sortingDataAccessor = (task, column) => {
      if (column === 'assignedTo') return task.assignedTo?.username || '';
      if (column === 'createdBy') return task.createdBy?.username || '';
      if (column === 'updatedAt') return new Date(task.updatedAt).getTime();
      return String(task[column as keyof Task] || '');
    };
  }

  ngOnInit(): void {
    this.loadTasks();
    this.loadAssignableUsers();
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.taskService.getTasks(this.selectedStatus()).subscribe({
      next: (response) => {
        this.dataSource.data = response.data.items;
        this.dataSource.paginator?.firstPage();
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Unable to load tasks');
        this.isLoading.set(false);
      },
    });
  }

  applySearch(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  changeStatus(status: TaskStatus | 'ALL'): void {
    this.selectedStatus.set(status);
    this.loadTasks();
  }

  openTaskDialog(task?: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '560px',
      maxWidth: 'calc(100vw - 32px)',
      data: {
        task,
        users: this.users(),
        canAssign: this.canAssign(),
      },
    });

    dialogRef.afterClosed().subscribe((payload?: TaskFormPayload) => {
      if (!payload) return;

      const request = task
        ? this.taskService.updateTask(task._id, payload)
        : this.taskService.createTask(payload);

      request.subscribe({
        next: () => this.loadTasks(),
        error: (error) => this.errorMessage.set(error.error?.message || 'Unable to save task'),
      });
    });
  }

  deleteTask(task: Task): void {
    if (!this.canDelete()) return;

    this.taskService.deleteTask(task._id).subscribe({
      next: () => this.loadTasks(),
      error: (error) => this.errorMessage.set(error.error?.message || 'Unable to delete task'),
    });
  }

  private loadAssignableUsers(): void {
    if (!this.canAssign()) return;

    this.userService.getAssignableUsers().subscribe({
      next: (users) => this.users.set(users),
      error: () => this.users.set([]),
    });
  }
}
