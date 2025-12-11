// Data types for the Project Management System

export type ColumnType = 'text' | 'status' | 'date' | 'person' | 'priority';

export interface Column {
  id: string;
  title: string;
  type: ColumnType;
  width: number;
}

export interface CellData {
  value: string;
}

export interface Row {
  id: string;
  cells: Record<string, CellData>; // Key is column ID
}

export interface Project {
  id: string;
  name: string;
  description: string;
  columns: Column[];
  rows: Row[];
  updatedAt: number;
}

// Enum for predefined statuses to mimic enterprise software
export enum StatusOption {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  BLOCKED = 'Blocked',
  DONE = 'Done',
}

export enum PriorityOption {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}