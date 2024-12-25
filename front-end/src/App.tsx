import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Router>
      <div className="dashboard">
        {/* Sidebar toujours visible */}
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={handleToggleSidebar} />
        
        {/* Contenu principal avec scroll activé */}
        <div className={`main-content ${isCollapsed ? 'expanded' : ''}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
