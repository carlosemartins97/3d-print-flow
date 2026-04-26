import React from 'react';
import { useStore, ProductionStatus } from '../store';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Trash2 } from 'lucide-react';

export function ProductionView() {
  const store = useStore();

  const statuses: { id: ProductionStatus, label: string }[] = [
    { id: 'Aguardando', label: 'Aguardar Impressão' },
    { id: 'Imprimindo', label: 'Imprimindo' },
    { id: 'PosProcessamento', label: 'Pós-processamento' },
    { id: 'Concluido', label: 'Concluído' },
  ];

  const handleFailPrint = (jobId: string) => {
    store.stopProductionTimer(jobId, true);
  };

  const handleFinishPrint = (jobId: string) => {
    store.stopProductionTimer(jobId, false);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-80px)]">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Produção Diária</h2>
        <p className="text-gray-500">Acompanhe e controle o fluxo de fabricação (Adiciona ao estoque quando Concluído).</p>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {statuses.map(column => {
          const colJobs = store.productionJobs.filter(j => j.status === column.id);
          return (
            <div key={column.id} className="min-w-[300px] w-1/4 flex flex-col bg-slate-50 rounded-xl p-3 border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-3 px-1">{column.label} <span className="text-xs font-medium text-slate-500 ml-1">({colJobs.length})</span></h3>
              
              <div className="flex-1 space-y-3 overflow-y-auto">
                {colJobs.map(job => {
                  const product = store.products.find(p => p.id === job.productId);
                  return (
                    <Card key={job.id} className="shadow-sm cursor-grab group relative">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => store.deleteProductionJob(job.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"><Trash2 className="w-3 h-3" /></button>
                      </div>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2 pr-8">
                          <span className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</span>
                          {job.trackingCode && (
                            <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">
                              #{job.trackingCode}
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-sm leading-tight mb-2">{product ? product.name : 'Produto Removido'}</h4>
                        
                        {/* Interactive Actions per Status */}
                        {column.id === 'Aguardando' && (
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 text-xs" onClick={() => store.startProductionTimer(job.id)}>
                              Iniciar
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => {
                               if (window.confirm('Marcar projeto direto como Concluído e adicionar ao estoque? (Consumirá todos os materiais, incluindo filamento)')) {
                                   if (product) {
                                       store.updateFilament(product.filamentId, {
                                           remainingWeightGrams: Math.max(0, (store.filaments.find(f => f.id === product.filamentId)?.remainingWeightGrams || 0) - product.weightGrams)
                                       });
                                   }
                                   store.updateProductionStatus(job.id, 'Concluido');
                               }
                            }}>
                              S/ Timer
                            </Button>
                          </div>
                        )}
                        
                        {column.id === 'Imprimindo' && (
                          <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
                             <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                <span className="text-xs text-gray-600 font-mono">Timer Rodando...</span>
                             </div>
                             <div className="flex gap-2">
                               <Button variant="danger" size="sm" className="w-1/2 text-xs" onClick={() => handleFailPrint(job.id)}>
                                 Falhar
                               </Button>
                               <Button variant="primary" size="sm" className="w-1/2 text-xs" onClick={() => handleFinishPrint(job.id)}>
                                 Avançar
                               </Button>
                             </div>
                          </div>
                        )}
                        
                        {column.id === 'PosProcessamento' && (
                           <div className="grid grid-cols-2 gap-1 mt-3">
                               <Button variant="outline" size="sm" className="text-xs" onClick={() => store.updateProductionStatus(job.id, 'Aguardando')}>
                                 Voltar
                               </Button>
                               <Button variant="secondary" size="sm" className="text-xs" onClick={() => store.updateProductionStatus(job.id, 'Concluido')}>
                                 Finalizar
                               </Button>
                           </div>
                        )}

                        {column.id === 'Concluido' && (
                            <div className="mt-2 text-xs text-green-600 bg-green-50 rounded px-2 py-1 text-center font-medium">+1 no Estoque</div>
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
