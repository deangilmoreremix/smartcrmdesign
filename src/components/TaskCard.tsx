import React from 'react';
import { Calendar, Clock, Mail, Video, FileText, MoreHorizontal, CheckCircle } from 'lucide-react';
import Avatar from './ui/Avatar';
import { getInitials, getAvatarByIndex } from '../utils/avatars';
import { useTheme } from '../contexts/ThemeContext';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    subtitle?: string;
    assignee?: {
      name: string;
      role: string;
      avatar?: string;
    };
    type: 'meeting' | 'proposal' | 'call' | 'follow-up';
    status: string;
    priority?: 'high' | 'medium' | 'low';
    dueDate?: Date;
    isHighlighted?: boolean;
  };
  index: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  const { isDark } = useTheme();

  const getCardClass = (highlighted: boolean) => {
    if (highlighted) {
      return `${isDark ? 'bg-gradient-to-br from-green-400/20 to-emerald-500/20 border-green-400/30' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'}`;
    }
    return `${isDark ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200'}`;
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'meeting': return isDark ? 'text-green-400' : 'text-green-600';
      case 'call': return isDark ? 'text-blue-400' : 'text-blue-600';
      case 'proposal': return isDark ? 'text-purple-400' : 'text-purple-600';
      default: return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return Video;
      case 'call': return Video;
      case 'proposal': return FileText;
      default: return CheckCircle;
    }
  };

  const TypeIcon = getTypeIcon(task.type);

  // Generate avatar for assignee if not provided
  const assigneeAvatar = task.assignee?.avatar || getAvatarByIndex(index, 'executives');

  return (
    <div className={`backdrop-blur-xl border rounded-2xl p-6 hover:${isDark ? 'bg-gray-800/70' : 'bg-gray-50'} transition-all duration-300 group ${getCardClass(task.isHighlighted)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar 
            src={assigneeAvatar}
            alt={task.assignee?.name || `User ${index}`}
            size="md"
            fallback={getInitials(task.assignee?.name || `User ${index}`)}
            status="online"
          />
          <div>
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {task.assignee?.name || `Team Member ${index + 1}`}
            </h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.assignee?.role || 'Sales Representative'}
            </p>
          </div>
        </div>
        <button className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'} transition-colors opacity-0 group-hover:opacity-100`}>
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-100'} ${getIconColor(task.type)}`}>
            <TypeIcon className="h-5 w-5" />
          </div>
          <div>
            <h4 className={`font-medium ${isDark ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'} transition-colors`}>
              {task.title}
            </h4>
            {task.subtitle && (
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{task.subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs ${isDark ? 'bg-white/10' : 'bg-gray-100'} ${getIconColor(task.type)}`}>
              {task.status}
            </span>
            {task.priority && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                task.priority === 'high' ? (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-800') :
                task.priority === 'medium' ? (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800') :
                (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800')
              }`}>
                {task.priority}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button className={`p-2 ${isDark ? 'bg-white/10 hover:bg-green-400/20' : 'bg-gray-100 hover:bg-green-100'} rounded-lg transition-colors`}>
              <Mail className={`h-4 w-4 ${isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-600'}`} />
            </button>
            {task.type === 'meeting' && (
              <button className={`p-2 ${isDark ? 'bg-white/10 hover:bg-green-400/20' : 'bg-gray-100 hover:bg-green-100'} rounded-lg transition-colors`}>
                <Calendar className={`h-4 w-4 ${isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-600'}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;