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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/auth.service';
import { User } from '../../core/api.models';
import { UserService } from '../../core/user.service';
import { DashboardLayoutComponent } from '../../shared/dashboard-layout.component';
import { UserDialogComponent, UserFormPayload } from './users-dialog/user-dialog.component';

@Component({
  selector: 'app-users',
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
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort) set sort(sort: MatSort | undefined) {
    if (sort) this.dataSource.sort = sort;
  }

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly user = computed(() => this.authService.currentUser());
  readonly canCreateUser = computed(() => ['MANAGER', 'TEAM_LEAD'].includes(this.user()?.role || ''));
  readonly displayedColumns = ['username', 'email', 'role', 'teamLead', 'createdAt', 'actions'];
  readonly dataSource = new MatTableDataSource<User>([]);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly dialog: MatDialog,
  ) {
    this.dataSource.filterPredicate = (user, filter) => {
      const search = filter.trim().toLowerCase();
      return [user.username, user.email, user.role, user.firstName, user.lastName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(search);
    };
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userService.getUsers().subscribe({
      next: (response) => {
        this.dataSource.data = response.data.items;
        this.dataSource.paginator?.firstPage();
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Unable to load users');
        this.isLoading.set(false);
      },
    });
  }

  applySearch(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  openUserDialog(user?: User): void {
    if (!this.user()?.role) return;
    if (!user && !this.canCreateUser()) return;
    if (user && !this.canEditUser(user)) return;

    const teamLeads = this.dataSource.data.filter((user) => user.role === 'TEAM_LEAD');
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '620px',
      maxWidth: 'calc(100vw - 32px)',
      data: {
        user,
        currentUserRole: this.user()?.role,
        teamLeads,
      },
    });

    dialogRef.afterClosed().subscribe((payload?: UserFormPayload) => {
      if (!payload) return;

      const request = user
        ? this.userService.updateUser(this.getUserId(user), payload)
        : this.userService.createUser(payload);

      request.subscribe({
        next: (response) => {
          if (user && this.getUserId(user) === this.getUserId(this.user()!)) {
            this.authService.updateCurrentUser(response.data);
          }

          this.loadUsers();
        },
        error: (error) => this.errorMessage.set(error.error?.message || 'Unable to save user'),
      });
    });
  }

  deleteUser(user: User): void {
    if (!this.canDeleteUser(user)) return;

    this.userService.deleteUser(this.getUserId(user)).subscribe({
      next: () => this.loadUsers(),
      error: (error) => this.errorMessage.set(error.error?.message || 'Unable to delete user'),
    });
  }

  canEditUser(targetUser: User): boolean {
    const currentUser = this.user();

    if (!currentUser) return false;
    if (currentUser.role === 'MANAGER') return true;
    if (currentUser.role === 'TEAM_LEAD') {
      return targetUser.role === 'EMPLOYEE' && String(targetUser.teamLeadId) === this.getUserId(currentUser);
    }

    return this.getUserId(targetUser) === this.getUserId(currentUser);
  }

  canDeleteUser(targetUser: User): boolean {
    return this.user()?.role === 'MANAGER' && targetUser.role !== 'MANAGER';
  }

  getUserId(user: User): string {
    return user._id || user.id || user.userId || '';
  }
}
