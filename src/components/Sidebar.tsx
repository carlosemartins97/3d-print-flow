import React from 'react';
import { Package, Home, Settings, ShoppingBag, Box, DollarSign, BookOpen, Store, LayoutTemplate } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export function Sidebar({ currentTab, setTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'inventory', label: 'Inventário e Ativos', icon: Box },
    { id: 'platforms', label: 'Plataformas de Venda', icon: Store },
    { id: 'catalog', label: 'Catálogo e Preços', icon: ShoppingBag },
    { id: 'listings', label: 'Anúncios (Marketplace)', icon: LayoutTemplate },
    { id: 'production', label: 'Produção', icon: Package },
    { id: 'sales', label: 'Vendas', icon: DollarSign },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'tutorial', label: 'Como usar', icon: BookOpen },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
          <Box className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          PrintFlow<span className="text-brand-primary-light">Pro</span>
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentTab === item.id 
                ? 'bg-brand-primary text-white' 
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="p-6 bg-slate-800/50">
        <p className="text-xs text-center text-slate-400">
          Versão Local Storage<br/>(Sem Backend)
        </p>
      </div>
    </aside>
  );
}
