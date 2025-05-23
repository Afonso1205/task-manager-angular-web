import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: number;
  isCompleted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = 'https://localhost:44327/api/Tasks';

  private readonly http = inject(HttpClient);

  getTasks(filter?: {
    completed?: boolean;
    priority?: number;
  }): Observable<Task[]> {
    let params = new HttpParams();

    if (filter?.completed !== undefined) {
      params = params.set('completed', filter.completed.toString());
    }

    if (filter?.priority !== undefined) {
      params = params.set('priority', filter.priority.toString());
    }

    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  markAsCompleted(task: Task): Observable<Task> {
    const updated = { ...task, isCompleted: true, completedAt: new Date() };
    return this.updateTask(updated);
  }
}
