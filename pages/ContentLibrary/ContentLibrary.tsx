import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { fetchContentItems, createContentItem, deleteContentItem } from '../../services/supabaseClient';
import { FileText, Video, Headphones, Trash2, Plus, Search, Filter, RefreshCw, X, Music } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'podcast' | 'audiobook' | 'video' | 'voice_over';
  url: string;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

const ContentLibrary: React.FC = () => {
  const { user } = useAuthStore();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // New content item form
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState<'podcast' | 'audiobook' | 'video' | 'voice_over'>('podcast');
  const [newItemUrl, setNewItemUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    loadContentItems();
  }, [user]);
  
  const loadContentItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await fetchContentItems(user?.id);
      if (error) throw error;
      setContentItems(data || []);
    } catch (err) {
      console.error("Error loading content items:", err);
      setError('Failed to load content library');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newItem = {
        title: newItemTitle,
        type: newItemType,
        url: newItemUrl,
        user_id: user?.id,
        metadata: {}
      };
      
      const { error } = await createContentItem(newItem);
      if (error) throw error;
      
      // Reset form and reload
      setNewItemTitle('');
      setNewItemType('podcast');
      setNewItemUrl('');
      setShowAddForm(false);
      loadContentItems();
      
    } catch (err) {
      console.error("Error adding content item:", err);
      setError('Failed to add content item');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteContent = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setIsDeleting(id);
      try {
        const { error } = await deleteContentItem(id);
        if (error) throw error;
        
        // Remove item from state
        setContentItems(contentItems.filter(item => item.id !== id));
        
      } catch (err) {
        console.error("Error deleting content item:", err);
        setError('Failed to delete content item');
      } finally {
        setIsDeleting(null);
      }
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'podcast':
        return <Headphones size={16} className="text-purple-500" />;
      case 'audiobook':
        return <Music size={16} className="text-amber-500" />;
      case 'video':
        return <Video size={16} className="text-red-500" />;
      case 'voice_over':
        return <FileText size={16} className="text-blue-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };
  
  const filteredItems = contentItems
    .filter(item => filterType === 'all' || item.type === filterType)
    .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Library</h1>
          <p className="text-gray-600 mt-1">Manage your audio and video content</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            {showAddForm ? (
              <>
                <X size={18} className="mr-1" />
                Cancel
              </>
            ) : (
              <>
                <Plus size={18} className="mr-1" />
                Add Content
              </>
            )}
          </button>
        </div>
      </header>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-100">
          {error}
        </div>
      )}
      
      {showAddForm && (
        <div className="card-modern p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Content</h2>
          
          <form onSubmit={handleAddContent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content Title
              </label>
              <input
                type="text"
                required
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter content title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content Type
              </label>
              <select
                required
                value={newItemType}
                onChange={(e) => setNewItemType(e.target.value as any)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="podcast">Podcast</option>
                <option value="audiobook">Audiobook</option>
                <option value="video">Video</option>
                <option value="voice_over">Voice Over</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content URL
              </label>
              <input
                type="url"
                required
                value={newItemUrl}
                onChange={(e) => setNewItemUrl(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/content.mp3"
              />
            </div>
            
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 ${
                  isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white py-2 px-4 rounded-md transition-colors`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Content'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="card-modern mb-6">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search content..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Types</option>
              <option value="podcast">Podcasts</option>
              <option value="audiobook">Audiobooks</option>
              <option value="video">Videos</option>
              <option value="voice_over">Voice Overs</option>
            </select>
            
            <button 
              onClick={loadContentItems}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw size={16} className="mr-1" />
              Refresh
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <RefreshCw size={32} className="animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-500">Loading content library...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg mb-1">No content found</p>
            <p className="text-gray-400 text-sm">
              {contentItems.length === 0 
                ? "Add your first content item to get started"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(item.type)}
                        <span className="ml-2 text-sm capitalize">
                          {item.type.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 hover:underline truncate inline-block max-w-xs"
                      >
                        {item.url}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.created_at 
                        ? new Date(item.created_at).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteContent(item.id)}
                        disabled={isDeleting === item.id}
                        className={`text-red-600 hover:text-red-900 ${isDeleting === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isDeleting === item.id ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentLibrary;