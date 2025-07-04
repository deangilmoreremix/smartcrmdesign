import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Customer {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  plan: string;
  status: string;
  domain?: string;
  subdomain?: string;
  customization: {
    logo?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
    favicon?: string;
  };
  created_at: Date;
  updated_at: Date;
}

interface CustomerStore {
  customers: Record<string, Customer>;
  isLoading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  updateCustomerLogo: (customerId: string, logoUrl: string) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => Promise<string>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: {},
  isLoading: false,
  error: null,

  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const customersMap = (data || []).reduce((acc, customer) => {
        acc[customer.id] = {
          ...customer,
          created_at: new Date(customer.created_at),
          updated_at: new Date(customer.updated_at)
        };
        return acc;
      }, {} as Record<string, Customer>);

      set({ customers: customersMap, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customers';
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateCustomerLogo: async (customerId: string, logoUrl: string) => {
    try {
      const customer = get().customers[customerId];
      if (!customer) {
        throw new Error('Customer not found');
      }

      const updatedCustomization = {
        ...customer.customization,
        logo: logoUrl
      };

      const { error } = await supabase
        .from('customers')
        .update({
          customization: updatedCustomization,
          updated_at: new Date().toISOString()
        })
        .eq('id', customerId);

      if (error) throw error;

      // Update local state
      set(state => ({
        customers: {
          ...state.customers,
          [customerId]: {
            ...state.customers[customerId],
            customization: updatedCustomization,
            updated_at: new Date()
          }
        }
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update customer logo';
      set({ error: errorMessage });
      throw error;
    }
  },

  addCustomer: async (customerData) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          ...customerData,
          customization: customerData.customization || {}
        }])
        .select()
        .single();

      if (error) throw error;

      const newCustomer: Customer = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      set(state => ({
        customers: { ...state.customers, [newCustomer.id]: newCustomer },
        isLoading: false
      }));

      return newCustomer.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add customer';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateCustomer: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        customers: {
          ...state.customers,
          [id]: {
            ...state.customers[id],
            ...updates,
            updated_at: new Date()
          }
        }
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update customer';
      set({ error: errorMessage });
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => {
        const { [id]: deleted, ...rest } = state.customers;
        return { customers: rest };
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete customer';
      set({ error: errorMessage });
      throw error;
    }
  }
}));