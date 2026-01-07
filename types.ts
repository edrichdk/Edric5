
export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  members: string[];
  inviteCode: string;
  createdAt: number;
}

export interface Message {
  id: string;
  groupId: string;
  text: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  timestamp: number;
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  assignedTo: string[];
  status: TaskStatus;
}

export interface Project {
  id: string;
  groupId: string;
  title: string;
  description: string;
  deadline: number;
  createdAt: number;
}
