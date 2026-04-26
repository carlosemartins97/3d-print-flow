import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function SettingsView() {
  const store = useStore();
  const [kwhPrice, setKwh] = useState(store.kwhPrice.toString());
  const [labor, setLabor] = useState(store.laborHourlyRate.toString());
  const [tax, setTax] = useState(store.taxPercent.toString());

  const handleSave = () => {
    store.updateSettings({
      kwhPrice: parseFloat(kwhPrice),
      laborHourlyRate: parseFloat(labor),
      taxPercent: parseFloat(tax),
    });
    alert('Configurações salvas!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações Gerais</h2>
        <p className="text-gray-500">Defina os custos base para cálculo de precificação.</p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Custos Base</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            label="Preço do kWh (R$)" 
            type="number" step="0.01" 
            value={kwhPrice} 
            onChange={e => setKwh(e.target.value)} 
          />
          <Input 
            label="Valor da Hora Técnica / Mão de Obra (R$)" 
            type="number" step="0.5" 
            value={labor} 
            onChange={e => setLabor(e.target.value)} 
            placeholder="Ex: 25.00"
          />
          <Input 
            label="Imposto Médio (DAS / MEI) %" 
            type="number" step="0.1" 
            value={tax} 
            onChange={e => setTax(e.target.value)} 
            placeholder="Ex: 6%"
          />
          <Button onClick={handleSave} className="w-full mt-4">Salvar Configurações</Button>
        </CardContent>
      </Card>
    </div>
  );
}
