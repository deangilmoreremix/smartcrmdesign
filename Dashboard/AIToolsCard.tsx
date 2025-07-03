import React from 'react';
import { useAITools } from '../AIToolsProvider';
import { 
  Brain, 
  Mail, 
  MessageSquare, 
  FileText, 
  Phone, 
  Target, 
  FileSearch, 
  TrendingUp, 
  BarChart3, 
  PieChart,
  ChevronRight,
  CheckCheck,
  ArrowRight,
  Play,
  User,
  Clock,
  Star,
  ExternalLink,
  BarChart,
  Users,
  Briefcase,
  Eye,
  Image,
  Mic,
  Search,
  Zap,
  MessagesSquare,
  CheckCircle,
  Sparkles,
  Shield,
  Reply,
  Calendar,
  Volume2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AIToolsCard: React.FC = () => {
  const { openTool } = useAITools();

  const tools = [
    {
      name: "Smart Email Composer",
      icon: <Mail className="h-5 w-5 text-blue-600" />,
      id: "email-composer" as const,
    },
    {
      name: "Email Analysis",
      icon: <Mail className="h-5 w-5 text-blue-600" />,
      id: "email-analysis" as const,
    },
    {
      name: "Meeting Summary",
      icon: <MessageSquare className="h-5 w-5 text-purple-600" />,
      id: "meeting-summary" as const,
    },
    {
      name: "Proposal Generator",
      icon: <FileText className="h-5 w-5 text-emerald-600" />,
      id: "proposal-generator" as const,
    },
    {
      name: "Call Script",
      icon: <Phone className="h-5 w-5 text-indigo-600" />,
      id: "call-script" as const,
    },
    {
      name: "Customer Persona",
      icon: <Users className="h-5 w-5 text-emerald-600" />,
      id: "customer-persona" as const,
    }
  ];

  const additionalTools = [
    {
      name: "Subject Line Optimizer",
      icon: <Target className="h-5 w-5 text-rose-600" />,
      id: "subject-optimizer" as const,
    },
    {
      name: "Competitor Analysis",
      icon: <FileSearch className="h-5 w-5 text-amber-600" />,
      id: "competitor-analysis" as const,
    },
    {
      name: "Market Trend Analysis",
      icon: <TrendingUp className="h-5 w-5 text-cyan-600" />,
      id: "market-trends" as const,
    },
    {
      name: "Objection Handler",
      icon: <Shield className="h-5 w-5 text-indigo-600" />,
      id: "objection-handler" as const,
    },
    {
      name: "Email Response",
      icon: <Reply className="h-5 w-5 text-teal-600" />,
      id: "email-response" as const,
    },
    {
      name: "Visual Content Generator",
      icon: <Image className="h-5 w-5 text-rose-600" />,
      id: "visual-content-generator" as const,
    },
    {
      name: "Meeting Agenda",
      icon: <Calendar className="h-5 w-5 text-amber-600" />,
      id: "meeting-agenda" as const,
    },
    {
      name: "Voice Tone Optimizer",
      icon: <Volume2 className="h-5 w-5 text-purple-600" />,
      id: "voice-tone-optimizer" as const,
    },
    // New OpenAI features
    {
      name: "AI Assistant",
      icon: <Brain className="h-5 w-5 text-violet-600" />,
      id: "ai-assistant" as const,
      isNew: true
    },
    {
      name: "Vision Analyzer",
      icon: <Eye className="h-5 w-5 text-fuchsia-600" />,
      id: "vision-analyzer" as const,
      isNew: true
    },
    {
      name: "Image Generator",
      icon: <Image className="h-5 w-5 text-emerald-600" />,
      id: "image-generator" as const,
      isNew: true
    },
    {
      name: "Semantic Search",
      icon: <Search className="h-5 w-5 text-blue-600" />,
      id: "semantic-search" as const,
      isNew: true
    },
    // Enhanced features
    {
      name: "Streaming Chat",
      icon: <MessageSquare className="h-5 w-5 text-blue-600" />,
      id: "streaming-chat" as const,
      isNew: true
    },
    {
      name: "Function Assistant",
      icon: <Zap className="h-5 w-5 text-yellow-600" />,
      id: "function-assistant" as const,
      isNew: true
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 mr-2">
            <Brain className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">AI Tools</h2>
        </div>
        <Link
          to="/ai-tools"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => openTool(tool.id)}
            className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-200 transition-colors relative"
          >
            {tool.icon}
            <span className="mt-2 text-xs text-gray-700">{tool.name}</span>
          </button>
        ))}
        {/* New Featured Tools */}
        <button
          onClick={() => openTool('function-assistant')}
          className="flex flex-col items-center p-3 border border-yellow-200 rounded-lg bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-300 transition-colors relative"
        >
          <Zap className="h-5 w-5 text-yellow-600" />
          <span className="mt-2 text-xs text-yellow-700">Function Assistant</span>
          <span className="absolute top-0 right-0 -mt-2 -mr-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">NEW</span>
        </button>
        
        <button
          onClick={() => openTool('vision-analyzer')}
          className="flex flex-col items-center p-3 border border-fuchsia-200 rounded-lg bg-fuchsia-50 hover:bg-fuchsia-100 hover:border-fuchsia-300 transition-colors relative"
        >
          <Eye className="h-5 w-5 text-fuchsia-600" />
          <span className="mt-2 text-xs text-fuchsia-700">Vision Analyzer</span>
          <span className="absolute top-0 right-0 -mt-2 -mr-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">NEW</span>
        </button>
      </div>
    </div>
  );
};

export default AIToolsCard;