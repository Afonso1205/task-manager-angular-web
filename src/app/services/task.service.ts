import { Injectable } from '@angular/core';

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: string;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = [];
  private nextId = 1;

  getTasks(): Task[] {
    return [...this.tasks];
  }

  addTask(task: Task): void {
    task.id = this.nextId++;
    this.tasks.push(task);
  }

  updateTask(task: Task): void {
    const idx = this.tasks.findIndex((t) => t.id === task.id);
    if (idx !== -1) {
      this.tasks[idx] = task;
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }
}
