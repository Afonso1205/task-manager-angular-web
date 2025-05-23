import { Component } from '@angular/core';
import { TaskListComponent } from './components/task-list.component';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="container mt-4">
      <h1 class="text-center mb-4">Task Manager Angular</h1>
      <app-task-list></app-task-list>
    </div>
  `,
  imports: [TaskListComponent],
  providers: [TaskService],
})
export class AppComponent {}
