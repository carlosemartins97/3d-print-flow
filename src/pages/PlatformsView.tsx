import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Store, Pencil, Trash2, Plus } from 'lucide-react';

export function PlatformsView() {
  const store = useStore();

  const [name, setName] = useState('');
  const [feePercent, setFeePercent] = useState('');
  const [fixedFee, setFixedFee] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      store.updatePlatform(editingId, {
        name,
        feePercent: parseFloat(feePercent) || 0,
        fixedFee: parseFloat(fixedFee) || 0,
      });
      setEditingId(null);
    } else {
      store.addPlatform({
        name,
        feePercent: parseFloat(feePercent) || 0,
        fixedFee: parseFloat(fixedFee) || 0,
      });
    }
    setName('');
    setFeePercent('');
    setFixedFee('');
  };

  const startEdit = (id: string) => {
    const plat = store.platforms.find(p => p.id === id);
    if (!plat) return;
    setEditingId(id);
    setName(plat.name);
    setFeePercent(plat.feePercent.toString());
    setFixedFee(plat.fixedFee.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setFeePercent('');
    setFixedFee('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Plataformas de Venda</h2>
          <p className="text-slate-500 text-sm">Gerencie os canais de venda e suas taxas (comissões e taxas fixas).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-brand-primary/20 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-brand-primary" />
              {editingId ? 'Editar Plataforma' : 'Nova Plataforma'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                label="Nome da Plataforma" 
                placeholder="Ex: Mercado Livre" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Comissão (%)" 
                  type="number" 
                  step="0.1" 
                  placeholder="Ex: 12" 
                  value={feePercent} 
                  onChange={e => setFeePercent(e.target.value)} 
                  required 
                />
                <Input 
                  label="Taxa Fixa (R$)" 
                  type="number" 
                  step="0.01" 
                  placeholder="Ex: 3.00" 
                  value={fixedFee} 
                  onChange={e => setFixedFee(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="pt-2">
                {editingId ? (
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" className="w-1/2" onClick={cancelEdit}>Cancelar</Button>
                    <Button type="submit" className="w-1/2 bg-brand-primary hover:bg-brand-primary-dark">Salvar</Button>
                  </div>
                ) : (
                  <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary-dark flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Adicionar
                  </Button>
                )}
              </div>
            </form>
            <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-lg text-xs flex flex-col gap-2 text-slate-500">
               <span className="font-semibold text-slate-700">Como funciona o cálculo:</span>
               <p>A taxa da plataforma é deduzida do valor de venda junto com o custo do produto para calcular seu lucro real.</p>
               <p><span className="font-medium text-slate-600">Fórmula:</span> Lucro = Venda - Custo Produto - (Venda * Comissão%) - Taxa Fixa.</p>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
          {store.platforms.map(plat => (
            <Card key={plat.id} className="group relative border-l-4 border-l-brand-secondary hover:shadow-md transition-shadow">
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(plat.id)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => store.deletePlatform(plat.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <CardContent className="p-5">
                <div className="pr-12">
                  <h4 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                    <Store className="w-4 h-4 text-slate-400" />
                    {plat.name}
                  </h4>
                  
                  <div className="flex gap-4">
                    <div className="flex-1 bg-slate-50 p-2 rounded-md border border-slate-100">
                       <span className="text-xs text-slate-500 block mb-1">Comissão Base</span>
                       <span className="font-semibold text-brand-primary">{plat.feePercent.toFixed(1)}%</span>
                    </div>
                    <div className="flex-1 bg-slate-50 p-2 rounded-md border border-slate-100">
                       <span className="text-xs text-slate-500 block mb-1">Taxa Fixa/Item</span>
                       <span className="font-semibold text-brand-secondary">R$ {plat.fixedFee.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {store.platforms.length === 0 && (
            <div className="col-span-2 text-center p-12 text-slate-500 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
               Nenhuma plataforma cadastrada. Adicione sua primeira!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
