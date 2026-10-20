import React from 'react';
import { Home, PlusSquare, BarChart2, Scale, Flag } from 'lucide-react';

export type ScreenTab = 'hoy' | 'registro' | 'progreso' | 'medidas' | 'reto';

interface BottomNavProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'hoy', label: 'Hoy', icon: Home },
    { id: 'registro', label: 'Registrar', icon: PlusSquare },
    { id: 'progreso', label: 'Progreso', icon: BarChart2 },
    { id: 'medidas', label: 'Medidas', icon: Scale },
    { id: 'reto', label: 'Reto', icon: Flag }
  ] as const;

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
          >
            <div className="nav-ico">
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
