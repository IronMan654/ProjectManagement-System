import { Project, Row, Column } from '../types';

/**
 * Converts the current project view to a CSV string.
 * This ensures compatibility with Excel without needing heavy libraries.
 */
export const exportToCSV = (project: Project): string => {
  // 1. Headers
  const headers = project.columns.map(c => `"${c.title.replace(/"/g, '""')}"`).join(',');

  // 2. Rows
  const rows = project.rows.map(row => {
    return project.columns.map(col => {
      const cellVal = row.cells[col.id]?.value || '';
      // Escape quotes for CSV format
      return `"${cellVal.replace(/"/g, '""')}"`;
    }).join(',');
  }).join('\n');

  return `${headers}\n${rows}`;
};

/**
 * Downloads the CSV file to the user's machine.
 */
export const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Parses a CSV string and returns new Rows and Columns.
 * Simulates importing an Excel sheet.
 */
export const parseCSV = (csvText: string): { columns: Column[], rows: Row[] } => {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
  
  if (lines.length === 0) return { columns: [], rows: [] };

  // Parse Header Line
  const headerLine = lines[0];
  // Simple CSV regex to handle quoted strings containing commas
  const csvSplit = (line: string) => {
    const res = [];
    let current = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        res.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        current = '';
      } else {
        current += char;
      }
    }
    res.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    return res;
  };

  const headers = csvSplit(headerLine);
  
  // Generate Columns
  const columns: Column[] = headers.map((h, index) => ({
    id: `col-${Date.now()}-${index}`,
    title: h || `Column ${index + 1}`,
    type: 'text', // Default to text on import
    width: 200
  }));

  // Generate Rows
  const rows: Row[] = lines.slice(1).map((line, rIndex) => {
    const values = csvSplit(line);
    const cells: Record<string, any> = {};
    
    columns.forEach((col, cIndex) => {
      cells[col.id] = { value: values[cIndex] || '' };
    });

    return {
      id: `row-${Date.now()}-${rIndex}`,
      cells
    };
  });

  return { columns, rows };
};