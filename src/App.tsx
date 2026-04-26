import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './pages/DashboardView';
import { InventoryView } from './pages/InventoryView';
import { CatalogView } from './pages/CatalogView';
import { SalesView } from './pages/SalesView';
import { ProductionView } from './pages/ProductionView';
import { SettingsView } from './pages/SettingsView';
import { TutorialView } from './pages/TutorialView';
import { PlatformsView } from './pages/PlatformsView';
import { ListingsView } from './pages/ListingsView';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard': return <DashboardView />;
      case 'inventory': return <InventoryView />;
      case 'platforms': return <PlatformsView />;
      case 'catalog': return <CatalogView />;
      case 'listings': return <ListingsView />;
      case 'production': return <ProductionView />;
      case 'sales': return <SalesView />;
      case 'settings': return <SettingsView />;
      case 'tutorial': return <TutorialView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Sidebar currentTab={currentTab} setTab={setCurrentTab} />
      <main className="flex-1 overflow-auto bg-slate-50">
        <div className="p-8 max-w-7xl mx-auto mb-12">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-white border-t border-slate-200 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Sincronizado LocalStorage</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
           <span>Versão 1.0.4-beta</span>
        </div>
      </footer>
    </div>
  );
}

