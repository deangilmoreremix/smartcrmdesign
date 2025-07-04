import React from 'react';
import { useAITools } from '../AIToolsProvider';
import { Brain, Mail, Calendar, FileText, Zap } from 'lucide-react';

const AIToolsCard: React.FC = () => {
  const { openTool } = useAITools();

  const quickTools = [
    {
      name: 'Email Composer',
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      action: () => openTool('email-composer')
    },
    {
      name: 'Meeting Agenda',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      action: () => openTool('meeting-agenda')
    },
    {
      name: 'Proposal Generator',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      action: () => openTool('proposal-generator')
    },
    {
      name: 'Business Analysis',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      action: () => openTool('business-analysis')
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-full bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-600 mr-3">
          <Brain size={18} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">AI Tools</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {quickTools.map((tool, index) => (
          <button
            key={index}
            onClick={tool.action}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className={`p-2 rounded-lg ${tool.bgColor} inline-block mb-2`}>
              <tool.icon size={16} className={tool.color} />
            </div>
            <h3 className="font-medium text-gray-900 text-sm">{tool.name}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AIToolsCard;