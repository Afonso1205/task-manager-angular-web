import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="submit()" #taskForm="ngForm" class="row g-3">
      <div class="col-12">
        <label class="form-label">Título</label>
        <input
          type="text"
          [(ngModel)]="taskData.title"
          name="title"
          class="form-control"
          required
        />
      </div>

      <div class="col-12">
        <label class="form-label">Descrição</label>
        <textarea
          [(ngModel)]="taskData.description"
          name="description"
          class="form-control"
          rows="3"
        ></textarea>
      </div>

      <div class="col-md-6">
        <label class="form-label">Prioridade</label>
        <select
          [(ngModel)]="taskData.priority"
          name="priority"
          class="form-select"
          required
        >
          <option value="" disabled>Selecione</option>
          <option value="Alta">Alta</option>
          <option value="Media">Média</option>
          <option value="Baixa">Baixa</option>
        </select>
      </div>

      <div class="col-md-6 d-flex align-items-center">
        <div class="form-check mt-4">
          <input
            type="checkbox"
            [(ngModel)]="taskData.completed"
            name="completed"
            class="form-check-input"
            id="completedCheck"
          />
          <label for="completedCheck" class="form-check-label">Concluída</label>
        </div>
      </div>

      <div class="col-12">
        <button
          type="submit"
          class="btn btn-primary me-2"
          [disabled]="taskForm.invalid"
        >
          Salvar
        </button>
        <button type="button" class="btn btn-secondary" (click)="cancel.emit()">
          Cancelar
        </button>
      </div>
    </form>
  `,
})
export class TaskFormComponent {
  @Input() task: Task | null = null;
  @Output() save = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  taskData: Task = {
    id: 0,
    title: '',
    description: '',
    priority: '',
    completed: false,
  };

  ngOnChanges() {
    if (this.task) {
      this.taskData = { ...this.task };
    } else {
      this.taskData = {
        id: 0,
        title: '',
        description: '',
        priority: '',
        completed: false,
      };
    }
  }

  submit() {
    this.save.emit(this.taskData);
  }
}
