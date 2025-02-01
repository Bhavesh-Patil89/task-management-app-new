import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Task Management';

  constructor(private snackBar: MatSnackBar) {}

  openNewTaskDialog(): void {
    // Scroll to the add task form
    const addTaskForm = document.querySelector('.add-task-form');
    if (addTaskForm) {
      addTaskForm.scrollIntoView({ behavior: 'smooth' });
    }
  }

  showMyTasks(): void {
    this.snackBar.open('Showing all your tasks', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
