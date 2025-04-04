export interface SubTask {
    id: string;
    name: string;
    description?: string;
  }
  
  export interface StatusColumn {
    statusName: string;   // e.g., "Backlog", "In Progress"
    subTasks: SubTask[];
  }
  
  export interface Task {
    id: string;
    taskName: string;
    statusColumns: StatusColumn[];
  }
  