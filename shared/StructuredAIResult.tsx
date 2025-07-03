import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target, 
  BarChart3, 
  Users, 
  DollarSign,
  Clock,
  Star,
  ArrowRight,
  Lightbulb,
  Activity
} from 'lucide-react';

interface StructuredAIResultProps {
  result: string;
  title?: string;
}

const StructuredAIResult: React.FC<StructuredAIResultProps> = ({ result, title = "AI Analysis Results" }) => {
  // Parse the markdown-like result into structured sections
  const parseResult = (text: string) => {
    const sections: any[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentSection: any = null;
    let currentSubsection: any = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Main headers (###)
      if (trimmed.startsWith('### ')) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          type: 'section',
          title: trimmed.replace(/^###\s*[\*]*/, '').replace(/[\*]*$/, '').trim(),
          content: [],
          subsections: []
        };
        currentSubsection = null;
      }
      // Sub headers (####, **text**, or numbered items)
      else if (trimmed.startsWith('#### ') || trimmed.startsWith('**') || /^\d+\./.test(trimmed)) {
        const title = trimmed
          .replace(/^####\s*/, '')
          .replace(/^\d+\.\s*/, '')
          .replace(/^\*\*/, '')
          .replace(/\*\*$/, '')
          .trim();
        
        currentSubsection = {
          type: 'subsection',
          title,
          items: []
        };
        
        if (currentSection) {
          currentSection.subsections.push(currentSubsection);
        }
      }
      // Bullet points
      else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const item = trimmed.replace(/^[-•]\s*/, '').trim();
        if (currentSubsection) {
          currentSubsection.items.push(item);
        } else if (currentSection) {
          currentSection.content.push(item);
        }
      }
      // Regular content
      else if (trimmed && !trimmed.startsWith('#')) {
        if (currentSection) {
          currentSection.content.push(trimmed);
        }
      }
    }
    
    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const getSectionIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('insight') || titleLower.includes('analysis')) return <BarChart3 className="h-5 w-5" />;
    if (titleLower.includes('opportunity') || titleLower.includes('growth')) return <TrendingUp className="h-5 w-5" />;
    if (titleLower.includes('risk') || titleLower.includes('warning') || titleLower.includes('concern')) return <AlertTriangle className="h-5 w-5" />;
    if (titleLower.includes('recommendation') || titleLower.includes('action')) return <Lightbulb className="h-5 w-5" />;
    if (titleLower.includes('performance') || titleLower.includes('metric')) return <Activity className="h-5 w-5" />;
    if (titleLower.includes('target') || titleLower.includes('goal')) return <Target className="h-5 w-5" />;
    if (titleLower.includes('customer') || titleLower.includes('contact')) return <Users className="h-5 w-5" />;
    if (titleLower.includes('revenue') || titleLower.includes('sales') || titleLower.includes('pipeline')) return <DollarSign className="h-5 w-5" />;
    if (titleLower.includes('priority') || titleLower.includes('urgent')) return <Star className="h-5 w-5" />;
    return <CheckCircle className="h-5 w-5" />;
  };

  const getSectionColor = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('risk') || titleLower.includes('warning') || titleLower.includes('concern')) return 'border-red-200 bg-red-50';
    if (titleLower.includes('opportunity') || titleLower.includes('growth')) return 'border-green-200 bg-green-50';
    if (titleLower.includes('recommendation') || titleLower.includes('action')) return 'border-blue-200 bg-blue-50';
    if (titleLower.includes('priority') || titleLower.includes('urgent')) return 'border-yellow-200 bg-yellow-50';
    return 'border-gray-200 bg-gray-50';
  };

  const getItemIcon = (item: string) => {
    const itemLower = item.toLowerCase();
    if (itemLower.includes('increase') || itemLower.includes('improve') || itemLower.includes('boost')) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (itemLower.includes('decrease') || itemLower.includes('reduce') || itemLower.includes('risk')) return <AlertTriangle className="h-4 w-4 text-red-600" />;
    if (itemLower.includes('action') || itemLower.includes('implement') || itemLower.includes('create')) return <ArrowRight className="h-4 w-4 text-blue-600" />;
    if (itemLower.includes('revenue') || itemLower.includes('$') || itemLower.includes('sales')) return <DollarSign className="h-4 w-4 text-green-600" />;
    if (itemLower.includes('time') || itemLower.includes('schedule') || itemLower.includes('urgent')) return <Clock className="h-4 w-4 text-orange-600" />;
    return <CheckCircle className="h-4 w-4 text-gray-600" />;
  };

  const sections = parseResult(result);

  if (!sections.length) {
    // Fallback for unstructured content
    return (
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-sm p-6 border border-blue-100 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="prose prose-sm max-w-none whitespace-pre-wrap">
          <p className="mt-2 text-gray-700">{result}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-sm p-6 border border-blue-100 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <p className="mt-2 text-gray-700">Comprehensive AI analysis completed with actionable insights</p>
      </div>

      {sections.map((section, index) => (
        <div key={index} className={`bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-sm p-6 border border-blue-100 transition-all duration-200 hover:shadow-md`}>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-white rounded-lg border border-blue-200">
              {getSectionIcon(section.title)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
              
              {/* Section content */}
              {section.content.map((content: string, contentIndex: number) => (
                <p key={contentIndex} className="mt-2 text-gray-700">{content}</p>
              ))}
            </div>
          </div>

          {/* Subsections */}
          {section.subsections.map((subsection: any, subIndex: number) => (
            <div key={subIndex} className="ml-6 mb-4 last:mb-0">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                {subsection.title}
              </h4>
              
              {subsection.items.length > 0 && (
                <div className="space-y-2">
                  {subsection.items.map((item: string, itemIndex: number) => (
                    <div key={itemIndex} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
                      {getItemIcon(item)}
                      <span className="mt-2 text-gray-700 text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Analysis Complete</span>
          <span className="text-sm text-green-600">• Ready for implementation</span>
        </div>
      </div>
    </div>
  );
};

export default StructuredAIResult;