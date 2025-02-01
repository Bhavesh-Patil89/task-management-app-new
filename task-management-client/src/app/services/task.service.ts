
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Task } from '../models/task';
import { environment } from '../../environments/environment';
import { v4 as uuidv4 } from 'uuid';

interface ApiResponse<T> {
  data?: T;
  errors?: string[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client error:', error.error.message);
    } else {
      // Server-side error
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`
      );
    }
    
    // Return user-friendly error message
    return throwError(() => new Error(
      error.error?.errors?.[0] || 
      'Something went wrong. Please try again later.'
    ));
  }

  // Get all tasks
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`).pipe(
      catchError(this.handleError)
    );
  }

  // Create a new task
  createTask(task: Partial<Task>): Observable<Task> {
    // Generate an ID if not present
    const taskToSend = {
      ...task,
      id: task.id || uuidv4(),
      createdAt: new Date(),
      completed: false
    };

    return this.http.post<Task>(`${this.apiUrl}/tasks`, taskToSend).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing task
  updateTask(task: Task): Observable<Task> {
    // Generate an ID if not present
    const taskToUpdate = {
      ...task,
      id: task.id || uuidv4(),
      updatedAt: new Date()
    };

    return this.http.put<Task>(`${this.apiUrl}/tasks/${taskToUpdate.id}`, taskToUpdate).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a task
  deleteTask(taskId: string): Observable<Task> {
    return this.http.delete<Task>(`${this.apiUrl}/tasks/${taskId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Additional utility methods
  sortTasksByPriority(tasks: Task[]): Task[] {
    const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
    return tasks.sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }

  filterCompletedTasks(tasks: Task[]): Task[] {
    return tasks.filter(task => !task.completed);
  }
}
   