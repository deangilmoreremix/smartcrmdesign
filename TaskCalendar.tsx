import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Task } from '../types';
import { useTaskStore } from '../store/taskStore';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CheckCircle, AlertCircle, Clock, Calendar as CalendarIcon, Flag } from 'lucide-react';

// Setup localizer for react-big-calendar
const localizer = momentLocalizer(moment);

interface TaskCalendarProps {
  onTaskSelect?: (task: Task) => void;
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ onTaskSelect }) => {
  const { tasks } = useTaskStore();
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [date, setDate] = useState(new Date());
  const [showAll, setShowAll] = useState(false);
  
  // Format tasks as events for the calendar
  const events = useMemo(() => {
    return Object.values(tasks)
      .filter(task => task.dueDate || showAll) // Only show tasks with due dates unless showAll is true
      .map(task => ({
        id: task.id,
        title: task.title,
        start: task.dueDate || task.createdAt,
        end: task.dueDate || task.createdAt,
        allDay: !task.dueDate?.getHours(), // If no time is set, treat as all-day
        resource: task
      }));
  }, [tasks, showAll]);
  
  // Custom styling for events based on task status and priority
  const eventStyleGetter = (event: any) => {
    const task = event.resource as Task;
    const isOverdue = task.dueDate && !task.completed && task.dueDate < new Date();
    
    let backgroundColor = '#3B82F6'; // Default blue
    
    if (task.completed) {
      backgroundColor = '#10B981'; // Green for completed
    } else if (isOverdue) {
      backgroundColor = '#EF4444'; // Red for overdue
    } else if (task.priority === 'high') {
      backgroundColor = '#F97316'; // Orange for high priority
    } else if (task.priority === 'low') {
      backgroundColor = '#14B8A6'; // Teal for low priority
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        color: '#fff',
        border: 'none',
        opacity: task.completed ? 0.7 : 1,
        textDecoration: task.completed ? 'line-through' : 'none'
      }
    };
  };
  
  // Custom component for the toolbar
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      const newDate = new Date(toolbar.date);
      
      if (toolbar.view === 'month') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (toolbar.view === 'week') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
      
      toolbar.onNavigate('date', newDate);
    };
    
    const goToNext = () => {
      const newDate = new Date(toolbar.date);
      
      if (toolbar.view === 'month') {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (toolbar.view === 'week') {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      
      toolbar.onNavigate('date', newDate);
    };
    
    const goToToday = () => {
      toolbar.onNavigate('date', new Date());
    };
    
    return (
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={goToBack}
            className="p-1.5 rounded-md hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="p-1.5 rounded-md hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Today
          </button>
          <h3 className="text-lg font-medium text-gray-900 ml-2">
            {toolbar.label}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <div>
            <button 
              onClick={() => toolbar.onView('month')}
              className={`px-3 py-1.5 border text-sm rounded-md ${
                toolbar.view === 'month' 
                  ? 'bg-blue-100 border-blue-300 text-blue-800 font-medium'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
          </div>
          <div>
            <button 
              onClick={() => toolbar.onView('week')}
              className={`px-3 py-1.5 border text-sm rounded-md ${
                toolbar.view === 'week' 
                  ? 'bg-blue-100 border-blue-300 text-blue-800 font-medium'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
          </div>
          <div>
            <button 
              onClick={() => toolbar.onView('day')}
              className={`px-3 py-1.5 border text-sm rounded-md ${
                toolbar.view === 'day' 
                  ? 'bg-blue-100 border-blue-300 text-blue-800 font-medium'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Day
            </button>
          </div>
          <div>
            <div className="flex items-center ml-4">
              <input
                type="checkbox"
                id="show-all"
                checked={showAll}
                onChange={() => setShowAll(!showAll)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="show-all" className="ml-2 text-sm text-gray-600">
                Show tasks without dates
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Define all needed components in one object
  const calendarComponents = {
    toolbar: CustomToolbar,
    // @ts-ignore - the types don't include 'event' but it works
    event: ({ event }: any) => {
      const task = event.resource as Task;
      return (
        <div className="truncate">
          {task.completed && '✓ '}
          {event.title}
        </div>
      );
    },
    // @ts-ignore - the types don't include 'eventWrapper' but it works
    eventWrapper: ({ children, event }: any) => {
      const task = event.resource as Task;
      return (
        <div title={`${event.title} - ${task.priority} priority`}>
          {children}
        </div>
      );
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={{
          month: true,
          week: true,
          day: true
        }}
        view={view}
        date={date}
        onView={(newView: any) => setView(newView)}
        onNavigate={(newDate: Date) => setDate(newDate)}
        components={calendarComponents}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event: any) => {
          const task = event.resource as Task;
          if (onTaskSelect) {
            onTaskSelect(task);
          }
        }}
        popup
        popupOffset={{ x: 0, y: 10 }}
        tooltipAccessor={null} // Disable default tooltip
      />
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2" style={{ backgroundColor: '#10B981', borderRadius: '2px' }}></div>
          <span className="text-sm text-gray-700">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2" style={{ backgroundColor: '#3B82F6', borderRadius: '2px' }}></div>
          <span className="text-sm text-gray-700">Upcoming</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2" style={{ backgroundColor: '#F97316', borderRadius: '2px' }}></div>
          <span className="text-sm text-gray-700">High Priority</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2" style={{ backgroundColor: '#EF4444', borderRadius: '2px' }}></div>
          <span className="text-sm text-gray-700">Overdue</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCalendar;