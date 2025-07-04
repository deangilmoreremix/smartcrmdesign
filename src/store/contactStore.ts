import { create } from 'zustand';
import { avatarCollection } from '../utils/avatars';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  avatar?: string;
  status: 'hot' | 'warm' | 'cold';
  source: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ContactStore {
  contacts: Record<string, Contact>;
  isLoading: boolean;
  error: string | null;
  fetchContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
}

export const useContactStore = create<ContactStore>((set, get) => ({
  contacts: {
    '1': {
      id: '1',
      name: 'Jane Doe',
      email: 'jane.doe@microsoft.com',
      phone: '+1 (555) 123-4567',
      company: 'Microsoft',
      position: 'Marketing Director',
      avatar: avatarCollection.women[0],
      status: 'hot',
      source: 'LinkedIn',
      tags: ['Enterprise', 'Software', 'High-Value'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    '2': {
      id: '2',
      name: 'Darlene Robertson',
      email: 'darlene.r@ford.com',
      phone: '+1 (555) 234-5678',
      company: 'Ford Motor Company',
      position: 'Financial Manager',
      avatar: avatarCollection.women[1],
      status: 'warm',
      source: 'LinkedIn',
      tags: ['Finance', 'Automotive', 'F500'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-18')
    },
    '3': {
      id: '3',
      name: 'Wade Warren',
      email: 'wade.warren@zenith.com',
      phone: '+1 (555) 345-6789',
      company: 'Zenith Corp',
      position: 'Operations Manager',
      avatar: avatarCollection.men[0],
      status: 'cold',
      source: 'Facebook',
      tags: ['Operations', 'Mid-Market'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-20')
    },
    '4': {
      id: '4',
      name: 'Jonah Jude',
      email: 'jonah.j@binaryit.com',
      phone: '+1 (555) 456-7890',
      company: 'Binary IT Solutions',
      position: 'Web Developer',
      avatar: avatarCollection.tech[0],
      status: 'warm',
      source: 'LinkedIn',
      tags: ['Technology', 'Development', 'SMB'],
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-22')
    },
    '5': {
      id: '5',
      name: 'Sarah Chen',
      email: 'sarah.chen@techstartup.com',
      phone: '+1 (555) 567-8901',
      company: 'TechStartup Inc',
      position: 'CTO',
      avatar: avatarCollection.executives[2],
      status: 'hot',
      source: 'Referral',
      tags: ['Executive', 'Technology', 'Startup'],
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-25')
    },
    '6': {
      id: '6',
      name: 'Michael Rodriguez',
      email: 'michael.r@globalsales.com',
      phone: '+1 (555) 678-9012',
      company: 'Global Sales Corp',
      position: 'Sales Director',
      avatar: avatarCollection.men[2],
      status: 'warm',
      source: 'Conference',
      tags: ['Sales', 'B2B', 'Enterprise'],
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-27')
    },
    '7': {
      id: '7',
      name: 'Emily Johnson',
      email: 'emily.j@marketingpro.com',
      phone: '+1 (555) 789-0123',
      company: 'Marketing Pro Agency',
      position: 'VP Marketing',
      avatar: avatarCollection.women[3],
      status: 'hot',
      source: 'LinkedIn',
      tags: ['Marketing', 'Agency', 'Creative'],
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-29')
    },
    '8': {
      id: '8',
      name: 'David Thompson',
      email: 'david.t@consulting.com',
      phone: '+1 (555) 890-1234',
      company: 'Thompson Consulting',
      position: 'Senior Consultant',
      avatar: avatarCollection.men[3],
      status: 'cold',
      source: 'Website',
      tags: ['Consulting', 'Strategy', 'Professional'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-30')
    }
  },
  isLoading: false,
  error: null,

  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch contacts', isLoading: false });
    }
  },

  addContact: (contactData) => {
    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set(state => ({
      contacts: { ...state.contacts, [newContact.id]: newContact }
    }));
  },

  updateContact: (id, updates) => {
    set(state => ({
      contacts: {
        ...state.contacts,
        [id]: {
          ...state.contacts[id],
          ...updates,
          updatedAt: new Date()
        }
      }
    }));
  },

  deleteContact: (id) => {
    set(state => {
      const { [id]: deleted, ...rest } = state.contacts;
      return { contacts: rest };
    });
  }
}));