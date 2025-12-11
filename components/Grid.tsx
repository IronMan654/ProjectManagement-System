import React from 'react';
import { Project } from '../types';
import { Cell } from './Cell';

interface GridProps {
  project: Project;
  onUpdateCell: (r: string, c: string, v: string) => void;
  onAddRow: () => void;
  onDeleteRow: (id: string) => void;
  onAddColumn: () => void;
  onDeleteColumn: (id: string) => void;
}

export const Grid: React.FC<GridProps> = ({
  project,
  onUpdateCell,
  onAddRow,
  onDeleteRow,
  onAddColumn,
  onDeleteColumn,
}) => {
  return (
    <div className="flex-1 overflow-auto bg-gray-50 relative custom-scrollbar">
      <div className="inline-block min-w-full align-middle">
        <div className="border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
          {/* Header Row */}
          <div className="flex">
            {/* Row Actions Header (Sticky Left) */}
            <div className="sticky left-0 w-12 flex-shrink-0 bg-white border-r border-gray-200 z-30 flex items-center justify-center">
              <span className="text-gray-400 text-xs">#</span>
            </div>
            
            {/* Dynamic Headers */}
            {project.columns.map((col) => (
              <div
                key={col.id}
                style={{ width: col.width }}
                className="flex-shrink-0 px-3 py-2 border-r border-gray-200 bg-gray-50 flex items-center justify-between group"
              >
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {col.title}
                </span>
                <button 
                  onClick={() => { if(confirm('Delete column?')) onDeleteColumn(col.id); }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            ))}

            {/* Add Column Button */}
            <div className="w-24 flex-shrink-0 px-2 py-2 border-b border-gray-200 bg-gray-50 flex items-center">
              <button 
                onClick={onAddColumn}
                className="text-xs flex items-center text-gray-500 hover:text-brand-600 font-medium transition-colors"
              >
                <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Add Col
              </button>
            </div>
          </div>
        </div>

        {/* Data Rows */}
        <div className="bg-white">
          {project.rows.map((row, index) => (
            <div 
              key={row.id} 
              className="flex border-b border-gray-100 hover:bg-gray-50 transition-colors group"
            >
              {/* Row Number / Delete (Sticky Left) */}
              <div className="sticky left-0 w-12 flex-shrink-0 bg-white group-hover:bg-gray-50 border-r border-gray-200 z-10 flex items-center justify-center text-xs text-gray-400">
                <span className="group-hover:hidden">{index + 1}</span>
                <button 
                  onClick={() => onDeleteRow(row.id)}
                  className="hidden group-hover:block text-gray-400 hover:text-red-500"
                  title="Delete Row"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              </div>

              {/* Cells */}
              {project.columns.map((col) => (
                <div
                  key={col.id}
                  style={{ width: col.width }}
                  className="flex-shrink-0 border-r border-gray-100"
                >
                  <Cell 
                    column={col}
                    value={row.cells[col.id]?.value || ''}
                    onChange={(val) => onUpdateCell(row.id, col.id, val)}
                  />
                </div>
              ))}
              
              <div className="w-24 flex-shrink-0 bg-gray-50/20" />
            </div>
          ))}
        </div>

        {/* Add Row Button (Bottom) */}
        <div className="p-2 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onAddRow}
            className="flex items-center text-sm text-gray-500 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all shadow-sm border border-transparent hover:border-gray-200"
          >
             <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
             New Task
          </button>
        </div>
      </div>
    </div>
  );
};