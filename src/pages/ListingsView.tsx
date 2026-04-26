import React, { useState } from 'react';
import { useStore, Product } from '../store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Camera, Image as ImageIcon, Save, Trash2, Edit2, Package, Tag, Text, Ruler, Box } from 'lucide-react';

export function ListingsView() {
  const store = useStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Edit forms
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState('');
  
  const [sWeight, setSWeight] = useState('');
  const [sWidth, setSWidth] = useState('');
  const [sHeight, setSHeight] = useState('');
  const [sLength, setSLength] = useState('');

  const startEditing = (p: Product) => {
    setEditingId(p.id);
    setTitle(p.listingTitle || '');
    setDescription(p.listingDescription || '');
    setCategory(p.listingCategory || '');
    setImages(p.listingImages || []);
    setSWeight(p.shippingWeightGrams ? p.shippingWeightGrams.toString() : p.weightGrams.toString());
    setSWidth(p.shippingWidthCm ? p.shippingWidthCm.toString() : '');
    setSHeight(p.shippingHeightCm ? p.shippingHeightCm.toString() : '');
    setSLength(p.shippingLengthCm ? p.shippingLengthCm.toString() : '');
  };

  const handleSave = (id: string) => {
    store.updateProduct(id, {
      listingTitle: title,
      listingDescription: description,
      listingCategory: category,
      listingImages: images,
      shippingWeightGrams: parseInt(sWeight) || 0,
      shippingWidthCm: parseFloat(sWidth) || 0,
      shippingHeightCm: parseFloat(sHeight) || 0,
      shippingLengthCm: parseFloat(sLength) || 0,
    });
    setEditingId(null);
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()]);
      setNewImage('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Anúncios (Marketplace)</h2>
        <p className="text-gray-500">Cadastre fotos, descrições e dimensões de envio para anunciar nas plataformas.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {store.products.length === 0 ? (
           <div className="text-center p-12 text-slate-400 border border-dashed border-slate-300 rounded-xl bg-slate-50">
             Nenhum produto no catálogo para anunciar.
           </div>
        ) : (
          store.products.map(p => {
             const isEditing = editingId === p.id;
             const hasListing = !!p.listingTitle || !!p.listingDescription || (p.listingImages && p.listingImages.length > 0);

             return (
               <Card key={p.id}>
                 <CardContent className="p-6">
                    {!isEditing ? (
                      <div className="flex flex-col md:flex-row gap-6">
                         {/* Image Gallery Preview */}
                         <div className="w-full md:w-48 shrink-0 flex flex-col gap-2">
                             {p.listingImages && p.listingImages.length > 0 ? (
                                <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                                   <img src={p.listingImages[0]} alt={p.name} className="w-full h-full object-cover" />
                                </div>
                             ) : (
                                <div className="aspect-square bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                  <span className="text-xs">Sem foto</span>
                                </div>
                             )}
                             {p.listingImages && p.listingImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                  {p.listingImages.slice(1).map((img, idx) => (
                                      <div key={idx} className="w-10 h-10 shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                         <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                                      </div>
                                  ))}
                                </div>
                             )}
                         </div>

                         {/* Details */}
                         <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                               <div>
                                 <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                                 <p className="text-sm text-slate-500">Ref do Catálogo</p>
                               </div>
                               <Button variant="outline" size="sm" onClick={() => startEditing(p)}>
                                 <Edit2 className="w-4 h-4 mr-2" /> Editar Anúncio
                               </Button>
                            </div>

                            {hasListing ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                    <div className="mb-4">
                                      <span className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1"><Tag className="w-3 h-3 mr-1"/> Título do Anúncio</span>
                                      <p className="text-sm font-medium text-slate-800">{p.listingTitle || '-'}</p>
                                    </div>
                                    <div className="mb-4">
                                      <span className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1"><Text className="w-3 h-3 mr-1"/> Descrição</span>
                                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{p.listingDescription || '-'}</p>
                                    </div>
                                    <div className="mb-4">
                                      <span className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1"><Box className="w-3 h-3 mr-1"/> Categoria</span>
                                      <p className="text-sm text-slate-700">{p.listingCategory || '-'}</p>
                                    </div>
                                 </div>
                                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 h-fit">
                                    <h4 className="flex items-center text-sm font-semibold text-slate-800 mb-3"><Package className="w-4 h-4 mr-2"/> Dados Logísticos (Envio)</h4>
                                    <ul className="text-sm space-y-2 text-slate-600">
                                      <li className="flex justify-between"><span className="text-slate-500">Peso Bruto:</span> <span className="font-medium text-slate-900">{p.shippingWeightGrams || p.weightGrams}g</span></li>
                                      <li className="flex justify-between"><span className="text-slate-500">Largura (L):</span> <span className="font-medium text-slate-900">{p.shippingWidthCm ? p.shippingWidthCm + ' cm' : '-'}</span></li>
                                      <li className="flex justify-between"><span className="text-slate-500">Altura (A):</span> <span className="font-medium text-slate-900">{p.shippingHeightCm ? p.shippingHeightCm + ' cm' : '-'}</span></li>
                                      <li className="flex justify-between"><span className="text-slate-500">Comprimento (C):</span> <span className="font-medium text-slate-900">{p.shippingLengthCm ? p.shippingLengthCm + ' cm' : '-'}</span></li>
                                    </ul>
                                 </div>
                              </div>
                            ) : (
                               <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                                  Informações de anúncio incompletas. Clique no botão de editar para adicionar título, fotos e descrição.
                               </div>
                            )}
                         </div>
                      </div>
                    ) : (
                      <div className="space-y-6 bg-slate-50/50 p-4 rounded-xl -m-2 border border-slate-200">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Editando Anúncio: {p.name}</h3>
                            <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancelar</Button>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <Input label="Título do Anúncio (SEO friendly)" placeholder="Ex: Vaso Decorativo 3D Minimalista..." value={title} onChange={e => setTitle(e.target.value)} />
                               <Input label="Categoria Marketplace" placeholder="Ex: Casa e Decoração > Vasos" value={category} onChange={e => setCategory(e.target.value)} />
                               <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                 <textarea 
                                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
                                   placeholder="Benefícios principais, material, cuidados..."
                                   value={description}
                                   onChange={e => setDescription(e.target.value)}
                                 />
                               </div>
                               <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Fotos (URLs)</label>
                                  <div className="flex gap-2 mb-2">
                                     <Input placeholder="https://..." value={newImage} onChange={e => setNewImage(e.target.value)} className="flex-1" />
                                     <Button type="button" variant="secondary" onClick={handleAddImage}>Adicionar</Button>
                                  </div>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                      {images.map((img, idx) => (
                                          <div key={idx} className="relative w-16 h-16 group bg-white border border-slate-200 rounded-lg overflow-hidden shrink-0">
                                              <img src={img} alt="preview" className="w-full h-full object-cover" />
                                              <button 
                                                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                                className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                              ><Trash2 className="w-4 h-4" /></button>
                                          </div>
                                      ))}
                                  </div>
                               </div>
                            </div>
                            
                            <div className="space-y-4 border-l border-slate-200 pl-8">
                               <h4 className="font-semibold text-slate-800 flex items-center mb-4"><Ruler className="w-4 h-4 mr-2"/> Logística e Pacote</h4>
                               <p className="text-xs text-slate-500 mb-4">Preencha com o tamanho/peso **do pacote** pronto para envio, incluindo a caixa e plástico bolha.</p>
                               <div className="grid grid-cols-2 gap-4">
                                  <Input label="Peso total (g)" type="number" placeholder={p.weightGrams.toString()} value={sWeight} onChange={e => setSWeight(e.target.value)} />
                               </div>
                               <div className="grid grid-cols-3 gap-4">
                                  <Input label="Largura (cm)" type="number" step="0.1" placeholder="15" value={sWidth} onChange={e => setSWidth(e.target.value)} />
                                  <Input label="Altura (cm)" type="number" step="0.1" placeholder="10" value={sHeight} onChange={e => setSHeight(e.target.value)} />
                                  <Input label="Compr. (cm)" type="number" step="0.1" placeholder="20" value={sLength} onChange={e => setSLength(e.target.value)} />
                               </div>

                               <div className="pt-6">
                                  <Button className="w-full" onClick={() => handleSave(p.id)}>
                                     <Save className="w-4 h-4 mr-2" /> Salvar Anúncio
                                  </Button>
                               </div>
                            </div>
                         </div>
                      </div>
                    )}
                 </CardContent>
               </Card>
             );
          })
        )}
      </div>
    </div>
  );
}
