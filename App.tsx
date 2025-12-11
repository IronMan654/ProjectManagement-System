import React, { useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Grid } from './components/Grid';
import { useProjectStore } from './hooks/useProjectStore';
import { exportToCSV, downloadCSV } from './utils/csvHelper';

const App: React.FC = () => {
  const { 
    project, 
    lastSaved, 
    updateCell, 
    addRow, 
    deleteRow, 
    addColumn, 
    deleteColumn,
    updateProjectName,
    importData,
    saveManual
  } = useProjectStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const csv = exportToCSV(project);
    downloadCSV(csv, `${project.name.replace(/\s+/g, '_')}.csv`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        importData(text);
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-40">
          <div className="flex items-center overflow-hidden">
            <div className="mr-4">
              <input 
                className="text-xl font-bold text-gray-900 border-none focus:ring-0 p-0 hover:bg-gray-50 rounded px-1 transition-colors truncate max-w-md"
                value={project.name}
                onChange={(e) => updateProjectName(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-0.5">
                Last synced: {new Date(lastSaved).toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
             {/* Hidden file input for import */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileChange}
            />

            <button 
              onClick={saveManual}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm transition-all"
            >
              Save
            </button>
            <button 
              onClick={handleImportClick}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm transition-all flex items-center"
            >
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Import CSV
            </button>
            <button 
              onClick={handleExport}
              className="px-3 py-1.5 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-md hover:bg-brand-700 shadow-sm transition-all flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export Excel
            </button>
          </div>
        </header>

        {/* Filters / Toolbar (Optional - Aesthetic mostly) */}
        <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-6 space-x-4 flex-shrink-0">
           <button className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center">
             <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
             Filter
           </button>
           <button className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center">
             <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
             Sort
           </button>
           <div className="h-4 w-px bg-gray-300 mx-2"></div>
           <span className="text-xs text-gray-500">All tasks</span>
        </div>

        {/* Main Grid Content */}
        <Grid 
          project={project} 
          onUpdateCell={updateCell}
          onAddRow={addRow}
          onDeleteRow={deleteRow}
          onAddColumn={() => addColumn()}
          onDeleteColumn={deleteColumn}
        />
      </main>
    </div>
  );
};

export default App;