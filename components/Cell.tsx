import React, { useState, useEffect, useRef } from 'react';
import { Column, StatusOption, PriorityOption } from '../types';

interface CellProps {
  value: string;
  column: Column;
  onChange: (val: string) => void;
}

export const Cell: React.FC<CellProps> = ({ value, column, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onChange(tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  // Status Badge Logic
  const getStatusColor = (val: string) => {
    switch (val) {
      case StatusOption.DONE: return 'bg-green-100 text-green-800 border-green-200';
      case StatusOption.IN_PROGRESS: return 'bg-blue-100 text-blue-800 border-blue-200';
      case StatusOption.BLOCKED: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Priority Badge Logic
  const getPriorityColor = (val: string) => {
     switch (val) {
      case PriorityOption.CRITICAL: return 'text-red-600 font-bold';
      case PriorityOption.HIGH: return 'text-orange-600 font-medium';
      case PriorityOption.MEDIUM: return 'text-blue-600';
      default: return 'text-gray-500';
    }
  };

  if (column.type === 'status') {
    return (
      <div className="w-full h-full p-2">
        <select
          value={value || StatusOption.NOT_STARTED}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full text-xs font-semibold px-2 py-1 rounded-full border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 ${getStatusColor(value)}`}
        >
          {Object.values(StatusOption).map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  if (column.type === 'priority') {
    return (
       <div className="w-full h-full p-2 flex items-center">
         <select
          value={value || PriorityOption.LOW}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full text-xs bg-transparent cursor-pointer focus:outline-none ${getPriorityColor(value)}`}
        >
          {Object.values(PriorityOption).map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
       </div>
    );
  }

  if (column.type === 'date') {
    return (
      <div className="w-full h-full p-1">
        <input 
          type="date"
          className="w-full h-full px-2 text-sm text-gray-700 bg-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 rounded border border-transparent hover:border-gray-200 focus:border-brand-500 transition-all outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  // Default Text / Person Renderer
  return (
    <div 
      className="w-full h-full relative group"
      onClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="w-full h-full px-3 py-2 text-sm text-gray-900 bg-white shadow-sm ring-2 ring-brand-500 outline-none z-10 absolute inset-0"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div className="w-full h-full px-3 py-2 text-sm text-gray-700 truncate hover:bg-gray-50 cursor-text border border-transparent hover:border-gray-200 transition-colors">
          {value}
        </div>
      )}
    </div>
  );
};