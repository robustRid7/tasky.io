import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService, TaskBoard, SubTask } from '../services/task.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit {
  taskBoards: TaskBoard[] = [];
  connectedTo: string[] = [];

  showSubtaskForm = false;
  showBoardForm = false;

  selectedBoardId = '';
  newSubtask: SubTask = { title: '', description: '', notes: '' };
  newBoardName = '';

  constructor(
    private toastr: ToastrService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.fetchBoards();
  }

  fetchBoards() {
    this.taskService.getTaskBoards().subscribe((response: any) => {
      this.taskBoards = response.data.map((board: any) => ({
        ...board,
        subtasks: board.subtasks || []
      }));
      this.connectedTo = this.taskBoards.map(board => board._id);
    });
  }

  drop(event: CdkDragDrop<SubTask[]>) {
    const previousBoardId = event.previousContainer.id;
    const newBoardId = event.container.id;
    const movedSubtask = event.previousContainer.data[event.previousIndex];

    if (!movedSubtask || !movedSubtask._id) {
      console.error("Invalid subtask or subtask ID not found.");
      return;
    }

    if (previousBoardId === newBoardId) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.taskService.moveSubTask({
        subtaskId: movedSubtask._id,
        previousBoardId,
        newBoardId,
        index: event.currentIndex,
      }).subscribe({
        next: (res: any) => this.toastr.success(res.message || "Subtask moved successfully!"),
        error: (err) => {
          this.toastr.error(err?.error?.message || "Failed to move subtask");
          console.error("Failed to move subtask", err);
          this.fetchBoards()
        }
      });
    }
  }

  openBoardForm() {
    this.newBoardName = '';
    this.showBoardForm = true;
  }

  submitBoard() {
    if (!this.newBoardName.trim()) {
      this.toastr.error('Board name is required!');
      return;
    }

    this.taskService.addTaskBoard({ name: this.newBoardName }).subscribe({
      next: (res: any) => {
        const newBoard = res.data;
        newBoard.subtasks = [];
        this.taskBoards.push(newBoard);
        this.connectedTo.push(newBoard._id);
        this.showBoardForm = false;
        this.toastr.success(res.message || 'Board added successfully!');
      },
      error: (err) => {
        const errorMsg = err?.error?.message || 'Failed to add the board';
        this.toastr.error(errorMsg);
        console.error("Error adding task board:", err);
      }
    });
  }

  openSubtaskForm(boardId: string) {
    this.selectedBoardId = boardId;
    this.newSubtask = { title: '', description: '', notes: '' };
    this.showSubtaskForm = true;
  }

  submitSubtask() {
    if (!this.newSubtask.title.trim()) {
      alert("Title is required!");
      return;
    }

    this.taskService.addSubTask(this.selectedBoardId, this.newSubtask).subscribe({
      next: (res: any) => {
        const board = this.taskBoards.find(b => b._id === this.selectedBoardId);
        if (board) board.subtasks.push(res.data);
        this.showSubtaskForm = false;
        this.toastr.success(res?.message || 'Subtask added successfully!');
      },
      error: (err) => {
        const errorMsg = err?.error?.message || 'Failed to add subtask';
        this.toastr.error(errorMsg);
        console.error('Error adding subtask:', err);
      }
    });
  }

  deleteBoard(boardId: string) {
    if (confirm('Are you sure you want to delete this board?')) {
      this.taskService.deleteTaskBoard(boardId).subscribe({
        next: (res: any) => {
          this.taskBoards = this.taskBoards.filter(board => board._id !== boardId);
          this.connectedTo = this.taskBoards.map(board => board._id);
          this.toastr.success(res?.message || 'Board deleted successfully!');
        },
        error: (err) => {
          const errorMsg = err?.error?.message || 'Failed to delete the board';
          this.toastr.error(errorMsg);
          console.error('Error deleting board:', err);
        }
      });
    }
  }

  editBoard(board: TaskBoard) {
    const newName = prompt('Enter new board name', board.name);
    if (newName && newName !== board.name) {
      this.taskService.updateTaskBoard(board._id, { name: newName }).subscribe({
        next: (res: any) => {
          board.name = newName;
          this.toastr.success(res?.message || 'Board updated successfully!');
        },
        error: (err) => {
          const errorMsg = err?.error?.message || 'Failed to update the board';
          this.toastr.error(errorMsg);
          console.error('Error updating board:', err);
        }
      });
    }
  }

  deleteSubtask(boardId: string, subtaskId: any) {
    this.taskService.deleteSubtask(boardId, subtaskId).subscribe({
      next: () => {
        const board = this.taskBoards.find(b => b._id === boardId);
        if (board) {
          board.subtasks = board.subtasks.filter(st => st._id !== subtaskId);
          this.toastr.success('Ticket deleted!');
        }
      },
      error: (err) => {
        const msg = err?.error?.message || 'Failed to delete ticket';
        this.toastr.error(msg);
        console.error('Error deleting ticket:', err);
      }
    });
  }
}
