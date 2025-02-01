import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  displayedColumns: string[] = ['title', 'description', 'status', 'actions'];

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log('TaskListComponent initialized');
    this.loadTasks();
  }

  loadTasks(): void {
    console.log('Loading tasks...');
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        console.log('Tasks received:', tasks);
        this.tasks = [...tasks];
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.showSnackBar('Error loading tasks');
      }
    });
  }

  getPendingTasksCount(): number {
    return this.tasks.filter(task => !task.completed).length;
  }

  getCompletedTasksCount(): number {
    return this.tasks.filter(task => task.completed).length;
  }

  openTaskDialog(task?: Task): void {
    console.log('Opening task dialog with task:', task);
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '500px',
      data: task ? { ...task } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result) {
        if (result.id) {
          this.updateTask(result);
        } else {
          this.createTask(result);
        }
      }
    });
  }

  createTask(task: Partial<Task>): void {
    console.log('Creating task:', task);
    this.taskService.createTask(task).subscribe({
      next: (newTask) => {
        console.log('Task created:', newTask);
        this.tasks = [...this.tasks, newTask];
        this.showSnackBar('Task created successfully');
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.showSnackBar('Error creating task');
      }
    });
  }

  updateTask(task: Task): void {
    console.log('Updating task:', task);
    this.taskService.updateTask(task.id, task).subscribe({
      next: (updatedTask) => {
        console.log('Task updated:', updatedTask);
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks = [
            ...this.tasks.slice(0, index),
            updatedTask,
            ...this.tasks.slice(index + 1)
          ];
        }
        this.showSnackBar('Task updated successfully');
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.showSnackBar('Error updating task');
      }
    });
  }

  deleteTask(task: Task): void {
    console.log('Deleting task:', task);
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          console.log('Task deleted:', task.id);
          this.tasks = this.tasks.filter(t => t.id !== task.id);
          this.showSnackBar('Task deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.showSnackBar('Error deleting task');
        }
      });
    }
  }

  toggleTaskStatus(task: Task): void {
    console.log('Toggling task status:', task);
    const updatedTask = { ...task, completed: !task.completed };
    this.updateTask(updatedTask);
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
