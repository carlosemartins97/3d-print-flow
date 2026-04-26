import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type Filament = {
  id: string;
  brand: string;
  material: string;
  color: string;
  colorHex?: string;
  totalWeightGrams: number;
  cost: number;
  remainingWeightGrams: number;
  successCount: number;
  failureCount: number;
};

export type Printer = {
  id: string;
  name: string;
  cost: number;
  lifeHours: number;
  powerWatts: number;
  usedHours: number;
};

export type Packaging = {
  id: string;
  name: string;
  size: string;
  weightGrams: number;
  cost: number;
  stockQuantity: number;
};

export type ExternalItem = {
  id: string;
  name: string;
  packageQuantity: number;
  cost: number;
  stockQuantity: number;
};

export type ProductExternalItem = {
  itemId: string;
  quantity: number;
};

export type Product = {
  id: string;
  name: string;
  filamentId: string;
  printerId: string;
  packagingId?: string;
  externalItems?: ProductExternalItem[];
  slicerTimeMinutes: number;
  weightGrams: number;
  laborMinutes: number;
  markupPercent: number;
  isPackaged: boolean;
  stockQuantity: number;
  
  // Marketplace Listing Info
  listingTitle?: string;
  listingDescription?: string;
  listingCategory?: string;
  listingImages?: string[];
  shippingWeightGrams?: number;
  shippingWidthCm?: number;
  shippingHeightCm?: number;
  shippingLengthCm?: number;
};

export type ProductionStatus = 'Aguardando' | 'Imprimindo' | 'PosProcessamento' | 'Concluido';

export type ProductionJob = {
  id: string;
  productId: string;
  status: ProductionStatus;
  createdAt: string;
  timerStartedAt?: string | null;
  realTimeMinutes?: number;
  isFailed?: boolean;
  completedAt?: string;
  trackingCode?: string;
};

export type OrderStatus = 'Pendente' | 'Embalando' | 'Enviado';

export type Order = {
  id: string;
  productId: string;
  status: OrderStatus;
  channel: string;
  platformId?: string;
  priceSold: number;
  shippingPaidBy: 'Vendedor' | 'Comprador';
  shippingCost: number;
  channelFeePercent: number;
  channelFeeFixed: number;
  realCost: number;
  createdAt: string;
  itemsConsumed?: boolean;
  completedAt?: string;
  trackingCode?: string;
};

export type Platform = {
  id: string;
  name: string;
  feePercent: number;
  fixedFee: number;
};

interface AppState {
  // Data
  filaments: Filament[];
  printers: Printer[];
  packagings: Packaging[];
  externalItems: ExternalItem[];
  platforms: Platform[];
  products: Product[];
  orders: Order[];
  productionJobs: ProductionJob[];
  
  // Settings
  kwhPrice: number;
  laborHourlyRate: number;
  taxPercent: number; // MEI DAS etc (simplified as % or fixed contextually, we'll use %)

  // Actions
  addFilament: (filament: Omit<Filament, 'id' | 'remainingWeightGrams' | 'successCount' | 'failureCount'>) => void;
  addPrinter: (printer: Omit<Printer, 'id' | 'usedHours'>) => void;
  addPackaging: (packaging: Omit<Packaging, 'id' | 'stockQuantity'> & { stockQuantity?: number }) => void;
  addExternalItem: (item: Omit<ExternalItem, 'id' | 'stockQuantity'> & { stockQuantity?: number }) => void;
  addPlatform: (platform: Omit<Platform, 'id'>) => void;
  addProduct: (product: Omit<Product, 'id' | 'stockQuantity'> & { stockQuantity?: number }) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'> & { trackingCode?: string }) => void;
  addProductionJob: (job: Omit<ProductionJob, 'id' | 'createdAt' | 'status'> & { trackingCode?: string }) => void;
  
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateProductionStatus: (jobId: string, status: ProductionStatus) => void;
  startProductionTimer: (jobId: string) => void;
  stopProductionTimer: (jobId: string, isFailed: boolean) => void;
  
  updateSettings: (settings: Partial<{kwhPrice: number, laborHourlyRate: number, taxPercent: number}>) => void;

