import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Role, User } from '../../../core/api.models';

export interface UserDialogData {
  user?: User;
  currentUserRole: Role;
  teamLeads: User[];
}

export interface UserFormPayload {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  teamLeadId?: string;
}

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './user-dialog.component.html',
})
export class UserDialogComponent {
  readonly roleOptions: Array<{ label: string; value: Role }> =
    this.data.currentUserRole === 'MANAGER'
      ? [
          { label: 'Manager', value: 'MANAGER' },
          { label: 'Team Lead', value: 'TEAM_LEAD' },
          { label: 'Employee', value: 'EMPLOYEE' },
        ]
      : [{ label: 'Employee', value: 'EMPLOYEE' }];

  readonly form = this.fb.nonNullable.group({
    firstName: [this.data.user?.firstName || ''],
    lastName: [this.data.user?.lastName || ''],
    username: [
      this.data.user?.username || '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(40)],
    ],
    email: [this.data.user?.email || '', [Validators.required, Validators.email]],
    password: ['', this.data.user ? [] : [Validators.required, Validators.minLength(8)]],
    role: [this.getInitialRole(), [Validators.required]],
    teamLeadId: [this.data.user?.teamLeadId || ''],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<UserDialogComponent, UserFormPayload>,
    @Inject(MAT_DIALOG_DATA) readonly data: UserDialogData,
  ) {}

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: UserFormPayload = {
      username: value.username,
      email: value.email,
      password: value.password,
      firstName: value.firstName,
      lastName: value.lastName,
      role: value.role,
    };

    if (this.data.user) {
      delete (payload as Partial<UserFormPayload>).password;
    }

    if (value.role === 'EMPLOYEE' && value.teamLeadId) {
      payload.teamLeadId = value.teamLeadId;
    }

    this.dialogRef.close(payload);
  }

  getUserId(user: User): string {
    return user._id || user.id || user.userId || '';
  }

  private getInitialRole(): Role {
    if (this.data.user?.role) {
      return this.data.user.role;
    }

    return this.roleOptions[0].value;
  }
}
