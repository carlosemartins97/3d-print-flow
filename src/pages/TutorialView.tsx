import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Settings, Box, ShoppingBag, Package, BarChart } from 'lucide-react';

export function TutorialView() {
  const steps = [
    {
      title: 'Passo 1: Ajuste suas Configurações',
      icon: Settings,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
      content: (
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
          <li>Acesse a aba <strong>Configurações</strong>.</li>
          <li>Defina o valor da sua conta de energia (R$/kWh).</li>
          <li>Estipule o valor da sua hora técnica de trabalho (para modelagem e pós-processamento).</li>
          <li>Insira a porcentagem de imposto que você paga sobre cada venda (ex: alíquota do MEI ou Simples).</li>
        </ul>
      )
    },
    {
      title: 'Passo 2: Monte seu Inventário',
      icon: Box,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      content: (
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
          <li>Acesse <strong>Inventário e Ativos</strong>.</li>
          <li>Cadastre seus carretéis de filamento informando a marca, material, peso e valor pago. O sistema calculará o custo exato por grama.</li>
          <li>Você poderá acompanhar visualmente a quantidade de material restante conforme realiza vendas.</li>
        </ul>
      )
    },
    {
      title: 'Passo 3: Precifique seu Catálogo',
      icon: ShoppingBag,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      content: (
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
          <li>Vá em <strong>Catálogo e Preços</strong> para criar a "Ficha Técnica" de uma peça.</li>
          <li>Insira as estimativas do fatiador (tempo e peso).</li>
          <li>Configure sua margem de lucro (Markup). O sistema criará o preço de venda sugerido somando custos (filamento, energia e falhas estimadas).</li>
          <li>Quando realizar uma venda, você poderá gerar um pedido rapidamente.</li>
        </ul>
      )
    },
    {
      title: 'Passo 4: Controle a Produção',
      icon: Package,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      content: (
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
          <li>Em <strong>Pedidos e Produção</strong>, você gerencia a fila em um quadro Kanban.</li>
          <li>Ao iniciar uma impressão, o sistema roda um <strong>Timer</strong>. Se a peça falhar, clique no botão correspondente para que o algoritmo gere inteligência sobre a taxa de sucesso daquele filamento.</li>
          <li>Desloque as peças pelas etapas (Pós-processamento, Embalado) até o Envio.</li>
        </ul>
      )
    },
    {
      title: 'Passo 5: Analise seus Ganhos',
      icon: BarChart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      content: (
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
          <li>Confira o <strong>Dashboard</strong>.</li>
          <li>Lá você terá a visualização do seu lucro líquido <strong>real</strong> (já subtraindo energia e material).</li>
          <li>Entenda qual meio de venda traz mais retorno e onde sua dedicação vale mais a pena.</li>
        </ul>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Como usar a Plataforma</h2>
        <p className="text-slate-500 text-sm">Entenda o fluxo completo para precificar corretamente e lucrar de verdade.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, idx) => (
          <Card key={idx} className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                 <div className={`w-10 h-10 ${step.bgColor} ${step.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                   <step.icon className="w-5 h-5" />
                 </div>
                 <CardTitle className="text-base leading-tight">{step.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              {step.content}
            </CardContent>
          </Card>
        ))}
        
        <Card className="h-full flex flex-col bg-slate-50 border-dashed">
            <CardHeader>
               <CardTitle className="text-base text-slate-600">Dica de Ouro</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-slate-600">
                 Registrar falhas no sistema é crucial. Cada "spaghetti" absorve seu lucro. O <strong>PrintFlow Pro</strong> ajusta seu custo de forma automática quando você assume as falhas e constrói uma margem de segurança no seu catálogo.
               </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