  updateFilament: (id: string, data: Partial<Filament>) => void;
  deleteFilament: (id: string) => void;
  updatePrinter: (id: string, data: Partial<Printer>) => void;
  deletePrinter: (id: string) => void;
  updatePackaging: (id: string, data: Partial<Packaging>) => void;
  deletePackaging: (id: string) => void;
  updateExternalItem: (id: string, data: Partial<ExternalItem>) => void;
  deleteExternalItem: (id: string) => void;
  updatePlatform: (id: string, data: Partial<Platform>) => void;
  deletePlatform: (id: string) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  deleteProductionJob: (id: string) => void;
  produceProductToStock: (productId: string, quantity: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      filaments: [],
      printers: [],
      packagings: [],
      externalItems: [],
      platforms: [
        { id: 'plat-1', name: 'Venda Direta', feePercent: 0, fixedFee: 0 },
        { id: 'plat-2', name: 'Mercado Livre', feePercent: 12, fixedFee: 3 },
        { id: 'plat-3', name: 'Shopee', feePercent: 14, fixedFee: 3 }
      ],
      products: [],
      orders: [],
      productionJobs: [],
      
      kwhPrice: 0.95, // Default average BRL
      laborHourlyRate: 25.00,
      taxPercent: 6.0, 

      addFilament: (f) => set((state) => ({
        filaments: [...state.filaments, { ...f, id: uuidv4(), remainingWeightGrams: f.totalWeightGrams, successCount: 0, failureCount: 0 }]
      })),
      addPrinter: (p) => set((state) => ({
        printers: [...state.printers, { ...p, id: uuidv4(), usedHours: 0 }]
      })),
      addPackaging: (pkg) => set((state) => ({
        packagings: [...state.packagings, { ...pkg, id: uuidv4(), stockQuantity: pkg.stockQuantity || 0 }]
      })),
      addExternalItem: (item) => set((state) => ({
        externalItems: [...state.externalItems, { ...item, id: uuidv4(), stockQuantity: item.stockQuantity || 0 }]
      })),
      addPlatform: (platform) => set((state) => ({
        platforms: [...state.platforms, { ...platform, id: uuidv4() }]
      })),
      addProduct: (prod) => set((state) => ({
        products: [...state.products, { ...prod, id: uuidv4(), stockQuantity: prod.stockQuantity || 0 }]
      })),
      addOrder: (ord) => set((state) => ({
        orders: [...state.orders, { ...ord, id: uuidv4(), createdAt: new Date().toISOString() }]
      })),
      addProductionJob: (job) => set((state) => ({
        productionJobs: [...state.productionJobs, { ...job, id: uuidv4(), status: 'Aguardando', createdAt: new Date().toISOString() }]
      })),

      updateFilament: (id, data) => set((state) => ({
        filaments: state.filaments.map(f => f.id === id ? { ...f, ...data } : f)
      })),
      deleteFilament: (id) => set((state) => ({
        filaments: state.filaments.filter(f => f.id !== id)
      })),
      updatePrinter: (id, data) => set((state) => ({
        printers: state.printers.map(p => p.id === id ? { ...p, ...data } : p)
      })),
      deletePrinter: (id) => set((state) => ({
        printers: state.printers.filter(p => p.id !== id)
      })),
      updatePackaging: (id, data) => set((state) => ({
        packagings: state.packagings.map(p => p.id === id ? { ...p, ...data } : p)
      })),
      deletePackaging: (id) => set((state) => ({
        packagings: state.packagings.filter(p => p.id !== id)
      })),
      updateExternalItem: (id, data) => set((state) => ({
        externalItems: state.externalItems.map(p => p.id === id ? { ...p, ...data } : p)
      })),
      deleteExternalItem: (id) => set((state) => ({
        externalItems: state.externalItems.filter(p => p.id !== id)
      })),
      updatePlatform: (id, data) => set((state) => ({
        platforms: state.platforms.map(p => p.id === id ? { ...p, ...data } : p)
      })),
      deletePlatform: (id) => set((state) => ({
        platforms: state.platforms.filter(p => p.id !== id)
      })),
      updateProduct: (id, data) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...data } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      updateOrder: (id, data) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, ...data } : o)
      })),
      deleteOrder: (id) => set((state) => ({
        orders: state.orders.filter(o => o.id !== id)
      })),
      deleteProductionJob: (id) => set((state) => ({
        productionJobs: state.productionJobs.filter(j => j.id !== id)
      })),
      
      produceProductToStock: (productId, quantity) => set((state) => {
        const product = state.products.find(p => p.id === productId);
        if (!product) return state;

        let updatedFilaments = state.filaments;
        let updatedExternalItems = state.externalItems;
        let updatedPackagings = state.packagings;

        // Deduct filament
        updatedFilaments = state.filaments.map(f => {
            if (f.id === product.filamentId) {
                return { ...f, remainingWeightGrams: Math.max(0, f.remainingWeightGrams - (product.weightGrams * quantity)) };
            }
            return f;
        });

        // Deduct external items
        if (product.externalItems && product.externalItems.length > 0) {
            updatedExternalItems = state.externalItems.map(ext => {
                const prodExt = product.externalItems!.find(pe => pe.itemId === ext.id);
                if (prodExt) {
                    return { ...ext, stockQuantity: Math.max(0, (ext.stockQuantity || 0) - (prodExt.quantity * quantity)) };
                }
                return ext;
            });
        }

        // Deduct packaging
        if (product.packagingId) {
            updatedPackagings = state.packagings.map(pkg => {
                if (pkg.id === product.packagingId) {
                    return { ...pkg, stockQuantity: Math.max(0, pkg.stockQuantity - quantity) };
                }
                return pkg;
            });
        }

        return {
            products: state.products.map(p => p.id === productId ? { ...p, stockQuantity: (p.stockQuantity || 0) + quantity } : p),
            filaments: updatedFilaments,
            externalItems: updatedExternalItems,
            packagings: updatedPackagings,
        };
      }),
      
      updateProductionStatus: (jobId, status) => set((state) => {
        const job = state.productionJobs.find(j => j.id === jobId);
        if (!job) return state;

        let newState = { ...state };
        
        // If moving to Concluido, add to stock! We consume materials if not already done.
        // To be safe and simple, we can just consume everything when it finishes.
        // Wait, filament is consumed in stopProductionTimer. 
        if (status === 'Concluido' && job.status !== 'Concluido') {
             const product = state.products.find(p => p.id === job.productId);
             if (product) {
                 // add 1 to stock
                 newState.products = state.products.map(p => p.id === product.id ? { ...p, stockQuantity: (p.stockQuantity || 0) + 1 } : p);
                 // consume external items and packaging
                 if (product.externalItems && product.externalItems.length > 0) {
                     newState.externalItems = state.externalItems.map(ext => {
                         const prodExt = product.externalItems!.find(pe => pe.itemId === ext.id);
                         if (prodExt) {
                             return { ...ext, stockQuantity: Math.max(0, (ext.stockQuantity || 0) - prodExt.quantity) };
                         }
                         return ext;
                     });
                 }
                 if (product.packagingId) {
                     newState.packagings = state.packagings.map(pkg => {
                         if (pkg.id === product.packagingId) {
                             return { ...pkg, stockQuantity: Math.max(0, (pkg.stockQuantity || 0) - 1) };
                         }
                         return pkg;
                     });
                 }
             }
        }

        newState.productionJobs = state.productionJobs.map(j => j.id === jobId ? { 
          ...j, 
          status, 
          completedAt: status === 'Concluido' ? new Date().toISOString() : j.completedAt 
        } : j);
        return newState;
      }),

      updateOrderStatus: (id, status) => set((state) => {
        const order = state.orders.find(o => o.id === id);
        if (!order) return state;

        let newState = { ...state };

        // When order finishes (Enviado), deduct 1 from stock
        if (status === 'Enviado' && order.status !== 'Enviado' && !order.itemsConsumed) {
            const product = state.products.find(p => p.id === order.productId);
            if (product) {
                newState.products = state.products.map(p => p.id === product.id ? { ...p, stockQuantity: Math.max(0, (p.stockQuantity || 0) - 1) } : p);
            }
            newState.orders = state.orders.map(o => o.id === id ? { 
                ...o, 
                status, 
                itemsConsumed: true, 
                completedAt: new Date().toISOString() 
            } : o);
            return newState;
        }

        newState.orders = state.orders.map(o => o.id === id ? { 
          ...o, 
          status, 
          completedAt: status === 'Enviado' ? new Date().toISOString() : o.completedAt 
        } : o);
        return newState;
      }),
      
      startProductionTimer: (id) => set((state) => ({
        productionJobs: state.productionJobs.map(j => j.id === id ? { ...j, timerStartedAt: new Date().toISOString(), status: 'Imprimindo' } : j)
      })),
      
      stopProductionTimer: (id, isFailed) => set((state) => {
        const job = state.productionJobs.find(j => j.id === id);
        if (!job || !job.timerStartedAt) return state;
        
        const start = new Date(job.timerStartedAt).getTime();
        const end = new Date().getTime();
        const diffMinutes = Math.round((end - start) / 60000);
        
        const product = state.products.find(p => p.id === job.productId);
        let updatedFilaments = state.filaments;
        let updatedPrinters = state.printers;
        
        if (product) {
            updatedFilaments = state.filaments.map(f => {
                if (f.id === product.filamentId) {
                    return {
                        ...f,
                        failureCount: isFailed ? f.failureCount + 1 : f.failureCount,
                        successCount: !isFailed ? f.successCount + 1 : f.successCount,
                        remainingWeightGrams: Math.max(0, f.remainingWeightGrams - product.weightGrams)
                    }
                }
                return f;
            });

            updatedPrinters = state.printers.map(p => {
                if (p.id === product.printerId) {
                    return { ...p, usedHours: p.usedHours + (diffMinutes / 60) }
                }
                return p;
            });
        }

        return {
          productionJobs: state.productionJobs.map(j => j.id === id ? { 
              ...j, 
              timerStartedAt: null, 
              realTimeMinutes: (j.realTimeMinutes || 0) + diffMinutes,
              isFailed: isFailed,
              status: isFailed ? 'Aguardando' : 'PosProcessamento' 
          } : j),
          filaments: updatedFilaments,
          printers: updatedPrinters
        };
      }),
      
      updateSettings: (settings) => set((state) => ({ ...state, ...settings }))
    }),
    {
      name: 'printmanager-storage',
    }
  )
);
