import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form-dialog',
  templateUrl: './task-form-dialog.component.html',
  styleUrls: ['./task-form-dialog.component.scss']
})
export class TaskFormDialogComponent {
  taskForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Task>
  ) {
    this.isEditMode = !!data.id;
    this.taskForm = this.fb.group({
      title: [data.title || '', [Validators.required, Validators.minLength(3)]],
      description: [data.description || '', [Validators.required, Validators.minLength(5)]],
      completed: [data.completed || false]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const task = {
        ...this.data,
        ...this.taskForm.value
      };
      this.dialogRef.close(task);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
