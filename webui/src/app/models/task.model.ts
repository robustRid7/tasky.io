export interface SubTask {
    id: string;
    name: string;
    description?: string;
  }
  
  export interface StatusColumn {
    statusName: string; 
    subTasks: SubTask[];
  }
  
  export interface Task {
    id: string;
    taskName: string;
    statusColumns: StatusColumn[];
  }
  