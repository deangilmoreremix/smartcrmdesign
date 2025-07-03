import React, { useState } from 'react';
import { useDealStore } from '../store/dealStore';
import { useGemini } from '../services/geminiService';
import CustomizableAIToolbar from './ai/CustomizableAIToolbar';
import { 
  X, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign, 
  User, 
  Building, 
  Tag, 
  Clock, 
  Zap, 
  Brain,
  MessageSquare,
  Mail,
  Phone,
  RefreshCw,
  Save
} from 'lucide-react';

interface DealDetailProps {
  dealId: string;
  onClose: () => void;
}

const DealDetail: React.FC<DealDetailProps> = ({ dealId, onClose }) => {
  const { deals, updateDeal, deleteDeal } = useDealStore();
  const gemini = useGemini();
  const deal = deals[dealId];
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dealAnalysis, setDealAnalysis] = useState<string | null>(null);
  
  const [editForm, setEditForm] = useState({
    title: deal.title,
    value: deal.value,
    company: deal.company,
    contact: deal.contact,
    dueDate: deal.dueDate ? deal.dueDate.toISOString().split('T')[0] : '',
    probability: deal.probability || 0,
    priority: deal.priority || 'medium',
    notes: deal.notes || '',
    nextSteps: deal.nextSteps?.join('\n') || ''
  });
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    
    const nextStepsArray = editForm.nextSteps
      .split('\n')
      .map(step => step.trim())
      .filter(step => step.length > 0);
    
    const updatedDeal = {
      ...deal,
      title: editForm.title,
      value: editForm.value,
      company: editForm.company,
      contact: editForm.contact,
      dueDate: editForm.dueDate ? new Date(editForm.dueDate) : deal.dueDate,
      probability: editForm.probability,
      priority: editForm.priority,
      notes: editForm.notes,
      nextSteps: nextStepsArray
    };
    
    await updateDeal(dealId, updatedDeal);
    setIsEditing(false);
    setIsSaving(false);
  };
  
  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }
    
    await deleteDeal(dealId);
    onClose();
  };
  
  const cancelDelete = () => {
    setIsDeleting(false);
  };
  
  const getStageColor = (stage: string) => {
    switch(stage) {
      case 'qualification': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-indigo-100 text-indigo-800';
      case 'negotiation': return 'bg-purple-100 text-purple-800';
      case 'closed-won': return 'bg-green-100 text-green-800';
      case 'closed-lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority?: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStageName = (stage: string) => {
    switch(stage) {
      case 'qualification': return 'Qualification';
      case 'proposal': return 'Proposal';
      case 'negotiation': return 'Negotiation';
      case 'closed-won': return 'Closed Won';
      case 'closed-lost': return 'Closed Lost';
      default: return stage;
    }
  };
  
  const generateDealAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // In a real implementation, we would use the Gemini API
      // For demo purposes we'll generate a simulated response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = `# Strategic Deal Analysis

## Projected Win Probability: ${deal.probability || 'N/A'}%

### Key Strengths:
- Strong executive sponsor relationship
- Clear alignment with customer's business objectives
- Technical requirements well matched to our solution capabilities

### Risk Factors:
- Competitive pressure from ${Math.random() > 0.5 ? 'established vendors' : 'new market entrants'}
- Budget approval process may delay decision
- Decision committee has expanded recently
      
### Recommended Actions:
1. Schedule technical deep dive with IT stakeholders
2. Develop detailed ROI analysis showing 12-month payback
3. Identify and engage procurement team early
4. Prepare competitive differentiation documentation

### Timeline Analysis:
- Deal has been in ${getStageName(deal.stage)} for ${deal.daysInStage || 0} days
- Average time in this stage: 14 days
- Recommended close date acceleration strategies available
      `;
      
      setDealAnalysis(analysis);
    } catch (error) {
      console.error('Error generating deal analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  if (!deal) return null;
  
  return (
    <div className="fixed inset-0 overflow-hidden z-50" aria-labelledby="deal-detail" role="dialog">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="relative w-screen max-w-2xl">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
              {/* Header */}
              <div className="px-6 py-6 border-b border-gray-200 flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">Deal Details</h2>
                <div className="flex items-center space-x-3">
                  {!isEditing && (
                    <>
                      <button
                        onClick={handleEdit}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={handleDelete}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={onClose}
                    className="bg-white rounded-md p-1.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close panel</span>
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              {/* Body */}
              <div className="flex-1 p-6">
                {isEditing ? (
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Deal Title</label>
                      <input
                        type="text"
                        id="title"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                        <input
                          type="text"
                          id="company"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={editForm.company}
                          onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Person</label>
                        <input
                          type="text"
                          id="contact"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={editForm.contact}
                          onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="value" className="block text-sm font-medium text-gray-700">Value ($)</label>
                        <input
                          type="number"
                          id="value"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={editForm.value}
                          onChange={(e) => setEditForm({ ...editForm, value: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Expected Close Date</label>
                        <input
                          type="date"
                          id="dueDate"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={editForm.dueDate}
                          onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="probability" className="block text-sm font-medium text-gray-700">Win Probability (%)</label>
                        <input
                          type="number"
                          id="probability"
                          min="0"
                          max="100"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={editForm.probability}
                          onChange={(e) => setEditForm({ ...editForm, probability: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                          id="priority"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={editForm.priority}
                          onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        id="notes"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="nextSteps" className="block text-sm font-medium text-gray-700">Next Steps (one per line)</label>
                      <textarea
                        id="nextSteps"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={editForm.nextSteps}
                        onChange={(e) => setEditForm({ ...editForm, nextSteps: e.target.value })}
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw size={16} className="mr-1.5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} className="mr-1.5" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Confirmation dialog for delete */}
                    {isDeleting && (
                      <div className="mb-6 bg-red-50 p-4 rounded-md border border-red-200">
                        <p className="text-sm text-red-700 mb-3">Are you sure you want to delete this deal? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={cancelDelete}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700"
                          >
                            Confirm Delete
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">{deal.title}</h1>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}>
                            {getStageName(deal.stage)}
                          </span>
                          
                          {deal.priority && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(deal.priority)}`}>
                              <Tag size={10} className="mr-1" />
                              {deal.priority}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                        <div>
                          <p className="text-sm text-gray-500">Company</p>
                          <div className="mt-1 flex items-center">
                            <Building className="h-5 w-5 text-gray-400 mr-1.5" />
                            <p className="text-sm font-medium text-gray-900">{deal.company}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Contact</p>
                          <div className="mt-1 flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-1.5" />
                            <p className="text-sm font-medium text-gray-900">{deal.contact}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                        <div>
                          <p className="text-sm text-gray-500">Deal Value</p>
                          <div className="mt-1 flex items-center">
                            <DollarSign className="h-5 w-5 text-gray-400 mr-1.5" />
                            <p className="text-lg font-semibold text-gray-900">
                              ${deal.value.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Expected Close Date</p>
                          <div className="mt-1 flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 mr-1.5" />
                            <p className="text-sm font-medium text-gray-900">
                              {deal.dueDate ? deal.dueDate.toLocaleDateString() : 'Not set'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-500 mb-2">Win Probability</p>
                        <div className="flex items-center">
                          <div className="flex-1 mr-2">
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" 
                                style={{ width: `${deal.probability || 0}%` }}
                              ></div>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 min-w-[40px]">{deal.probability || 0}%</p>
                        </div>
                      </div>
                      
                      {deal.notes && (
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-sm text-gray-500 mb-2">Notes</p>
                          <p className="text-sm text-gray-900 whitespace-pre-line">{deal.notes}</p>
                        </div>
                      )}
                      
                      {deal.nextSteps && deal.nextSteps.length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-sm text-gray-500 mb-2">Next Steps</p>
                          <ul className="space-y-1">
                            {deal.nextSteps.map((step, index) => (
                              <li key={index} className="flex items-start">
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 text-xs font-medium mr-2 mt-0.5">
                                  {index + 1}
                                </span>
                                <p className="text-sm text-gray-900">{step}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm font-medium text-gray-900">AI Deal Analysis</p>
                          <button
                            onClick={generateDealAnalysis}
                            disabled={isAnalyzing}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                          >
                            {isAnalyzing ? (
                              <>
                                <RefreshCw size={12} className="mr-1 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Brain size={12} className="mr-1" />
                                Generate Analysis
                              </>
                            )}
                          </button>
                        </div>
                        
                        {dealAnalysis ? (
                          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-3">
                            <div className="prose prose-sm max-w-none">
                              {dealAnalysis.split('\n').map((line, index) => {
                                if (line.startsWith('# ')) {
                                  return <h3 key={index} className="text-lg font-bold text-gray-900 mt-0">{line.replace('# ', '')}</h3>;
                                } else if (line.startsWith('## ')) {
                                  return <h4 key={index} className="text-base font-semibold text-indigo-800">{line.replace('## ', '')}</h4>;
                                } else if (line.startsWith('### ')) {
                                  return <h5 key={index} className="text-sm font-medium text-gray-900">{line.replace('### ', '')}</h5>;
                                } else if (line.match(/^\d+\./)) {
                                  return (
                                    <div key={index} className="flex items-start">
                                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 text-xs font-medium mr-2 mt-0.5">
                                        {line.split('.')[0]}
                                      </span>
                                      <p className="mt-0">{line.split('.').slice(1).join('.').trim()}</p>
                                    </div>
                                  );
                                } else if (line.startsWith('-')) {
                                  return (
                                    <div key={index} className="flex items-start">
                                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2 mt-1.5"></span>
                                      <p className="mt-0">{line.substring(1).trim()}</p>
                                    </div>
                                  );
                                } else if (line.trim()) {
                                  return <p key={index} className="mt-1">{line}</p>;
                                } else {
                                  return null;
                                }
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <Brain size={24} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">Generate AI analysis for deal insights and recommendations</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Organized Action Buttons Section */}
                      <div className="border-t border-gray-200 pt-4 mt-6 -mx-6 px-6 pb-6 bg-gradient-to-b from-gray-50/40 to-gray-50/60">
                        {/* AI Tools Section */}
                        <div className="mb-4">
                          <CustomizableAIToolbar
                            entityType="deal"
                            entityId={deal.id}
                            entityData={deal}
                            location="dealDetail"
                            layout="vertical"
                            size="md"
                            className="w-full"
                            showCustomizeButton={true}
                          />
                        </div>
                        
                        {/* Traditional Actions Section */}
                        <div className="pt-3 border-t border-gray-100/60">
                          <p className="text-sm font-medium text-gray-900 mb-3">Quick Actions</p>
                          <div className="grid grid-cols-2 gap-2">
                            <button className="flex items-center justify-center py-2 px-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full hover:from-blue-100 hover:to-blue-200 text-sm font-medium transition-all duration-200 border border-blue-200/50 shadow-sm">
                              <Mail size={14} className="mr-1.5" />
                              Send Email
                            </button>
                            <button className="flex items-center justify-center py-2 px-3 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-full hover:from-green-100 hover:to-green-200 text-sm font-medium transition-all duration-200 border border-green-200/50 shadow-sm">
                              <Phone size={14} className="mr-1.5" />
                              Schedule Call
                            </button>
                            <button className="flex items-center justify-center py-2 px-3 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full hover:from-purple-100 hover:to-purple-200 text-sm font-medium transition-all duration-200 border border-purple-200/50 shadow-sm">
                              <MessageSquare size={14} className="mr-1.5" />
                              Add Note
                            </button>
                            <button className="flex items-center justify-center py-2 px-3 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 rounded-full hover:from-orange-100 hover:to-orange-200 text-sm font-medium transition-all duration-200 border border-orange-200/50 shadow-sm">
                              <Calendar size={14} className="mr-1.5" />
                              Add Task
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetail;