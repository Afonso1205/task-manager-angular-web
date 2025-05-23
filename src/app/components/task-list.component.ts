import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, TaskService } from '../services/task.service';
import { TaskFormComponent } from './task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, FormsModule],
  template: `
    <div class="container mt-5">
      <div class="card shadow">
        <div
          class="card-header d-flex justify-content-between align-items-center"
        >
          <h5 class="mb-0">Minhas Tarefas</h5>
          <button class="btn btn-sm btn-primary" (click)="showForm()">
            Nova Tarefa
          </button>
        </div>

        <div class="card-body">
          <!-- Filtros -->
          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label">Prioridade</label>
              <select
                class="form-select"
                [(ngModel)]="priorityFilter"
                (change)="applyFilters()"
              >
                <option [value]="undefined">Todas</option>
                <option value="3">Alta</option>
                <option value="2">Média</option>
                <option value="1">Baixa</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Status</label>
              <select
                class="form-select"
                [(ngModel)]="completedFilter"
                (change)="applyFilters()"
              >
                <option [value]="undefined">Todas</option>
                <option value="false">Abertas</option>
                <option value="true">Concluídas</option>
              </select>
            </div>
            <div class="col-md-4 d-flex align-items-end">
              <button
                class="btn btn-outline-secondary"
                (click)="clearFilters()"
              >
                Limpar Filtros
              </button>
            </div>
          </div>

          <div *ngIf="showTaskForm" class="mb-4">
            <app-task-form
              [task]="selectedTask"
              (save)="onSave($event)"
              (cancel)="onCancel()"
            ></app-task-form>
          </div>

          <ul class="list-group">
            <li
              *ngFor="let task of tasks"
              class="list-group-item d-flex justify-content-between align-items-start"
            >
              <div class="ms-2 me-auto">
                <div class="fw-bold">
                  <span class="badge" [class]="getPriorityBadge(task.priority)">
                    {{ getPriorityText(task.priority) }}
                  </span>
                  <span [class.text-decoration-line-through]="task.isCompleted">
                    {{ task.title }}
                  </span>
                </div>
                <small class="text-muted">{{ task.description }}</small>
                <br />
                <small class="text-muted">{{
                  task.isCompleted ? 'Concluída' : 'Aberta'
                }}</small>
              </div>
              <div class="d-flex gap-2">
                <button
                  class="btn btn-sm btn-outline-secondary"
                  (click)="editTask(task)"
                >
                  Editar
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  (click)="deleteTask(task)"
                >
                  Excluir
                </button>
                <button
                  *ngIf="!task.isCompleted"
                  class="btn btn-sm btn-success"
                  (click)="markCompleted(task)"
                >
                  Concluir
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class TaskListComponent {
  tasks: Task[] = [];
  showTaskForm = false;
  selectedTask: Task | null = null;
  priorityFilter?: number;
  completedFilter?: boolean;

  constructor(private readonly taskService: TaskService) {
    this.loadTasks();
  }

  loadTasks() {
    const filter = {
      completed: this.completedFilter,
      priority: this.priorityFilter,
    };

    this.taskService.getTasks(filter).subscribe({
      next: (tasks) => (this.tasks = tasks),
      error: (err) => console.error('Erro ao carregar tarefas', err),
    });
  }

  applyFilters() {
    this.loadTasks();
  }

  clearFilters() {
    this.priorityFilter = undefined;
    this.completedFilter = undefined;
    this.loadTasks();
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
    this.taskService.deleteTask(task.id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erro ao excluir tarefa', err),
    });
  }

  markCompleted(task: Task) {
    this.taskService.markAsCompleted(task).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erro ao marcar como concluída', err),
    });
  }

  onSave(task: Task) {
    const operation = task.id
      ? this.taskService.updateTask(task)
      : this.taskService.addTask(task);

    operation.subscribe({
      next: () => {
        this.loadTasks();
        this.showTaskForm = false;
      },
      error: (err) => console.error('Erro ao salvar tarefa', err),
    });
  }

  onCancel() {
    this.showTaskForm = false;
  }

  getPriorityColor(priority: number): string {
    switch (priority) {
      case 3:
        return 'red';
      case 2:
        return 'orange';
      case 1:
        return 'green';
      default:
        return 'black';
    }
  }

  getPriorityBadge(priority: number): string {
    switch (priority) {
      case 3:
        return 'bg-danger';
      case 2:
        return 'bg-warning text-dark';
      case 1:
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  getPriorityText(priority: number): string {
    switch (priority) {
      case 3:
        return 'Alta';
      case 2:
        return 'Média';
      case 1:
        return 'Baixa';
      default:
        return '';
    }
  }
}
