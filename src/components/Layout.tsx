import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [activeSection, setActiveSection] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Дашборд', icon: 'LayoutDashboard' },
    { id: 'acts', label: 'Акты', icon: 'FileText' },
    { id: 'certificates', label: 'Сертификаты', icon: 'Award' },
    { id: 'registry', label: 'Реестр', icon: 'Database' },
    { id: 'projects', label: 'Проекты', icon: 'Folder' },
    { id: 'reports', label: 'Отчеты', icon: 'BarChart3' },
  ];

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Icon name="Building2" size={24} className="text-sidebar-primary" />
            СтройДок
          </h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">Система учета скрытых работ</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    activeSection === item.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80'
                  }`}
                >
                  <Icon name={item.icon as any} size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center">
              <Icon name="User" size={16} className="text-sidebar-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Иван Петров</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">Инженер ПТО</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {navItems.find(item => item.id === activeSection)?.label}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Icon name="Search" size={16} className="mr-2" />
                Поиск
              </Button>
              <Button size="sm">
                <Icon name="Plus" size={16} className="mr-2" />
                Создать акт
              </Button>
            </div>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
