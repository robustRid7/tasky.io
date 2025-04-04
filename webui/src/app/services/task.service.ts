import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

export interface SubTask {
  _id?: string,
  title: string;
  description?: string;
  notes?: string;
}

export interface TaskBoard {
  name: string;
  _id: string;
  subtasks: SubTask[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = `${environment.BASE_URL}/tasks`;

  constructor(private http: HttpClient) {}

  getTaskBoards(): Observable<TaskBoard[]> {
    return this.http.get<TaskBoard[]>(`${this.baseUrl}/boards`);
  }

  addTaskBoard(board: Partial<TaskBoard>): Observable<TaskBoard> {
    return this.http.post<TaskBoard>(`${this.baseUrl}/boards`, board);
  }

  addSubTask(boardId: string, subtask: SubTask): Observable<SubTask> {
    return this.http.post<SubTask>(`${this.baseUrl}/boards/${boardId}/subtasks`, subtask);
  }

  updateTaskBoard(boardId: string, updateData: { name: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/${boardId}`, updateData);
  }

  deleteTaskBoard(boardId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${boardId}`);
  }

  moveSubTask(updateData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/move/subtask`, updateData);
  }

  deleteSubtask(boardId: string, subtaskId: string) {
    return this.http.delete(`/api/taskboard/${boardId}/subtask/${subtaskId}`);
  }
}
