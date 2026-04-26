import React from 'react';
import { useStore, OrderStatus } from '../store';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Trash2 } from 'lucide-react';

export function SalesView() {
  const store = useStore();

  const statuses: { id: OrderStatus, label: string }[] = [
    { id: 'Pendente', label: 'Pendente / Aguardando' },
    { id: 'Embalando', label: 'Embalando' },
    { id: 'Enviado', label: 'Enviado' },
  ];

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-80px)]">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pedidos de Venda</h2>
        <p className="text-gray-500">Acompanhe as vendas (os itens serão removidos do estoque de prontos quando Enviados).</p>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {statuses.map(column => {
          const colOrders = store.orders.filter(o => o.status === column.id);
          return (
            <div key={column.id} className="min-w-[300px] w-1/3 flex flex-col bg-slate-50 rounded-xl p-3 border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-3 px-1">{column.label} <span className="text-xs font-medium text-slate-500 ml-1">({colOrders.length})</span></h3>
              
              <div className="flex-1 space-y-3 overflow-y-auto">
                {colOrders.map(order => {
                  const product = store.products.find(p => p.id === order.productId);
                  return (
                    <Card key={order.id} className="shadow-sm cursor-grab group relative">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => store.deleteOrder(order.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"><Trash2 className="w-3 h-3" /></button>
                      </div>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2 pr-8">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded w-fit">
                              {order.channel}
                            </span>
                            {order.trackingCode && (
                              <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100 w-fit">
                                #{order.trackingCode}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">R$ {order.priceSold.toFixed(2)}</span>
                        </div>
                        <h4 className="font-medium text-sm leading-tight mb-2">{product ? product.name : 'Produto Removido'}</h4>
                        
                        {column.id !== 'Enviado' && (
                           <div className="grid grid-cols-2 gap-1 mt-3">
                               {column.id !== 'Pendente' ? (
                                   <Button variant="outline" size="sm" className="text-xs" onClick={() => store.updateOrderStatus(order.id, statuses[statuses.findIndex(s => s.id === column.id) - 1].id as OrderStatus)}>
                                     Voltar
                                   </Button>
                               ) : <div></div>}
                               <Button variant="secondary" size="sm" className="text-xs" onClick={() => store.updateOrderStatus(order.id, statuses[statuses.findIndex(s => s.id === column.id) + 1].id as OrderStatus)}>
                                 Avançar
                               </Button>
                           </div>
                        )}
                        {column.id === 'Enviado' && (
                            <div className="mt-2 text-xs text-green-600 bg-green-50 rounded px-2 py-1 text-center font-medium">Estoque deduzido.</div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
