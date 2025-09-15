export interface Keyword {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  state: boolean;
  keywords: Array<Keyword>;
}

export interface TaskResponse {
  id: string;
  title: string;
  keywords: Array<{ id: string; name: string }>;
  is_done: number;
}
