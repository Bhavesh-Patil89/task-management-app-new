import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  animations: [
    trigger('taskAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  editingTask: Task | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  newTask: Task = {
    id: '',
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: new Date(),
    completed: false
  };

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = this.taskService.sortTasksByPriority(tasks);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
        this.showSnackBar('Failed to load tasks');
      }
    });
  }

  addTask(form: NgForm): void {
    if (form.invalid) {
      console.error('Form is invalid', form);
      return;
    }

    console.log('Attempting to create task:', this.newTask);

    this.taskService.createTask(this.newTask).subscribe({
      next: (task) => {
        console.log('Task created successfully:', task);
        this.tasks.push(task);
        this.tasks = this.taskService.sortTasksByPriority(this.tasks);
        this.showSnackBar('Task added successfully');
        form.resetForm();
        this.resetNewTask();
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.showSnackBar(error.message || 'Failed to create task');
      }
    });
  }

  editTask(task: Task): void {
    this.editingTask = { ...task };
  }

  updateTask(): void {
    if (!this.editingTask) return;

    this.taskService.updateTask(this.editingTask).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
          this.tasks = this.taskService.sortTasksByPriority(this.tasks);
        }
        this.cancelEdit();
        this.showSnackBar('Task updated successfully');
      },
      error: (error) => {
        this.showSnackBar(error.message);
      }
    });
  }

  cancelEdit(): void {
    this.editingTask = null;
  }

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: (deletedTask) => {
          this.tasks = this.tasks.filter(task => task.id !== deletedTask.id);
          this.showSnackBar('Task deleted successfully');
        },
        error: (error) => {
          this.showSnackBar(error.message);
        }
      });
    }
  }

  toggleTaskCompletion(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.updateTask(updatedTask).subscribe({
      next: (updated) => {
        const index = this.tasks.findIndex(t => t.id === updated.id);
        if (index !== -1) {
          this.tasks[index] = updated;
        }
        this.showSnackBar(`Task marked as ${updated.completed ? 'completed' : 'incomplete'}`);
      },
      error: (error) => {
        this.showSnackBar(error.message);
      }
    });
  }

  private resetNewTask(): void {
    this.newTask = {
      id: '',
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: new Date(),
      completed: false
    };
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  // Utility methods for template
  getTaskCount(): number {
    return this.tasks.length;
  }

  getCompletedTaskCount(): number {
    return this.tasks.filter(task => task.completed).length;
  }
}