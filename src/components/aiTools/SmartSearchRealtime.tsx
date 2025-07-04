import React, { useState, useEffect, useCallback } from 'react';
import { Search, User, Building, DollarSign, Loader2 } from 'lucide-react';
import { useContactStore } from '../../store/contactStore';
import { useDealStore } from '../../store/dealStore';
import { useGemini } from '../../services/geminiService';
import { useTheme } from '../../contexts/ThemeContext';

interface SearchResult {
  type: 'contact' | 'deal' | 'company';
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  value: string;
  matchReason?: string;
}

const SmartSearchRealtime: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [enhancedResults, setEnhancedResults] = useState(false);
  
  const { contacts } = useContactStore();
  const { deals } = useDealStore();
  const gemini = useGemini();
  const { isDark } = useTheme();
  
  // Debounced search function
  const debouncedSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }
      
      setIsSearching(true);
      
      try {
        // First perform basic filtering
        const filteredContacts = Object.values(contacts).filter(contact => 
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        
        const filteredDeals = Object.values(deals).filter(deal => 
          deal.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        // Create unique companies from contacts
        const uniqueCompanies = Array.from(new Set(
          Object.values(contacts)
            .filter(c => c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(c => c.company)
        ));
        
        // Map to search results
        const basicResults: SearchResult[] = [
          ...filteredContacts.map(contact => ({
            type: 'contact' as const,
            id: contact.id,
            title: contact.name,
            subtitle: contact.position ? `${contact.position}${contact.company ? ` at ${contact.company}` : ''}` : '',
            icon: User,
            value: contact.status === 'hot' ? 'High Value' : 'Contact'
          })),
          ...filteredDeals.map(deal => ({
            type: 'deal' as const,
            id: deal.id,
            title: deal.title,
            subtitle: `Stage: ${deal.stage}`,
            icon: DollarSign,
            value: `$${deal.value.toLocaleString()}`
          })),
          ...uniqueCompanies.map((company, index) => {
            const companyContacts = Object.values(contacts).filter(c => c.company === company);
            const companyDeals = Object.values(deals).filter(d => {
              const contact = contacts[d.contactId];
              return contact && contact.company === company;
            });
            
            return {
              type: 'company' as const,
              id: `company-${index}`,
              title: company || '',
              subtitle: `${companyContacts.length} contacts, ${companyDeals.length} deals`,
              icon: Building,
              value: companyDeals.length > 0 
                ? `$${companyDeals.reduce((sum, d) => sum + d.value, 0).toLocaleString()} potential`
                : 'No active deals'
            };
          })
        ];
        
        // Use limited basic results first for quick response
        setResults(basicResults.slice(0, 5));
        
        // Now enhance results with AI if we have enough data
        if (searchQuery.length >= 3 && (filteredContacts.length >= 2 || filteredDeals.length >= 2)) {
          try {
            // Prepare data for AI analysis
            const searchContext = {
              query: searchQuery,
              contacts: filteredContacts.map(c => ({
                id: c.id,
                name: c.name,
                company: c.company,
                email: c.email,
                status: c.status,
                tags: c.tags
              })),
              deals: filteredDeals.map(d => ({
                id: d.id,
                title: d.title,
                value: d.value,
                stage: d.stage,
                probability: d.probability,
                contactId: d.contactId
              })),
              companies: uniqueCompanies
            };
            
            // Generate enhanced search results with AI
            const prompt = `
              I need enhanced search results for the following CRM search query.
              
              Search query: "${searchQuery}"
              
              Search context: ${JSON.stringify(searchContext, null, 2)}
              
              Analyze the search and return the top 5 most relevant results, considering factors like:
              1. Direct keyword matches
              2. Semantic relevance
              3. Business value (prioritize high-value deals and hot leads)
              4. Relationship importance
              
              Format your response as a JSON array of objects with the following properties:
              [
                {
                  "type": "contact" | "deal" | "company",
                  "id": "string",
                  "title": "string",
                  "subtitle": "string",
                  "value": "string",
                  "matchReason": "string"
                }
              ]
              
              Only include results that are actually relevant. Limit to maximum 5 results.
            `;
            
            const response = await gemini.generateContent({
              prompt,
              model: 'gemma-2-2b-it', // Use lightweight model for speed
              temperature: 0.3,
              maxTokens: 1000,
              featureUsed: 'smart-search'
            });
            
            // Parse the AI-enhanced results
            try {
              const enhancedResults = JSON.parse(response.content);
              if (Array.isArray(enhancedResults) && enhancedResults.length > 0) {
                // Map results back to our format with appropriate icons
                const mappedResults: SearchResult[] = enhancedResults.map(result => ({
                  ...result,
                  icon: result.type === 'contact' ? User :
                         result.type === 'deal' ? DollarSign : Building
                }));
                
                setResults(mappedResults);
                setEnhancedResults(true);
              }
            } catch (jsonError) {
              console.error("Failed to parse AI search results:", jsonError);
            }
          } catch (aiError) {
            console.error("AI search enhancement failed:", aiError);
            // Keep basic results if AI fails
          }
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [contacts, deals, gemini]
  );

  // Effect for debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        debouncedSearch(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, debouncedSearch]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      setEnhancedResults(false);
    }
  };

  return (
    <div className="p-4 h-full">
      <div className="relative mb-4">
        <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
          isDark ? 'text-gray-400' : 'text-gray-400'
        }`} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search contacts, deals, companies..."
          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
            isDark 
              ? 'bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
          }`}
        />
        {isSearching && (
          <Loader2 size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" />
        )}
      </div>

      <div className="space-y-2">
        {results.length > 0 ? (
          <div>
            {enhancedResults && (
              <div className={`px-3 py-1 rounded mb-2 text-xs ${
                isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-50 text-blue-700'
              }`}>
                AI-enhanced search results
              </div>
            )}
          
            {results.map((result) => (
              <div
                key={result.id}
                className={`p-3 border rounded-lg transition-colors cursor-pointer ${
                  isDark 
                    ? 'border-gray-700 bg-gray-800/60 hover:bg-gray-700/80' 
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    result.type === 'contact' 
                      ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600')
                      : result.type === 'deal'
                      ? (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600')
                      : (isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600')
                  }`}>
                    <result.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {result.title}
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {result.subtitle}
                    </p>
                    {result.matchReason && (
                      <p className={`text-xs mt-1 ${
                        isDark ? 'text-blue-400 bg-blue-500/10' : 'text-blue-600 bg-blue-50'
                      } px-2 py-0.5 rounded-sm inline-block`}>
                        {result.matchReason}
                      </p>
                    )}
                  </div>
                  <div className={`text-xs whitespace-nowrap ${
                    result.type === 'deal' 
                      ? (isDark ? 'text-green-400' : 'text-green-600')
                      : (isDark ? 'text-gray-400' : 'text-gray-600')
                  }`}>
                    {result.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-8">
            <Search size={32} className={`mx-auto text-gray-300 mb-3`} />
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              No results found for "{query}"
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <Search size={32} className={`mx-auto text-gray-300 mb-3`} />
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Start typing to search...
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
              Powered by AI semantic search
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSearchRealtime;