import { create } from 'zustand';

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  contactId?: string;
  dealId?: string;
  type: 'meeting' | 'call' | 'demo' | 'presentation';
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

interface AppointmentStore {
  appointments: Record<string, Appointment>;
  isLoading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: {
    '1': {
      id: '1',
      title: 'Product Demo with Microsoft',
      description: 'Enterprise software demonstration',
      startTime: new Date('2024-02-15T14:00:00'),
      endTime: new Date('2024-02-15T15:00:00'),
      contactId: '1',
      dealId: '1',
      type: 'demo',
      status: 'scheduled',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    '2': {
      id: '2',
      title: 'Strategy Call with Ford',
      description: 'Discuss marketing automation strategy',
      startTime: new Date('2024-02-20T10:00:00'),
      endTime: new Date('2024-02-20T11:00:00'),
      contactId: '2',
      dealId: '2',
      type: 'call',
      status: 'scheduled',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-18')
    }
  },
  isLoading: false,
  error: null,

  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch appointments', isLoading: false });
    }
  },

  addAppointment: (appointmentData) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set(state => ({
      appointments: { ...state.appointments, [newAppointment.id]: newAppointment }
    }));
  },

  updateAppointment: (id, updates) => {
    set(state => ({
      appointments: {
        ...state.appointments,
        [id]: {
          ...state.appointments[id],
          ...updates,
          updatedAt: new Date()
        }
      }
    }));
  },

  deleteAppointment: (id) => {
    set(state => {
      const { [id]: deleted, ...rest } = state.appointments;
      return { appointments: rest };
    });
  }
}));