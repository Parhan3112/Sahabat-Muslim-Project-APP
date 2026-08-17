import React from 'react';
import { BookOpen, Clock, Compass, HeartHandshake, Home, User } from 'lucide-react';

export type ActiveTab = 'home' | 'quran' | 'prayer' | 'dzikir' | 'qibla' | 'profile';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as ActiveTab, label: 'Beranda', icon: Home },
    { id: 'quran' as ActiveTab, label: 'Al-Qur\'an', icon: BookOpen },
    { id: 'prayer' as ActiveTab, label: 'Sholat', icon: Clock },
    { id: 'dzikir' as ActiveTab, label: 'Dzikir', icon: HeartHandshake },
    { id: 'qibla' as ActiveTab, label: 'Kiblat', icon: Compass },
    { id: 'profile' as ActiveTab, label: 'Profil', icon: User },
  ];

  return (
    <nav
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'var(--nav-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-color)',
        padding: '8px 10px 14px 10px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 'auto',
      }}
    >
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: 'pointer',
              color: isActive ? 'var(--gold-accent)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              flex: 1,
            }}
          >
            <div
              style={{
                position: 'relative',
                padding: '5px 12px',
                borderRadius: '16px',
                backgroundColor: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <IconComponent size={19} strokeWidth={isActive ? 2.5 : 1.8} />
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.1px',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
