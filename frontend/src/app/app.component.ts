import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-toolbar mat-elevation-z6">
        <div class="container">
          <div class="d-flex align-items-center">
            <mat-icon class="me-2">check_circle</mat-icon>
            <span class="app-title">Task Master</span>
            <span class="flex-grow-1"></span>
            <button mat-icon-button>
              <mat-icon>notifications</mat-icon>
            </button>
            <button mat-icon-button class="ms-2">
              <mat-icon>account_circle</mat-icon>
            </button>
          </div>
        </div>
      </mat-toolbar>
      
      <div class="content-wrapper">
        <div class="content">
          <app-task-list></app-task-list>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .app-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 0;
      background: linear-gradient(90deg, #2196f3, #1976d2);
    }

    .app-title {
      font-size: 1.5rem;
      font-weight: 300;
      letter-spacing: 1px;
    }

    .content-wrapper {
      margin-top: 64px;
      flex: 1;
      padding: 2rem 0;
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    @media (max-width: 599px) {
      .content-wrapper {
        margin-top: 56px;
        padding: 1rem 0;
      }
    }
  `]
})
export class AppComponent {
  title = 'Task Master';
}
