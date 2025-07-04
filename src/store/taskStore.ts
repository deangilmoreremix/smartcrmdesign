import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  contactId?: string;
  dealId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskStore {
  tasks: Record<string, Task>;
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: {
    '1': {
      id: '1',
      title: 'Follow up with Jane Doe',
      description: 'Discuss enterprise software requirements',
      completed: false,
      priority: 'high',
      dueDate: new Date('2024-02-10'),
      contactId: '1',
      dealId: '1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    '2': {
      id: '2',
      title: 'Prepare proposal for Ford',
      description: 'Create detailed proposal for marketing automation',
      completed: false,
      priority: 'medium',
      dueDate: new Date('2024-02-08'),
      contactId: '2',
      dealId: '2',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-18')
    },
    '3': {
      id: '3',
      title: 'Schedule demo with Zenith',
      description: 'Set up cloud infrastructure demo',
      completed: true,
      priority: 'medium',
      dueDate: new Date('2024-02-05'),
      contactId: '3',
      dealId: '3',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-20')
    }
  },
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set(state => ({
      tasks: { ...state.tasks, [newTask.id]: newTask }
    }));
  },

  updateTask: (id, updates) => {
    set(state => ({
      tasks: {
        ...state.tasks,
        [id]: {
          ...state.tasks[id],
          ...updates,
          updatedAt: new Date()
        }
      }
    }));
  },

  deleteTask: (id) => {
    set(state => {
      const { [id]: deleted, ...rest } = state.tasks;
      return { tasks: rest };
    });
  }
}));