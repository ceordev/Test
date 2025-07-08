import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './models/task.model';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private apiUrl = environment.apiUrl + '/tasks';

  constructor(private http: HttpClient) { }

  getTasks(filter?: { status?: string; search?: string }): Observable<Task[]> {
    let params = new HttpParams();
    if (filter?.status) {
      params = params.append('status', filter.status);
    }
    if (filter?.search) {
      params = params.append('search', filter.search);
    }
    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: { title: string; description: string }): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTaskStatus(id: number, status: 'OPEN' | 'IN_PROGRESS' | 'DONE'): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}