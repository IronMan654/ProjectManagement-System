import { useState, useEffect, useCallback } from 'react';
import { Project, Column, Row } from '../types';
import { parseCSV } from '../utils/csvHelper';

const STORAGE_KEY = 'nexplan_active_project';

const INITIAL_PROJECT: Project = {
  id: 'proj_001',
  name: 'Q4 Product Roadmap',
  description: 'Tracking main deliverables for the upcoming quarter',
  updatedAt: Date.now(),
  columns: [
    { id: 'c1', title: 'Task Name', type: 'text', width: 300 },
    { id: 'c2', title: 'Status', type: 'status', width: 140 },
    { id: 'c3', title: 'Owner', type: 'person', width: 160 },
    { id: 'c4', title: 'Due Date', type: 'date', width: 140 },
    { id: 'c5', title: 'Priority', type: 'priority', width: 120 },
  ],
  rows: [
    {
      id: 'r1',
      cells: {
        'c1': { value: 'Revamp Homepage Design' },
        'c2': { value: 'In Progress' },
        'c3': { value: 'Alice Design' },
        'c4': { value: '2023-11-01' },
        'c5': { value: 'High' },
      }
    },
    {
      id: 'r2',
      cells: {
        'c1': { value: 'Backend API Migration' },
        'c2': { value: 'Not Started' },
        'c3': { value: 'Bob Dev' },
        'c4': { value: '2023-12-15' },
        'c5': { value: 'Critical' },
      }
    }
  ]
};

export const useProjectStore = () => {
  const [project, setProject] = useState<Project>(INITIAL_PROJECT);
  const [lastSaved, setLastSaved] = useState<number>(Date.now());

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProject(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load project", e);
      }
    }
  }, []);

  // Real-time Simulation: Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        console.log("Syncing data from another tab...");
        setProject(JSON.parse(e.newValue));
        setLastSaved(Date.now());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save to local storage
  const save = useCallback((newProject: Project) => {
    const projectWithTimestamp = { ...newProject, updatedAt: Date.now() };
    setProject(projectWithTimestamp);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projectWithTimestamp));
    setLastSaved(Date.now());
  }, []);

  // Actions
  const updateCell = (rowId: string, colId: string, value: string) => {
    const newRows = project.rows.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          cells: {
            ...row.cells,
            [colId]: { value }
          }
        };
      }
      return row;
    });
    save({ ...project, rows: newRows });
  };

  const addRow = () => {
    const newRow: Row = {
      id: `row-${Date.now()}`,
      cells: {}
    };
    save({ ...project, rows: [...project.rows, newRow] });
  };

  const deleteRow = (rowId: string) => {
    save({ ...project, rows: project.rows.filter(r => r.id !== rowId) });
  };

  const addColumn = (title: string = 'New Column') => {
    const newCol: Column = {
      id: `col-${Date.now()}`,
      title,
      type: 'text',
      width: 200
    };
    save({ ...project, columns: [...project.columns, newCol] });
  };

  const deleteColumn = (colId: string) => {
    save({ ...project, columns: project.columns.filter(c => c.id !== colId) });
  };

  const importData = (csvText: string) => {
    const { columns, rows } = parseCSV(csvText);
    if (columns.length > 0) {
      save({ ...project, columns, rows });
    }
  };

  const updateProjectName = (name: string) => {
    save({ ...project, name });
  };

  return {
    project,
    lastSaved,
    updateCell,
    addRow,
    deleteRow,
    addColumn,
    deleteColumn,
    importData,
    updateProjectName,
    saveManual: () => save(project) // Force save
  };
};