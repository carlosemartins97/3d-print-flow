import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Pencil, Trash2, X } from 'lucide-react';

export function InventoryView() {
  const store = useStore();
  const [activeTab, setActiveTab] = useState<'filaments' | 'printers' | 'packaging' | 'external' | 'stock'>('stock');

  // Form states
  const [filBrand, setFilBrand] = useState('');
  const [filMaterial, setFilMaterial] = useState('PLA');
  const [filColor, setFilColor] = useState('');
  const [filColorHex, setFilColorHex] = useState('#000000');
  const [filWeight, setFilWeight] = useState('1000');
  const [filCost, setFilCost] = useState('');

  const [editingFilamentId, setEditingFilamentId] = useState<string | null>(null);

  // Printer states
  const [printerName, setPrinterName] = useState('');
  const [printerCost, setPrinterCost] = useState('');
  const [printerLife, setPrinterLife] = useState('');
  const [printerPower, setPrinterPower] = useState('');
  
  const [editingPrinterId, setEditingPrinterId] = useState<string | null>(null);

  // Packaging states
  const [pkgName, setPkgName] = useState('');
  const [pkgSize, setPkgSize] = useState('');
  const [pkgWeight, setPkgWeight] = useState('');
  const [pkgCost, setPkgCost] = useState('');
  
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);

  // External Items states
  const [extItemName, setExtItemName] = useState('');
  const [extItemQty, setExtItemQty] = useState('');
  const [extItemCost, setExtItemCost] = useState('');
  
  const [editingExtItemId, setEditingExtItemId] = useState<string | null>(null);

  const handleAddFilament = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFilamentId) {
      store.updateFilament(editingFilamentId, {
        brand: filBrand,
        material: filMaterial,
        color: filColor,
        colorHex: filColorHex,
        totalWeightGrams: parseFloat(filWeight),
        cost: parseFloat(filCost)
      });
      setEditingFilamentId(null);
    } else {
      store.addFilament({
        brand: filBrand,
        material: filMaterial,
        color: filColor,
        colorHex: filColorHex,
        totalWeightGrams: parseFloat(filWeight),
        cost: parseFloat(filCost)
      });
    }
    setFilBrand(''); setFilColor(''); setFilCost(''); setFilColorHex('#000000'); setFilWeight('1000');
  };

  const startEditFilament = (id: string) => {
    const f = store.filaments.find(x => x.id === id);
    if (!f) return;
    setEditingFilamentId(id);
    setFilBrand(f.brand);
    setFilMaterial(f.material);
    setFilColor(f.color);
    setFilColorHex(f.colorHex || '#000000');
    setFilWeight(f.totalWeightGrams.toString());
    setFilCost(f.cost.toString());
  };

  const cancelEditFilament = () => {
    setEditingFilamentId(null);
    setFilBrand(''); setFilColor(''); setFilCost(''); setFilColorHex('#000000'); setFilWeight('1000');
  };

  const handleAddPrinter = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPrinterId) {
       store.updatePrinter(editingPrinterId, {
         name: printerName,
         cost: parseFloat(printerCost),
         lifeHours: parseFloat(printerLife),
         powerWatts: parseFloat(printerPower)
       });
       setEditingPrinterId(null);
    } else {
       store.addPrinter({
         name: printerName,
         cost: parseFloat(printerCost),
         lifeHours: parseFloat(printerLife),
         powerWatts: parseFloat(printerPower)
       });
    }
    setPrinterName('');
    setPrinterCost('');
    setPrinterLife('');
    setPrinterPower('');
  };

  const startEditPrinter = (id: string) => {
    const p = store.printers.find(x => x.id === id);
    if (!p) return;
    setEditingPrinterId(id);
    setPrinterName(p.name);
    setPrinterCost(p.cost.toString());
    setPrinterLife(p.lifeHours.toString());
    setPrinterPower(p.powerWatts.toString());
  };

  const cancelEditPrinter = () => {
    setEditingPrinterId(null);
    setPrinterName('');
    setPrinterCost('');
    setPrinterLife('');
    setPrinterPower('');
  };

  const handleAddPackaging = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPkgId) {
       store.updatePackaging(editingPkgId, {
         name: pkgName,
         size: pkgSize,
         weightGrams: parseFloat(pkgWeight),
         cost: parseFloat(pkgCost)
       });
       setEditingPkgId(null);
    } else {
       store.addPackaging({
         name: pkgName,
         size: pkgSize,
         weightGrams: parseFloat(pkgWeight),
         cost: parseFloat(pkgCost)
       });
    }
    setPkgName('');
    setPkgSize('');
    setPkgWeight('');
    setPkgCost('');
  };

  const startEditPackaging = (id: string) => {
    const p = store.packagings.find(x => x.id === id);
    if (!p) return;
    setEditingPkgId(id);
    setPkgName(p.name);
    setPkgSize(p.size);
    setPkgWeight(p.weightGrams.toString());
    setPkgCost(p.cost.toString());
  };

  const cancelEditPackaging = () => {
    setEditingPkgId(null);
    setPkgName('');
    setPkgSize('');
    setPkgWeight('');
    setPkgCost('');
  };

  const handleAddExternalItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExtItemId) {
       store.updateExternalItem(editingExtItemId, {
         name: extItemName,
         packageQuantity: parseFloat(extItemQty),
         cost: parseFloat(extItemCost)
       });
       setEditingExtItemId(null);
    } else {
       store.addExternalItem({
         name: extItemName,
         packageQuantity: parseFloat(extItemQty),
         cost: parseFloat(extItemCost)
       });
    }
    setExtItemName('');
    setExtItemQty('');
    setExtItemCost('');
  };

  const startEditExternalItem = (id: string) => {
    const p = store.externalItems.find(x => x.id === id);
    if (!p) return;
    setEditingExtItemId(id);
    setExtItemName(p.name);
    setExtItemQty(p.packageQuantity.toString());
    setExtItemCost(p.cost.toString());
  };

  const cancelEditExternalItem = () => {
    setEditingExtItemId(null);
    setExtItemName('');
    setExtItemQty('');
    setExtItemCost('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Inventário e Ativos</h2>
        <p className="text-gray-500">Cadastre matéria-prima, máquinas e insumos.</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('stock')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'stock' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-neutral'}`}
        >
          Resumo de Estoque
        </button>
        <button 
          onClick={() => setActiveTab('filaments')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'filaments' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-neutral'}`}
        >
          Filamentos
        </button>
        <button 
          onClick={() => setActiveTab('printers')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'printers' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-neutral'}`}
        >
          Impressoras
        </button>
        <button 
          onClick={() => setActiveTab('packaging')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'packaging' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-neutral'}`}
        >
          Embalagens
        </button>
        <button 
          onClick={() => setActiveTab('external')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'external' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-neutral'}`}
        >
          Itens Externos
        </button>
      </div>

      {activeTab === 'stock' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <Card>
                <CardHeader className="py-4"><CardTitle className="text-sm text-slate-500 font-medium">Impresso (Produtos Prontos)</CardTitle></CardHeader>
                <CardContent className="pb-4">
                   <div className="text-lg font-bold">
                     {store.products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0)} itens
                   </div>
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="py-4"><CardTitle className="text-sm text-slate-500 font-medium">Filamento Total</CardTitle></CardHeader>
                <CardContent className="pb-4">
                   <div className="text-lg font-bold">
                     {(store.filaments.reduce((acc, f) => acc + f.remainingWeightGrams, 0)/1000).toFixed(2)} kg
                   </div>
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="py-4"><CardTitle className="text-sm text-slate-500 font-medium">Embalagens (Total)</CardTitle></CardHeader>
                <CardContent className="pb-4">
                   <div className="text-lg font-bold">
                     {store.packagings.reduce((acc, p) => acc + (p.stockQuantity || 0), 0)} un
                   </div>
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="py-4"><CardTitle className="text-sm text-slate-500 font-medium">Insumos Externos</CardTitle></CardHeader>
                <CardContent className="pb-4">
                   <div className="text-lg font-bold">
                     {store.externalItems.reduce((acc, ext) => acc + (ext.stockQuantity || 0), 0)} un
                   </div>
                </CardContent>
             </Card>
          </div>

          <Card>
             <CardHeader>
                <CardTitle>Listagem Rápida</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full border-t border-slate-100 pt-4">
                  {/* Produtos Prontos */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">Produtos em Estoque</h3>
                    {store.products.filter(p => (p.stockQuantity || 0) > 0).length === 0 ? (
                       <p className="text-sm text-slate-400">Nenhum produto pronto no estoque.</p>
                    ) : (
                       <ul className="space-y-2">
                         {store.products.filter(p => (p.stockQuantity || 0) > 0).map(p => (
                             <li key={p.id} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                                <span>{p.name}</span>
                                <span className="font-medium text-brand-primary">{p.stockQuantity} un</span>
                             </li>
                         ))}
                       </ul>
                    )}
                  </div>

                  {/* Filamentos Abertos/Em Uso */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">Filamento por Cor/Tipo</h3>
                    {store.filaments.length === 0 ? (
                       <p className="text-sm text-slate-400">Nenhum filamento cadastrado.</p>
                    ) : (
                       <ul className="space-y-2">
                         {store.filaments.map(f => {
                             const isLow = f.remainingWeightGrams < 200;
                             return (
                               <li key={f.id} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                                  <div className="flex items-center gap-2">
                                     <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: f.colorHex || '#000' }}></span>
                                     <span>{f.brand} {f.material} ({f.color})</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <span className={`font-medium ${isLow ? 'text-red-500' : 'text-slate-700'}`}>{(f.remainingWeightGrams/1000).toFixed(2)} kg</span>
                                     {isLow && <span className="text-[10px] text-red-500 font-bold bg-red-100 px-1 py-0.5 rounded">BAIXO</span>}
                                  </div>
                               </li>
                             );
                         })}
                       </ul>
                    )}
                  </div>

                  {/* Embalagens */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">Embalagens</h3>
                    {store.packagings.length === 0 ? (
                       <p className="text-sm text-slate-400">Nenhuma embalagem cadastrada.</p>
                    ) : (
                       <ul className="space-y-2">
                         {store.packagings.map(pkg => {
                             const isLow = (pkg.stockQuantity || 0) < 10;
                             return (
                               <li key={pkg.id} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                                  <span>{pkg.name} <span className="text-slate-400">({pkg.size})</span></span>
                                  <div className="flex items-center gap-2">
                                     <span className={`font-medium ${isLow ? 'text-red-500' : 'text-slate-700'}`}>{pkg.stockQuantity || 0} un</span>
                                     {isLow && <span className="text-[10px] text-red-500 font-bold bg-red-100 px-1 py-0.5 rounded">BAIXO</span>}
                                  </div>
                               </li>
                             );
                         })}
                       </ul>
                    )}
                  </div>

                  {/* Itens Externos */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">Insumos/Itens Externos</h3>
                    {store.externalItems.length === 0 ? (
                       <p className="text-sm text-slate-400">Nenhum item externo cadastrado.</p>
                    ) : (
                       <ul className="space-y-2">
                         {store.externalItems.map(ext => {
                             const isLow = (ext.stockQuantity || 0) < ext.packageQuantity;
                             return (
                               <li key={ext.id} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                                  <span>{ext.name}</span>
                                  <div className="flex items-center gap-2">
                                     <span className={`font-medium ${isLow ? 'text-red-500' : 'text-slate-700'}`}>{ext.stockQuantity || 0} un</span>
                                     {isLow && <span className="text-[10px] text-red-500 font-bold bg-red-100 px-1 py-0.5 rounded">BAIXO</span>}
                                  </div>
                               </li>
                             );
                         })}
                       </ul>
                    )}
                  </div>

                </div>
             </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'filaments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 h-fit border-indigo-500/20">
            <CardHeader><CardTitle>{editingFilamentId ? 'Editar Filamento' : 'Novo Filamento'}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAddFilament} className="space-y-4">
                <Input label="Marca" required value={filBrand} onChange={e => setFilBrand(e.target.value)} />
                <div className="flex gap-2">
                  <div className="flex flex-col gap-1.5 w-1/2">
                    <label className="text-sm font-medium text-slate-700">Material</label>
                    <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" value={filMaterial} onChange={e => setFilMaterial(e.target.value)}>
                      <option>PLA</option><option>PETG</option><option>ABS</option><option>TPU</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 w-1/2">
                    <label className="text-sm font-medium text-slate-700">Cor</label>
                    <div className="flex bg-white border border-slate-200 rounded-md focus-within:ring-2 focus-within:ring-brand-primary focus-within:border-transparent h-10 overflow-hidden">
                       <input type="color" className="h-full w-10 p-0 border-0 bg-transparent cursor-pointer" value={filColorHex} onChange={e => setFilColorHex(e.target.value)} />
                       <input className="flex-1 w-full bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400" placeholder="Nome" required value={filColor} onChange={e => setFilColor(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input label="Peso (g)" type="number" required value={filWeight} onChange={e => setFilWeight(e.target.value)} />
                  <Input label="Custo (R$)" type="number" step="0.01" required value={filCost} onChange={e => setFilCost(e.target.value)} />
                </div>
                {editingFilamentId ? (
                  <div className="flex gap-2 pt-2">
                    <Button type="button" variant="outline" className="w-1/2" onClick={cancelEditFilament}>Cancelar</Button>
                    <Button type="submit" className="w-1/2">Salvar</Button>
                  </div>
                ) : (
                  <Button type="submit" className="w-full mt-2">Adicionar</Button>
                )}
              </form>
            </CardContent>
          </Card>
          
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {store.filaments.map(f => (
              <Card key={f.id} className="border-l-4 border-l-brand-primary group relative">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => startEditFilament(f.id)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                   <button onClick={() => store.deleteFilament(f.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2 pr-12">
                    <div>
                      <h4 className="font-semibold text-slate-900">{f.brand} - {f.material}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-3 h-3 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: f.colorHex || '#000000' }}></div>
                        <p className="text-sm text-slate-500 font-medium">{f.color}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded-full">
                      {(f.cost / f.totalWeightGrams).toFixed(3)} R$/g
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Estoque:</span>
                      <span className={f.remainingWeightGrams < 200 ? 'text-red-500 font-bold' : ''}>
                        {Math.round(f.remainingWeightGrams)}g
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                       {/* Max width at 100% since remaining might exceed total if multiple spools */}
                      <div 
                        className="bg-brand-primary h-1.5 rounded-full" 
                        style={{ width: `${Math.min(100, (f.remainingWeightGrams / f.totalWeightGrams) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 pt-1 border-b border-gray-100 pb-2">
                       <span>Sucesso: {f.successCount}</span>
                       <span>Falha: {f.failureCount} ({f.successCount + f.failureCount > 0 ? Math.round(f.failureCount / (f.successCount + f.failureCount) * 100) : 0}%)</span>
                    </div>
                    <div className="pt-2 flex gap-2 w-full">
                      <Button variant="outline" size="sm" className="w-full text-[11px] h-7" onClick={() => {
                        store.updateFilament(f.id, { remainingWeightGrams: f.remainingWeightGrams + f.totalWeightGrams });
                      }}>
                        + 1 Rolo ({f.totalWeightGrams}g)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {store.filaments.length === 0 && (
               <div className="col-span-2 text-center p-8 text-gray-400 border border-dashed rounded-xl">
                 Nenhum filamento cadastrado.
               </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'printers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 h-fit border-indigo-500/20">
            <CardHeader><CardTitle>{editingPrinterId ? 'Editar Impressora' : 'Nova Impressora'}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAddPrinter} className="space-y-4">
                <Input label="Modelo/Nome" required value={printerName} onChange={e => setPrinterName(e.target.value)} placeholder="Ex: Ender 3 V2" />
                <Input label="Valor de Compra (R$)" type="number" step="0.01" required value={printerCost} onChange={e => setPrinterCost(e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Vida Útil (h)" type="number" required value={printerLife} onChange={e => setPrinterLife(e.target.value)} placeholder="Ex: 5000" />
                  <Input label="Consumo (W)" type="number" required value={printerPower} onChange={e => setPrinterPower(e.target.value)} placeholder="Ex: 150" />
                </div>
                {editingPrinterId ? (
                  <div className="flex gap-2 pt-2">
                    <Button type="button" variant="outline" className="w-1/2" onClick={cancelEditPrinter}>Cancelar</Button>
                    <Button type="submit" className="w-1/2">Salvar</Button>
                  </div>
                ) : (
                  <Button type="submit" className="w-full mt-2">Adicionar</Button>
                )}
              </form>
            </CardContent>
          </Card>
          
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {store.printers.map(p => (
              <Card key={p.id} className="border-l-4 border-l-brand-secondary group relative">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => startEditPrinter(p.id)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                   <button onClick={() => store.deletePrinter(p.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2 pr-12">
                    <div>
                      <h4 className="font-semibold text-slate-900">{p.name}</h4>
                      <p className="text-sm text-slate-500">Potência: {p.powerWatts}W</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                      {(p.cost / p.lifeHours).toFixed(2)} R$/h
                    </span>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Vida Útil:</span>
                      <span className="font-medium text-slate-900">{p.usedHours}h / {p.lifeHours}h</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div 
                        className="bg-brand-secondary h-full rounded-full" 
                        style={{ width: `${Math.min(100, (p.usedHours / p.lifeHours) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-2 uppercase tracking-tight font-medium">
                       <span>Custo: R$ {p.cost.toFixed(2)}</span>
                       <span>Depreciação por Hora Base</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {store.printers.length === 0 && (
               <div className="col-span-2 text-center p-8 text-slate-400 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                 Nenhuma impressora cadastrada.
               </div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'packaging' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 h-fit border-indigo-500/20">
            <CardHeader><CardTitle>{editingPkgId ? 'Editar Embalagem' : 'Nova Embalagem'}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAddPackaging} className="space-y-4">
                <Input label="Nome" required value={pkgName} onChange={e => setPkgName(e.target.value)} placeholder="Ex: Caixa de Papelão P" />
                <Input label="Dimensões / Tamanho" required value={pkgSize} onChange={e => setPkgSize(e.target.value)} placeholder="Ex: 15x15x10cm" />
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Peso (g)" type="number" required value={pkgWeight} onChange={e => setPkgWeight(e.target.value)} />
                  <Input label="Custo (R$)" type="number" step="0.01" required value={pkgCost} onChange={e => setPkgCost(e.target.value)} />
                </div>
                {editingPkgId ? (
                  <div className="flex gap-2 pt-2">
                    <Button type="button" variant="outline" className="w-1/2" onClick={cancelEditPackaging}>Cancelar</Button>
                    <Button type="submit" className="w-1/2">Salvar</Button>
                  </div>
                ) : (
                  <Button type="submit" className="w-full mt-2">Adicionar</Button>
                )}
              </form>
            </CardContent>
          </Card>
          
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {store.packagings.map(p => (
              <Card key={p.id} className="border-l-4 border-l-amber-500 group relative">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => startEditPackaging(p.id)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                   <button onClick={() => store.deletePackaging(p.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2 pr-12">
                    <div>
                      <h4 className="font-semibold text-slate-900">{p.name}</h4>
                      <p className="text-sm text-slate-500">{p.size}</p>
                    </div>
                    <span className="text-[13px] font-bold px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200/50">
                      R$ {p.cost.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Estoque:</span>
                      <span className={`font-medium ${p.stockQuantity === 0 ? 'text-red-500' : 'text-slate-900'}`}>{p.stockQuantity || 0} un</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 pt-1 border-t border-slate-100">
                      <span>Peso: {p.weightGrams}g</span>
                    </div>
                    <div className="pt-2 flex gap-2 items-center">
                      <input 
                        type="number" 
                        id={`add-pkg-${p.id}`} 
                        defaultValue={50} 
                        className="h-7 w-16 text-xs border border-slate-200 rounded px-2"
                      />
                      <Button variant="outline" size="sm" className="flex-1 text-[11px] h-7" onClick={() => {
                        const inputTag = document.getElementById(`add-pkg-${p.id}`) as HTMLInputElement;
                        if (inputTag) {
                          const amount = parseInt(inputTag.value);
                          if (!isNaN(amount) && amount > 0) {
                            store.updatePackaging(p.id, { stockQuantity: (p.stockQuantity || 0) + amount });
                          }
                        }
                      }}>
                        Add Estoque
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {store.packagings.length === 0 && (
               <div className="col-span-2 text-center p-8 text-slate-400 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                 Nenhuma embalagem cadastrada.
               </div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'external' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 h-fit border-indigo-500/20">
            <CardHeader><CardTitle>{editingExtItemId ? 'Editar Item Externo' : 'Novo Item Externo'}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAddExternalItem} className="space-y-4">
                <Input label="Nome" required value={extItemName} onChange={e => setExtItemName(e.target.value)} placeholder="Ex: Parafuso M3x10" />
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Qtd. no Pacote" type="number" required value={extItemQty} onChange={e => setExtItemQty(e.target.value)} />
                  <Input label="Custo (R$)" type="number" step="0.01" required value={extItemCost} onChange={e => setExtItemCost(e.target.value)} />
                </div>
                {editingExtItemId ? (
                  <div className="flex gap-2 pt-2">
                    <Button type="button" variant="outline" className="w-1/2" onClick={cancelEditExternalItem}>Cancelar</Button>
                    <Button type="submit" className="w-1/2">Salvar</Button>
                  </div>
                ) : (
                  <Button type="submit" className="w-full mt-2">Adicionar</Button>
                )}
              </form>
            </CardContent>
          </Card>
          
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {store.externalItems.map(p => (
              <Card key={p.id} className="border-l-4 border-l-rose-500 group relative">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => startEditExternalItem(p.id)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                   <button onClick={() => store.deleteExternalItem(p.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2 pr-12">
                    <div>
                      <h4 className="font-semibold text-slate-900">{p.name}</h4>
                      <p className="text-sm text-slate-500">{p.packageQuantity} unidades / pct</p>
                    </div>
                    <span className="text-[13px] font-bold px-2 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-200/50">
                      R$ {(p.cost / p.packageQuantity).toFixed(2)}/un
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Estoque:</span>
                      <span className={`font-medium ${p.stockQuantity === 0 ? 'text-red-500' : 'text-slate-900'}`}>{p.stockQuantity || 0} un</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Custo Pacote: R$ {p.cost.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 flex gap-2">
                       <input 
                         type="number"
                         id={`add-ext-${p.id}`}
                         defaultValue={1}
                         className="h-7 w-12 text-xs border border-slate-200 rounded px-1"
                         min="1"
                       />
                      <Button variant="outline" size="sm" className="flex-1 text-[11px] h-7" onClick={() => {
                        const inputTag = document.getElementById(`add-ext-${p.id}`) as HTMLInputElement;
                        if (inputTag) {
                          const numPackages = parseInt(inputTag.value);
                          if (!isNaN(numPackages) && numPackages > 0) {
                            store.updateExternalItem(p.id, { stockQuantity: (p.stockQuantity || 0) + (p.packageQuantity * numPackages) });
                          }
                        }
                      }}>
                        Add Pacote(s)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {store.externalItems.length === 0 && (
               <div className="col-span-2 text-center p-8 text-slate-400 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                 Nenhum item externo cadastrado.
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
