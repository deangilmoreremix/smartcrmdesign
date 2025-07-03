import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useUser, useClerk } from '@clerk/clerk-react';
import { useAITools } from '../components/AIToolsProvider';
import { 
  Home, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Settings, 
  Menu, 
  X,
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
  ChevronDown,
  ChevronRight,
  Video,
  MessageCircle,
  CalendarDays,
  Map,
  FileSpreadsheet,
  Package,
  Receipt,
  Building,
  Music,
  Headphones,
  Image,
  HelpCircle,
  User,
  LogOut,
  Star,
  Shield,
  Reply,
  Volume2,
  Calendar,
  Eye,
  Search,
  FileCode,
  MessagesSquare,
  CheckCircle,
  Zap,
  ArrowRight,
  Mic,
  Sparkles,
  ExternalLink,
  Grid3X3,
  Megaphone,
  Palette
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [salesMenuOpen, setSalesMenuOpen] = useState(false);
  const [marketingMenuOpen, setMarketingMenuOpen] = useState(false);
  const [contentMenuOpen, setContentMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  // const { user, isSignedIn } = useUser();
  // const { signOut } = useClerk();
  
  // Temporary mock user data for development without Clerk
  const user = { 
    firstName: 'Demo', 
    lastName: 'User', 
    emailAddresses: [{ emailAddress: 'demo@smartcrm.com' }],
    imageUrl: null 
  };
  const isSignedIn = true;
  
  const { openTool } = useAITools();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleAiMenu = () => setAiMenuOpen(!aiMenuOpen);
  const toggleSalesMenu = () => setSalesMenuOpen(!salesMenuOpen);
  const toggleMarketingMenu = () => setMarketingMenuOpen(!marketingMenuOpen);
  const toggleContentMenu = () => setContentMenuOpen(!contentMenuOpen);
  
  const handleLogout = async () => {
    // await signOut(); // Temporary disabled for development
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;
  const isActiveParent = (path: string) => location.pathname.startsWith(path);

  if (!isSignedIn) {
    return null;
  }
  
  // Get user's initials for avatar
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center" data-tour="logo">
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              <span>Smart</span>
              <span>CRM</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-1" data-tour="navigation">
            {/* Main nav items */}
            <Link 
              to="/dashboard" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/dashboard') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              } transition-colors duration-200`}
            >
              <Home size={20} className="mr-2" />
              <span className="ml-2">Dashboard</span>
            </Link>
            
            <Link 
              to="/contacts" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActiveParent('/contacts') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              } transition-colors duration-200`}
            >
              <Users size={20} className="mr-2" />
              <span className="ml-2">Contacts</span>
            </Link>
            
            <Link 
              to="/pipeline" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActiveParent('/pipeline') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              } transition-colors duration-200`}
            >
              <Briefcase size={20} className="mr-2" />
              <span className="ml-2">Pipeline</span>
            </Link>
            
            <Link 
              to="/ai-goals" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/ai-goals') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              } transition-colors duration-200`}
            >
              <Target size={20} className="mr-2" />
              <span className="ml-2">AI Goals</span>
            </Link>
            
            {/* AI Tools dropdown */}
            <div className="relative group inline-block" data-tour="ai-tools">
              <button 
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActiveParent('/ai-tools') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                } transition-colors duration-200`}
              >
                <Brain size={20} className="mr-2" />
                <span className="ml-2">AI Tools</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              <div className="hidden group-hover:block absolute z-50 w-80 mt-1 bg-white rounded-md shadow-lg border border-gray-100 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="py-1">
                  {/* Core AI Tools */}
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    Core AI Tools
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openTool('email-analysis');
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Mail size={18} className="mr-2" />
                    Email Analysis
                  </button>
                  
                  <button
                    onClick={() => openTool('meeting-summary')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <MessageSquare size={18} className="mr-2" />
                    Meeting Summarizer
                  </button>
                  
                  <button
                    onClick={() => openTool('proposal-generator')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FileText size={18} className="mr-2" />
                    Proposal Generator
                  </button>
                  
                  <button
                    onClick={() => openTool('call-script')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Phone size={18} className="mr-2" />
                    Call Script Generator
                  </button>
                  
                  <button
                    onClick={() => openTool('subject-optimizer')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Star size={18} className="mr-2" />
                    Subject Line Optimizer
                  </button>
                  
                  <button
                    onClick={() => openTool('competitor-analysis')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Target size={18} className="mr-2" />
                    Competitor Analysis
                  </button>
                  
                  <button
                    onClick={() => openTool('market-trends')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TrendingUp size={18} className="mr-2" />
                    Market Trends
                  </button>
                  
                  <button
                    onClick={() => openTool('sales-insights')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <BarChart3 size={18} className="mr-2" />
                    Sales Insights
                  </button>
                  
                  <button
                    onClick={() => openTool('sales-forecast')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <PieChart size={18} className="mr-2" />
                    Sales Forecast
                  </button>
                  
                  {/* Communication Tools */}
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100 mt-2">
                    Communication
                  </div>
                  
                  <button
                    onClick={() => openTool('email-composer')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Mail size={18} className="mr-2" />
                    Email Composer
                  </button>
                  
                  <button
                    onClick={() => openTool('objection-handler')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Shield size={18} className="mr-2" />
                    Objection Handler
                  </button>
                  
                  <button
                    onClick={() => openTool('email-response')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Reply size={18} className="mr-2" />
                    Email Response
                  </button>
                  
                  <button
                    onClick={() => openTool('voice-tone-optimizer')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Volume2 size={18} className="mr-2" />
                    Voice Tone Optimizer
                  </button>
                  
                  {/* Customer & Content */}
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100 mt-2">
                    Customer & Content
                  </div>
                  
                  <button
                    onClick={() => openTool('customer-persona')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Users size={18} className="mr-2" />
                    Customer Persona
                  </button>
                  
                  <button
                    onClick={() => openTool('visual-content-generator')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Image size={18} className="mr-2" />
                    Visual Content Generator
                  </button>
                  
                  <button
                    onClick={() => openTool('meeting-agenda')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Calendar size={18} className="mr-2" />
                    Meeting Agenda
                  </button>
                  
                  {/* Advanced Features */}
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100 mt-2">
                    Advanced Features
                  </div>
                  
                  <button
                    onClick={() => openTool('ai-assistant')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Brain size={18} className="mr-2" />
                    AI Assistant
                  </button>
                  
                  <button
                    onClick={() => openTool('vision-analyzer')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Eye size={18} className="mr-2" />
                    Vision Analyzer
                  </button>
                  
                  <button
                    onClick={() => openTool('image-generator')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Image size={18} className="mr-2" />
                    Image Generator
                  </button>
                  
                  <button
                    onClick={() => openTool('semantic-search')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Search size={18} className="mr-2" />
                    Semantic Search
                  </button>
                  
                  <button
                    onClick={() => openTool('function-assistant')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FileCode size={18} className="mr-2" />
                    Function Assistant
                  </button>
                  
                  {/* Real-time Features */}
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100 mt-2">
                    Real-time Features
                  </div>
                  
                  <button
                    onClick={() => openTool('streaming-chat')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <MessagesSquare size={18} className="mr-2" />
                    Streaming Chat
                  </button>
                  
                  <button
                    onClick={() => openTool('form-validation')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <CheckCircle size={18} className="mr-2" />
                    Form Validation
                  </button>
                  
                  <button
                    onClick={() => openTool('live-deal-analysis')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Zap size={18} className="mr-2" />
                    Live Deal Analysis
                  </button>
                  
                  <button
                    onClick={() => openTool('instant-response')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <ArrowRight size={18} className="mr-2" />
                    Instant Response
                  </button>
                  
                  <button
                    onClick={() => openTool('realtime-email-composer')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Mail size={18} className="mr-2" />
                    Real-time Email Composer
                  </button>
                  
                  <button
                    onClick={() => openTool('voice-analysis-realtime')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Mic size={18} className="mr-2" />
                    Voice Analysis Real-time
                  </button>
                  
                  {/* Reasoning-based Generators */}
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100 mt-2">
                    Reasoning Generators
                  </div>
                  
                  <button
                    onClick={() => openTool('reasoning-email')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Sparkles size={18} className="mr-2" />
                    Reasoning Email
                  </button>
                  
                  <button
                    onClick={() => openTool('reasoning-proposal')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Sparkles size={18} className="mr-2" />
                    Reasoning Proposal
                  </button>
                  
                  <button
                    onClick={() => openTool('reasoning-script')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Sparkles size={18} className="mr-2" />
                    Reasoning Script
                  </button>
                  
                  <button
                    onClick={() => openTool('reasoning-objection')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Sparkles size={18} className="mr-2" />
                    Reasoning Objection
                  </button>
                  
                  <button
                    onClick={() => openTool('reasoning-social')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Sparkles size={18} className="mr-2" />
                    Reasoning Social
                  </button>
                </div>
              </div>
            </div>

            {/* Sales Tools dropdown */}
            <div className="relative group inline-block">
              <Link 
                to="/sales-tools"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActiveParent('/sales-tools') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                } transition-colors duration-200`}
              >
                <Target size={20} className="mr-2" />
                <span className="ml-2">Sales</span>
                <ChevronDown size={16} className="ml-1" />
              </Link>
              
              <div className="hidden group-hover:block absolute z-10 w-64 mt-1 bg-white rounded-md shadow-lg border border-gray-100">
                <div className="py-1">
                  <Link to="/sales-tools" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <Target size={18} className="mr-2" />
                    Sales Tools
                  </Link>
                  
                  <Link to="/lead-automation" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <BarChart3 size={18} className="mr-2" />
                    Lead Automation
                  </Link>
                  
                  <Link to="/circle-prospecting" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <Map size={18} className="mr-2" />
                    Circle Prospecting
                  </Link>
                  
                  <Link to="/appointments" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <CalendarDays size={18} className="mr-2" />
                    Appointments
                  </Link>
                  
                  <Link to="/phone-system" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <Phone size={18} className="mr-2" />
                    Phone System
                  </Link>
                  
                  <Link to="/invoicing" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <Receipt size={18} className="mr-2" />
                    Invoicing
                  </Link>
                </div>
              </div>
            </div>

            {/* Communication dropdown */}
            <div className="relative group inline-block">
              <button 
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 transition-colors duration-200`}
              >
                <MessageCircle size={20} className="mr-2" />
                <span className="ml-2">Communication</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              <div className="hidden group-hover:block absolute z-10 w-64 mt-1 bg-white rounded-md shadow-lg border border-gray-100">
                <div className="py-1">
                  <Link to="/video-email" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <Video size={18} className="mr-2" />
                    Video Email
                  </Link>
                  
                  <Link to="/text-messages" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <MessageSquare size={18} className="mr-2" />
                    Text Messages
                  </Link>
                  
                  <button
                    onClick={() => openTool('email-composer')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Mail size={18} className="mr-2" />
                    Email Composer
                  </button>
                  
                  <Link to="/campaigns" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <Target size={18} className="mr-2" />
                    Campaigns
                  </Link>
                </div>
              </div>
            </div>

            {/* Content & Tools dropdown */}
            <div className="relative group inline-block">
              <button 
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 transition-colors duration-200`}
              >
                <Package size={20} className="mr-2" />
                <span className="ml-2">Content</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              <div className="hidden group-hover:block absolute z-10 w-64 mt-1 bg-white rounded-md shadow-lg border border-gray-100">
                <div className="py-1">
                  <Link to="/content-library" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <Music size={18} className="mr-2" />
                    Content Library
                  </Link>
                  
                  <Link to="/voice-profiles" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <Headphones size={18} className="mr-2" />
                    Voice Profiles
                  </Link>
                  
                  <Link to="/business-analysis" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <Building size={18} className="mr-2" />
                    Business Analysis
                  </Link>
                  
                  <button
                    onClick={() => openTool('image-generator')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Image size={18} className="mr-2" />
                    Image Generator
                  </button>
                  
                  <Link to="/forms" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <FileSpreadsheet size={18} className="mr-2" />
                    Forms
                  </Link>
                </div>
              </div>
            </div>

            {/* Connected Apps dropdown */}
            <div className="relative group inline-block">
              <button 
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 transition-colors duration-200`}
              >
                <Grid3X3 size={20} className="mr-2" />
                <span className="ml-2">Apps</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              <div className="hidden group-hover:block absolute z-50 w-80 mt-1 bg-white rounded-md shadow-lg border border-gray-100">
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-900 mb-3">Connected Apps</div>
                  <div className="grid grid-cols-1 gap-3">
                    {/* FunnelCraft AI */}
                    <a 
                      href="https://funnelcraft-ai.videoremix.io/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                    >
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                        <Megaphone size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">FunnelCraft AI</div>
                        <div className="text-xs text-gray-500">Marketing Team</div>
                      </div>
                      <ExternalLink size={14} className="text-gray-400" />
                    </a>

                    {/* SmartCRM Closer */}
                    <a 
                      href="https://smartcrm-closer.videoremix.io" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                        <Users size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">SmartCRM Closer</div>
                        <div className="text-xs text-gray-500">Outreach Team</div>
                      </div>
                      <ExternalLink size={14} className="text-gray-400" />
                    </a>

                    {/* ContentAI */}
                    <a 
                      href="https://content-ai.videoremix.io" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                    >
                      <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
                        <FileText size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">ContentAI</div>
                        <div className="text-xs text-gray-500">Content & Support</div>
                      </div>
                      <ExternalLink size={14} className="text-gray-400" />
                    </a>

                    {/* White-Label Platform */}
                    <Link 
                      to="/admin/white-label"
                      className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
                    >
                      <div className="p-2 rounded-lg bg-orange-100 text-orange-600 mr-3">
                        <Palette size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">White-Label Customization</div>
                        <div className="text-xs text-gray-500">Branding & Themes</div>
                      </div>
                      <ChevronRight size={14} className="text-gray-400" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks */}
            <Link 
              to="/tasks" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActiveParent('/tasks') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              } transition-colors duration-200`}
            >
              <CheckSquare size={20} className="mr-2" />
              <span className="ml-2">Tasks</span>
            </Link>
          </div>
          
          {/* User profile/logout */}
          <div className="hidden md:flex items-center ml-4 relative" data-tour="user-profile">
            <button 
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600" 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl}
                  alt={user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User profile'} 
                  className="h-8 w-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getInitials()}
                </div>
              )}
              <span className="font-medium text-sm">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 
                 user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
              </span>
              <ChevronDown size={16} />
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.emailAddresses?.[0]?.emailAddress}
                  </p>
                </div>
                
                <Link 
                  to="/settings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings size={16} className="inline mr-2 text-gray-500" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} className="inline mr-2 text-gray-500" />
                  Sign out
                </button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                isActive('/dashboard') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Home size={20} className="mr-3" />
              Dashboard
            </Link>
            
            <Link
              to="/contacts"
              className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                isActiveParent('/contacts') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Users size={20} className="mr-3" />
              Contacts
            </Link>
            
            <Link
              to="/pipeline"
              className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                isActiveParent('/pipeline') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Briefcase size={20} className="mr-3" />
              Pipeline
            </Link>
            
            <Link
              to="/ai-goals"
              className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                isActive('/ai-goals') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Target size={20} className="mr-3" />
              AI Goals
            </Link>
            
            <div>
              <div 
                className={`flex justify-between items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActiveParent('/ai-tools') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={toggleAiMenu}
              >
                <div className="flex items-center">
                  <Brain size={20} className="mr-3" />
                  <span>AI Tools</span>
                </div>
                {aiMenuOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
              
              {aiMenuOpen && (
                <div className="pl-6 mt-1 space-y-1">
                  <button
                    onClick={() => {
                      openTool('email-analysis');
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center px-3 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-50"
                  >
                    <Mail size={18} className="mr-3" />
                    Email Analysis
                  </button>
                  
                  <button
                    onClick={() => {
                      openTool('meeting-summary');
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center px-3 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-50"
                  >
                    <MessageSquare size={18} className="mr-3" />
                    Meeting Summarizer
                  </button>
                </div>
              )}
            </div>
            
            {/* User profile on mobile */}
            <div className="pt-4 mt-2 border-t border-gray-200">
              <div className="flex items-center px-3 py-2">
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl}
                    alt={user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User profile'} 
                    className="h-10 w-10 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium mr-3">
                    {getInitials()}
                  </div>
                )}
                <div>
                  <div className="font-medium">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 
                     user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
                  </div>
                  <div className="text-sm text-gray-500">{user?.emailAddresses?.[0]?.emailAddress}</div>
                </div>
              </div>
              
              <Link
                to="/settings"
                className="flex items-center px-3 py-2 mt-1 text-base font-medium rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={20} className="mr-3" />
                Settings
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 mt-1 text-base font-medium rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                <LogOut size={20} className="mr-3" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;