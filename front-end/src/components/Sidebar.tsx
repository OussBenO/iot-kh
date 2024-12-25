import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Sidebar.css';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="logo" onClick={toggleSidebar}>
        <img src="/icons/logo.svg" alt="Logo" />
      </div>
      <ul>
        <li onClick={() => navigate('/')}>
          <img src="/icons/dashboard.svg" alt="Dashboard" />
          {!isCollapsed && <span>Dashboard</span>}
        </li>
        <li onClick={() => navigate('/history')}>
          <img src="/icons/history.svg" alt="History" />
          {!isCollapsed && <span>Historique</span>}
        </li>
        <li onClick={() => navigate('/settings')}>
          <img src="/icons/settings.svg" alt="Settings" />
          {!isCollapsed && <span>Paramètres</span>}
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
