import React, { useState } from 'react';
import { useStore, Product } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Pencil, Trash2 } from 'lucide-react';

export function CatalogView() {
  const store = useStore();

  const [name, setName] = useState('');
  const [filamentId, setFilamentId] = useState('');
  const [printerId, setPrinterId] = useState('');
  const [slicerTimeMinutes, setSlicerTime] = useState('');
  const [weightGrams, setWeight] = useState('');
  const [laborMinutes, setLabor] = useState('');
  const [markupPercent, setMarkup] = useState('100'); // 100% markup default
  const [packagingId, setPackagingId] = useState('');
  
  const [productExternalItems, setProductExternalItems] = useState<{itemId: string, quantity: number}[]>([]);

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
   const [selectedPlatforms, setSelectedPlatforms] = useState<Record<string, string>>({});
  const [trackingCodes, setTrackingCodes] = useState<Record<string, string>>({});

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filamentId || !printerId) {
      alert("Selecione um filamento e uma impressora primeiro."); return;
    }
    
    if (editingProductId) {
       store.updateProduct(editingProductId, {
          name,
          filamentId,
          printerId,
          packagingId: packagingId || undefined,
          slicerTimeMinutes: parseFloat(slicerTimeMinutes),
          weightGrams: parseFloat(weightGrams),
          laborMinutes: parseFloat(laborMinutes),
          markupPercent: parseFloat(markupPercent),
          externalItems: productExternalItems,
       });
       setEditingProductId(null);
    } else {
       store.addProduct({
          name,
          filamentId,
          printerId,
          packagingId: packagingId || undefined,
          slicerTimeMinutes: parseFloat(slicerTimeMinutes),
          weightGrams: parseFloat(weightGrams),
          laborMinutes: parseFloat(laborMinutes),
          markupPercent: parseFloat(markupPercent),
          isPackaged: false,
          externalItems: productExternalItems,
       });
    }
    setName(''); setSlicerTime(''); setWeight(''); setLabor(''); setMarkup('100'); setProductExternalItems([]); setPackagingId('');
  };

  const startEditProduct = (id: string) => {
      const p = store.products.find(x => x.id === id);
      if (!p) return;
      setEditingProductId(id);
      setName(p.name);
      setFilamentId(p.filamentId);
      setPrinterId(p.printerId);
      setPackagingId(p.packagingId || '');
      setSlicerTime(p.slicerTimeMinutes.toString());
      setWeight(p.weightGrams.toString());
      setLabor(p.laborMinutes.toString());
      setMarkup(p.markupPercent.toString());
      setProductExternalItems(p.externalItems || []);
  };

  const cancelEditProduct = () => {
      setEditingProductId(null);
      setName(''); setSlicerTime(''); setWeight(''); setLabor(''); setMarkup('100'); setProductExternalItems([]); setPackagingId('');
  };

  // Helper func to calculate costs for display
  const calculateCost = (prod: Product) => {
      const fil = store.filaments.find(f => f.id === prod.filamentId);
      const printer = store.printers.find(p => p.id === prod.printerId);
      
      if (!fil) return { filCost: 0, labor: 0, total: 0, finalPrice: 0, margin: 0, failureRate: 0 };
      
      const filCostPerGram = fil.cost / fil.totalWeightGrams;
      const filCost = filCostPerGram * prod.weightGrams;
      
      const laborCost = (prod.laborMinutes / 60) * store.laborHourlyRate;
      
      // Calculate true energy/depreciation from selected printer
      let energyCost = 0;
      let deprCost = 0;
      
      if (printer) {
        // (Watts / 1000) * hours * kWh price
        energyCost = (printer.powerWatts / 1000) * (prod.slicerTimeMinutes / 60) * store.kwhPrice;
        // Cost / total expected life hours
        deprCost = (printer.cost / printer.lifeHours) * (prod.slicerTimeMinutes / 60);
      }
      
      const failureRate = fil.successCount + fil.failureCount > 0 
          ? fil.failureCount / (fil.successCount + fil.failureCount) 
          : 0.10; // 10% default
          
      // External items cost
      const externalCost = (prod.externalItems || []).reduce((acc, ext) => {
         const item = store.externalItems.find(i => i.id === ext.itemId);
         if (!item) return acc;
         const unitPrice = item.cost / item.packageQuantity;
         return acc + (unitPrice * ext.quantity);
      }, 0);

      // Packaging cost
      let packagingCost = 0;
      if (prod.packagingId) {
         const pkg = store.packagings.find(p => p.id === prod.packagingId);
         if (pkg) packagingCost = pkg.cost;
      }

      const baseCost = (filCost + energyCost + deprCost) * (1 + failureRate);
      const totalCostRaw = baseCost + laborCost + externalCost + packagingCost;
      
      const desiredProfit = totalCostRaw * (prod.markupPercent / 100);
      
      // Platform tax Simulator (e.g. 18% shopee)
      const mockPlatformTax = 0.18;
      const meiTax = store.taxPercent / 100;
      
      // Formula: Price = (Cost + Profit) / (1 - taxes)
      const finalPrice = (totalCostRaw + desiredProfit) / (1 - (mockPlatformTax + meiTax));
      
      const margin = ((finalPrice - totalCostRaw) / finalPrice) * 100;

      return { filCost, laborCost, externalCost, packagingCost, total: totalCostRaw, finalPrice, margin, failureRate };
  };

  const addExternalItemField = () => {
    setProductExternalItems([...productExternalItems, { itemId: '', quantity: 1 }]);
  };

  const updateExternalItemField = (index: number, field: string, value: string) => {
    const newItems = [...productExternalItems];
    if (field === 'itemId') newItems[index].itemId = value;
    if (field === 'quantity') newItems[index].quantity = parseFloat(value) || 0;
    setProductExternalItems(newItems);
  };

  const removeExternalItemField = (index: number) => {
    const newItems = [...productExternalItems];
    newItems.splice(index, 1);
    setProductExternalItems(newItems);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Catálogo e Precificação Inteligente</h2>
        <p className="text-gray-500">Transforme dados do fatiador em preços de venda reais.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1 h-fit border-indigo-500/20">
          <CardHeader><CardTitle>{editingProductId ? 'Editar Ficha Técnica' : 'Ficha Técnica (Novo)'}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <Input label="Nome do Produto" required value={name} onChange={e => setName(e.target.value)} />
              
              <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-medium text-slate-700">Filamento Utilizado</label>
                  <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" value={filamentId} onChange={e => setFilamentId(e.target.value)} required>
                    <option value="">Selecione...</option>
                    {store.filaments.map(f => <option key={f.id} value={f.id}>{f.brand} {f.material} ({f.color})</option>)}
                  </select>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-medium text-slate-700">Impressora</label>
                  <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" value={printerId} onChange={e => setPrinterId(e.target.value)} required>
                    <option value="">Selecione...</option>
                    {store.printers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input label="Tempo Slicer (min)" type="number" required value={slicerTimeMinutes} onChange={e => setSlicerTime(e.target.value)} />
                <Input label="Peso da Peça (g)" type="number" required value={weightGrams} onChange={e => setWeight(e.target.value)} />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Input label="Pós-proc. (min)" type="number" required value={laborMinutes} onChange={e => setLabor(e.target.value)} />
                <Input label="Markup (%)" type="number" required value={markupPercent} onChange={e => setMarkup(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-medium text-slate-700">Embalagem (Opcional)</label>
                  <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" value={packagingId} onChange={e => setPackagingId(e.target.value)}>
                    <option value="">Sem embalagem específica</option>
                    {store.packagings.map(pkg => <option key={pkg.id} value={pkg.id}>{pkg.name} - R${pkg.cost.toFixed(2)}</option>)}
                  </select>
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                   <label className="text-sm font-medium text-slate-700">Itens Externos/Insumos</label>
                   <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={addExternalItemField}>+ Adicionar</Button>
                </div>
                {store.externalItems.length === 0 ? (
                    <p className="text-xs text-slate-400">Nenhum item externo cadastrado no Inventário.</p>
                ) : (
                  productExternalItems.map((extItem, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" value={extItem.itemId} onChange={e => updateExternalItemField(index, 'itemId', e.target.value)} required>
                          <option value="">Selecione...</option>
                          {store.externalItems.map(ext => <option key={ext.id} value={ext.id}>{ext.name}</option>)}
                        </select>
                      </div>
                      <div className="w-20">
                        <Input type="number" min="0.1" step="0.1" value={extItem.quantity.toString()} onChange={e => updateExternalItemField(index, 'quantity', e.target.value)} required />
                      </div>
                      <button type="button" onClick={() => removeExternalItemField(index)} className="p-2 mb-1 text-slate-400 hover:text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))
                )}
              </div>

              {editingProductId ? (
                  <div className="flex gap-2 pt-2">
                    <Button type="button" variant="outline" className="w-1/2" onClick={cancelEditProduct}>Cancelar</Button>
                    <Button type="submit" className="w-1/2">Salvar</Button>
                  </div>
              ) : (
                  <Button type="submit" className="w-full mt-2">Adicionar ao Catálogo</Button>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {store.products.map(p => {
                const costs = calculateCost(p);
                return (
                    <Card key={p.id} className="group relative">
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => startEditProduct(p.id)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                           <button onClick={() => store.deleteProduct(p.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                        <CardHeader className="pb-2 pr-16">
                            <CardTitle>{p.name}</CardTitle>
                            <p className="text-xs text-gray-400">
                              Tempo: {p.slicerTimeMinutes} min | Peso Total: {p.weightGrams + (p.packagingId ? store.packagings.find(pkg => pkg.id === p.packagingId)?.weightGrams || 0 : 0)}g
                              {p.packagingId && <span className="ml-1 text-[10px]">(Peça: {p.weightGrams}g + Emb: {store.packagings.find(pkg => pkg.id === p.packagingId)?.weightGrams || 0}g)</span>}
                            </p>
                            <div className="mt-2 text-sm text-slate-600">
                                {(() => {
                                    const fil = store.filaments.find(f => f.id === p.filamentId);
                                    return fil ? (
                                        <p className="flex items-center gap-1.5">
                                            <span className="font-medium text-slate-900">Material:</span>
                                            <span className="inline-block w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: fil.colorHex || '#000000' }}></span>
                                            {fil.brand} {fil.material} ({fil.color})
                                        </p>
                                    ) : null;
                                })()}
                                {p.externalItems && p.externalItems.length > 0 && (
                                    <div className="mt-1">
                                        <p className="font-medium text-slate-900">Insumos:</p>
                                        <ul className="list-disc list-inside text-xs mt-0.5 text-slate-500">
                                            {p.externalItems.map((ext, idx) => {
                                                const externalItem = store.externalItems.find(i => i.id === ext.itemId);
                                                return <li key={idx}>{externalItem?.name || 'Desconhecido'} (x{ext.quantity})</li>;
                                            })}
                                        </ul>
                                    </div>
                                )}
                                {p.packagingId && (() => {
                                    const pkg = store.packagings.find(pkg => pkg.id === p.packagingId);
                                    return pkg ? (
                                        <div className="mt-1">
                                            <p className="font-medium text-slate-900">Embalagem:</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{pkg.name}</p>
                                        </div>
                                    ) : null;
                                })()}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="bg-gray-50 p-2 rounded border border-gray-100 flex flex-col justify-center">
                                    <span className="text-gray-500 block text-[11px] leading-tight mb-1">
                                      Custo Base
                                    </span>
                                    <span className="font-semibold text-brand-neutral-dark text-base">R$ {costs.total.toFixed(2)}</span>
                                    <span className="text-gray-400 text-[10px] truncate mt-0.5" title={`Ext: R$${costs.externalCost.toFixed(2)} | Emb: R$${costs.packagingCost?.toFixed(2) || '0.00'}`}>
                                      + R$ {(costs.externalCost + (costs.packagingCost || 0)).toFixed(2)} extras
                                    </span>
                                </div>
                                <div className="bg-green-50 p-2 rounded border border-green-100">
                                    <span className="text-green-700 block text-xs">Preço de Venda Sugerido</span>
                                    <span className="font-bold text-green-700">R$ {costs.finalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className="text-xs text-gray-500 space-y-1 pb-3 border-b border-gray-100">
                                <div className="flex justify-between">
                                    <span>Margem (após taxas simuladas):</span>
                                    <span className="font-medium">{costs.margin.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Estoque Disponível:</span>
                                    <span className={p.stockQuantity > 0 ? "text-brand-primary" : "text-slate-400"}>{p.stockQuantity || 0} un</span>
                                </div>
                                <div className="pt-2">
                                  <Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={() => {
                                      store.produceProductToStock(p.id, 1);
                                  }}>+ Produzir 1 para Estoque</Button>
                                </div>
                            </div>
                            
                            {store.platforms.length > 0 ? (
                              <div className="space-y-2 mt-4">
                                 <select 
                                    className="w-full h-9 rounded-md border border-slate-200 text-xs px-2"
                                    value={selectedPlatforms[p.id] || store.platforms[0]?.id || ''}
                                    onChange={(e) => setSelectedPlatforms({...selectedPlatforms, [p.id]: e.target.value})}
                                 >
                                    {store.platforms.map(plat => (
                                      <option key={plat.id} value={plat.id}>{plat.name} (Taxa: {plat.feePercent}% + R${plat.fixedFee.toFixed(2)})</option>
                                    ))}
                                 </select>
                                 <Input 
                                    placeholder="Código de Rastreio / ID (Opcional)"
                                    className="h-8 text-[11px]"
                                    value={trackingCodes[p.id] || ''}
                                    onChange={(e) => setTrackingCodes({...trackingCodes, [p.id]: e.target.value})}
                                  />
                                  <div className="grid grid-cols-2 gap-2">
                                      <Button variant="outline" size="sm" className="w-full text-xs text-slate-500 hover:text-slate-900" onClick={() => {
                                          store.addProductionJob({ productId: p.id, trackingCode: trackingCodes[p.id] });
                                          setTrackingCodes({...trackingCodes, [p.id]: ''});
                                      }}>Mandar p/ Produção</Button>
                                      <Button className="w-full text-xs bg-brand-primary hover:bg-brand-primary-dark text-white"  onClick={() => {
                                          const platId = selectedPlatforms[p.id] || store.platforms[0]?.id;
                                          const plat = store.platforms.find(pl => pl.id === platId);
                                          if (!plat) return;
                                          
                                          store.addOrder({
                                              productId: p.id,
                                              status: 'Pendente',
                                              channel: plat.name,
                                              platformId: plat.id,
                                              priceSold: costs.finalPrice,
                                              shippingCost: 0,
                                              shippingPaidBy: 'Comprador',
                                              channelFeePercent: plat.feePercent,
                                              channelFeeFixed: plat.fixedFee,
                                              realCost: costs.total,
                                              itemsConsumed: false,
                                              trackingCode: trackingCodes[p.id]
                                          });
                                          setTrackingCodes({...trackingCodes, [p.id]: ''});
                                      }}>Iniciar Venda</Button>
                                  </div>
                              </div>
                            ) : (
                              <p className="text-xs text-brand-secondary text-center mt-4 border-t border-slate-100 pt-3">Cadastre plataformas de venda para vender.</p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
            
            {store.products.length === 0 && (
                <div className="col-span-1 md:col-span-2 text-center p-8 text-gray-400 border border-dashed rounded-xl">
                    Nenhum produto no catálogo. Verifique se há filamentos e crie o primeiro.
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
