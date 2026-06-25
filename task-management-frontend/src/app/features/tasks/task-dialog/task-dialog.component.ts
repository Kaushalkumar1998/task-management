import { CommonModule } from '@angular/common';
import { Component, Inject, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Task, TaskStatus, User } from '../../../core/api.models';
import { TaskFormPayload } from '../../../core/task.service';

export interface TaskDialogData {
  task?: Task;
  users: User[];
  canAssign: boolean;
}

@Component({
  selector: 'app-task-dialog',
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
  templateUrl: './task-dialog.component.html',
})
export class TaskDialogComponent {
  readonly isEdit = computed(() => Boolean(this.data.task));

  readonly form = this.fb.nonNullable.group({
    title: [
      this.data.task?.title || '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(120)],
    ],
    description: [this.data.task?.description || '', [Validators.maxLength(2000)]],
    status: [(this.data.task?.status || 'PENDING') as TaskStatus, [Validators.required]],
    assignedTo: [this.getUserId(this.data.task?.assignedTo)],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<TaskDialogComponent, TaskFormPayload>,
    @Inject(MAT_DIALOG_DATA) readonly data: TaskDialogData,
  ) {}

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: TaskFormPayload = {
      title: value.title,
      description: value.description,
      status: value.status,
    };

    if (this.data.canAssign && value.assignedTo) {
      payload.assignedTo = value.assignedTo;
    }

    this.dialogRef.close(payload);
  }

  getUserId(user: User | null | undefined): string {
    return user?._id || user?.id || user?.userId || '';
  }
}
