import React, { useState } from 'react';
import { useStore, Order } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Trash2, Pencil, X, Calendar, Package, TrendingUp, DollarSign } from 'lucide-react';
import { subDays, isAfter, startOfMonth, startOfYear, startOfWeek, parseISO } from 'date-fns';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const COLORS = ['#4f46e5', '#38bdf8', '#fbbf24', '#34d399', '#f472b6'];

export function DashboardView() {
  const store = useStore();

  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editCost, setEditCost] = useState('');

  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year' | 'all'>('month');

  const filterDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    const now = new Date();
    if (timeFilter === 'week') return isAfter(date, startOfWeek(now));
    if (timeFilter === 'month') return isAfter(date, startOfMonth(now));
    if (timeFilter === 'year') return isAfter(date, startOfYear(now));
    return true;
  };

  const completedOrders = store.orders.filter(o => o.status === 'Enviado' && filterDate(o.completedAt || o.createdAt));
  const completedJobs = store.productionJobs.filter(j => j.status === 'Concluido' && filterDate(j.completedAt || j.createdAt));

  const totalRevenue = completedOrders.reduce((acc, o) => acc + o.priceSold, 0);
  const totalCost = completedOrders.reduce((acc, o) => {
     const platformFee = (o.priceSold * (o.channelFeePercent / 100)) + o.channelFeeFixed;
     return acc + o.realCost + platformFee;
  }, 0);
  const netProfit = totalRevenue - totalCost;

  // Production Stats
  const productionCount = completedJobs.length;
  const estimatedProductionCost = completedJobs.reduce((acc, job) => {
    const product = store.products.find(p => p.id === job.productId);
    if (!product) return acc;
    
    // Simple estimation based on product specs (could be more precise if we saved cost in job)
    const filament = store.filaments.find(f => f.id === product.filamentId);
    const printer = store.printers.find(p => p.id === product.printerId);
    
    const filCost = filament ? (product.weightGrams * (filament.cost / filament.totalWeightGrams)) : 0;
    const energyCost = printer ? ((product.slicerTimeMinutes / 60) * (printer.powerWatts / 1000) * store.kwhPrice) : 0;
    const laborCost = (product.laborMinutes / 60) * store.laborHourlyRate;
    
    return acc + filCost + energyCost + laborCost;
  }, 0);

  const ordersByStatus = store.orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(ordersByStatus).map(([name, value]) => ({ name, value }));

  const channelData = completedOrders.reduce((acc, o) => {
    const platformFee = (o.priceSold * ((o.channelFeePercent || 0) / 100)) + (o.channelFeeFixed || 0);
    const profit = o.priceSold - o.realCost - platformFee;

    const existing = acc.find(x => x.name === o.channel);
    if (existing) {
      existing.Vendas += o.priceSold;
      existing.Lucro += profit;
    } else {
      acc.push({ name: o.channel || 'Desconhecido', Vendas: o.priceSold, Lucro: profit });
    }
    return acc;
  }, [] as {name: string, Vendas: number, Lucro: number}[]);

  const productionByProduct = completedJobs.reduce((acc, job) => {
    const product = store.products.find(p => p.id === job.productId);
    const name = product?.name || 'Desconhecido';
    const existing = acc.find(x => x.name === name);
    if (existing) {
      existing.Quantidade += 1;
    } else {
      acc.push({ name, Quantidade: 1 });
    }
    return acc;
  }, [] as {name: string, Quantidade: number}[]);

  const startEditOrder = (order: Order) => {
    setEditingOrderId(order.id);
    setEditPrice(order.priceSold.toString());
    setEditCost(order.realCost.toString());
  };

  const saveEditOrder = (id: string) => {
    store.updateOrder(id, {
      priceSold: parseFloat(editPrice) || 0,
      realCost: parseFloat(editCost) || 0
    });
    setEditingOrderId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Painel de Controle</h2>
          <p className="text-slate-500 text-sm">Acompanhe seu desempenho de vendas e produção.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg self-start">
          {(['week', 'month', 'year', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                timeFilter === f 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f === 'week' ? 'Semanal' : f === 'month' ? 'Mensal' : f === 'year' ? 'Anual' : 'Tudo'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><DollarSign className="w-4 h-4"/></div>
             <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Receita Bruta</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">R$ {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><TrendingUp className="w-4 h-4"/></div>
             <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lucro Líquido</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">R$ {netProfit.toFixed(2)}</p>
          <span className="text-emerald-500 text-xs font-medium mt-1 block">Margem: {totalRevenue > 0 ? ((netProfit/totalRevenue)*100).toFixed(1) : 0}%</span>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Package className="w-4 h-4"/></div>
             <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Itens Produzidos</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{productionCount} un</p>
          <span className="text-slate-400 text-[10px] mt-1 block">Período selecionado</span>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Calendar className="w-4 h-4"/></div>
             <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Custo Prod.</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">R$ {estimatedProductionCost.toFixed(2)}</p>
          <span className="text-slate-400 text-[10px] mt-1 block">Estimativa de custos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Vendas por Canal</CardTitle></CardHeader>
          <CardContent className="h-72">
            {channelData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val}`} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="Vendas" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Receita" />
                  <Bar dataKey="Lucro" fill="#10b981" radius={[4, 4, 0, 0]} name="Lucro Real" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-gray-400">Nenhum dado de venda.</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Produção por Produto</CardTitle></CardHeader>
          <CardContent className="h-72">
             {productionByProduct.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productionByProduct} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="Quantidade" fill="#38bdf8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-gray-400">Nenhuma produção no período.</div>
             )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações (Pedidos)</CardTitle>
        </CardHeader>
        <CardContent>
          {store.orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-medium">Data</th>
                    <th className="px-4 py-3 font-medium">Produto</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Canal</th>
                    <th className="px-4 py-3 font-medium text-right">Venda</th>
                    <th className="px-4 py-3 font-medium text-right">Taxas (Plat.)</th>
                    <th className="px-4 py-3 font-medium text-right">Custo (Prod.)</th>
                    <th className="px-4 py-3 font-medium text-right">Lucro Real</th>
                    <th className="px-4 py-3 font-medium text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                    {store.orders
                      .filter(o => o.status === 'Enviado' ? filterDate(o.completedAt || o.createdAt) : true)
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map(order => {
                    const product = store.products.find(p => p.id === order.productId);
                    const platformFee = (order.priceSold * ((order.channelFeePercent || 0) / 100)) + (order.channelFeeFixed || 0);

                    if (editingOrderId === order.id) {
                      return (
                        <tr key={order.id} className="border-b border-slate-100 bg-indigo-50/30">
                          <td colSpan={9} className="px-4 py-3">
                            <div className="flex gap-4 items-end">
                              <div className="flex-1">
                                <Input label="Valor da Venda (R$)" type="number" step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)} />
                              </div>
                              <div className="flex-1">
                                <Input label="Custo Realizado (R$)" type="number" step="0.01" value={editCost} onChange={e => setEditCost(e.target.value)} />
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setEditingOrderId(null)}><X className="w-4 h-4 mr-1"/> Cancelar</Button>
                                <Button onClick={() => saveEditOrder(order.id)}>Salvar</Button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={order.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="px-4 py-3 text-slate-600">
                          {new Date(order.completedAt || order.createdAt).toLocaleDateString()}
                          {order.completedAt && <span className="block text-[10px] text-green-500 font-medium">Concluído</span>}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">{product?.name || 'Desconhecido'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${order.status === 'Enviado' ? 'text-green-700 bg-green-100' : 'text-amber-700 bg-amber-100'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded">
                            {order.channel}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                          R$ {order.priceSold.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-orange-500">
                          - R$ {platformFee.toFixed(2)}
                          <span className="block text-[10px] text-gray-400 font-normal">({order.channelFeePercent}% + R${order.channelFeeFixed})</span>
                        </td>
                        <td className="px-4 py-3 text-right text-red-500">
                          - R$ {order.realCost.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                          R$ {(order.priceSold - order.realCost - platformFee).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                           <div className="flex justify-center gap-1">
                             <button onClick={() => startEditOrder(order)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><Pencil className="w-4 h-4" /></button>
                             <button onClick={() => store.deleteOrder(order.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-lg">
              Nenhuma transação registrada.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
