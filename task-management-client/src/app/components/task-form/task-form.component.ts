import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../models/task.model';

@Component({
    selector: 'app-task-form',
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
    taskForm: FormGroup;
    priorities = ['low', 'medium', 'high'];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<TaskFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Task
    ) {
        this.taskForm = this.fb.group({
            id: [data.id],
            title: [data.title || '', [Validators.required]],
            description: [data.description || '', [Validators.required]],
            priority: [data.priority || 'medium', [Validators.required]],
            completed: [data.completed || false]
        });
    }

    onSubmit(): void {
        if (this.taskForm.valid) {
            this.dialogRef.close(this.taskForm.value);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
