import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private API_URL = 'http://localhost:3000/tasks'; // Update with actual API

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API_URL);
  }

  updateSubTask(taskId: string, subTaskId: string, newStatus: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/${taskId}/subtasks/${subTaskId}`, { status: newStatus });
  }
}
