import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Task, TaskService } from '../services/task.service';
import { TaskFormComponent } from './task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  template: `
    <div class="mb-3 text-end">
      <button class="btn btn-primary" (click)="showForm()">Nova Tarefa</button>
    </div>

    <div *ngIf="showTaskForm" class="mb-4 p-3 border rounded bg-light">
      <app-task-form
        [task]="selectedTask"
        (save)="onSave($event)"
        (cancel)="onCancel()"
      >
      </app-task-form>
    </div>

    <ul class="list-group">
      <li
        *ngFor="let task of tasks"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <span
            [ngClass]="getPriorityBadge(task.priority)"
            class="badge me-2"
            >{{ task.priority }}</span
          >
          <strong [class.text-decoration-line-through]="task.completed">{{
            task.title
          }}</strong>
          <small class="text-muted d-block">{{
            task.completed ? 'Concluída' : 'Aberta'
          }}</small>
        </div>
        <div>
          <button
            class="btn btn-sm btn-outline-secondary me-2"
            (click)="editTask(task)"
          >
            Editar
          </button>
          <button
            class="btn btn-sm btn-outline-danger me-2"
            (click)="deleteTask(task)"
          >
            Excluir
          </button>
          <button
            *ngIf="!task.completed"
            class="btn btn-sm btn-success"
            (click)="markCompleted(task)"
          >
            Concluir
          </button>
        </div>
      </li>
    </ul>
  `,
})
export class TaskListComponent {
  tasks: Task[] = [];
  showTaskForm = false;
  selectedTask: Task | null = null;

  constructor(private taskService: TaskService) {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks = this.taskService.getTasks();
  }

  showForm() {
    this.selectedTask = null;
    this.showTaskForm = true;
  }

  editTask(task: Task) {
    this.selectedTask = { ...task };
    this.showTaskForm = true;
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task.id);
    this.loadTasks();
  }

  markCompleted(task: Task) {
    this.taskService.updateTask({ ...task, completed: true });
    this.loadTasks();
  }

  onSave(task: Task) {
    if (task.id) {
      this.taskService.updateTask(task);
    } else {
      this.taskService.addTask(task);
    }
    this.loadTasks();
    this.showTaskForm = false;
  }

  onCancel() {
    this.showTaskForm = false;
  }

  getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'alta':
        return 'red';
      case 'media':
        return 'orange';
      case 'baixa':
        return 'green';
      default:
        return 'black';
    }
  }

  getPriorityBadge(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'alta':
        return 'bg-danger';
      case 'media':
        return 'bg-warning text-dark';
      case 'baixa':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }
}
