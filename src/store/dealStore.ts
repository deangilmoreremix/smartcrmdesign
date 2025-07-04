import { create } from 'zustand';

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  contactId: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  daysInStage?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DealStore {
  deals: Record<string, Deal>;
  isLoading: boolean;
  error: string | null;
  stageValues: Record<string, number>;
  totalPipelineValue: number;
  fetchDeals: () => Promise<void>;
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
}

export const useDealStore = create<DealStore>((set, get) => ({
  deals: {
    '1': {
      id: '1',
      title: 'Enterprise Software License',
      value: 75000,
      stage: 'negotiation',
      probability: 85,
      contactId: '1',
      dueDate: new Date('2024-02-15'),
      priority: 'high',
      daysInStage: 5,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    '2': {
      id: '2',
      title: 'Marketing Automation Platform',
      value: 45000,
      stage: 'proposal',
      probability: 65,
      contactId: '2',
      dueDate: new Date('2024-02-20'),
      priority: 'medium',
      daysInStage: 12,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-18')
    },
    '3': {
      id: '3',
      title: 'Cloud Infrastructure Setup',
      value: 125000,
      stage: 'qualification',
      probability: 40,
      contactId: '3',
      dueDate: new Date('2024-03-01'),
      priority: 'high',
      daysInStage: 8,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-20')
    },
    '4': {
      id: '4',
      title: 'CRM Integration',
      value: 25000,
      stage: 'closed-won',
      probability: 100,
      contactId: '4',
      priority: 'medium',
      daysInStage: 0,
      createdAt: new Date('2023-12-15'),
      updatedAt: new Date('2024-01-10')
    }
  },
  isLoading: false,
  error: null,
  stageValues: {},
  totalPipelineValue: 0,

  fetchDeals: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const deals = get().deals;
      const stageValues: Record<string, number> = {};
      let totalPipelineValue = 0;

      Object.values(deals).forEach(deal => {
        if (deal.stage !== 'closed-won' && deal.stage !== 'closed-lost') {
          stageValues[deal.stage] = (stageValues[deal.stage] || 0) + deal.value;
          totalPipelineValue += deal.value;
        }
      });

      set({ stageValues, totalPipelineValue, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch deals', isLoading: false });
    }
  },

  addDeal: (dealData) => {
    const newDeal: Deal = {
      ...dealData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set(state => ({
      deals: { ...state.deals, [newDeal.id]: newDeal }
    }));
  },

  updateDeal: (id, updates) => {
    set(state => ({
      deals: {
        ...state.deals,
        [id]: {
          ...state.deals[id],
          ...updates,
          updatedAt: new Date()
        }
      }
    }));
  },

  deleteDeal: (id) => {
    set(state => {
      const { [id]: deleted, ...rest } = state.deals;
      return { deals: rest };
    });
  }
}));