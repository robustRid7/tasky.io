import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent {
  taskBoards = [
    { name: 'To Do', id: 'todo', subtasks: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5','Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'] },
    { name: 'In Progress', id: 'inprogress', subtasks: ['Task 6', 'Task 7'] },
    { name: 'Done', id: 'done', subtasks: ['Task 8'] }
  ];

  connectedTo = this.taskBoards.map(board => board.id);

  drop(event: CdkDragDrop<string[]>) {
    const prevContainer = event.previousContainer;
    const currContainer = event.container;

    if (prevContainer === currContainer) {
      moveItemInArray(currContainer.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(prevContainer.data, currContainer.data, event.previousIndex, event.currentIndex);
    }
  }
}
