import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Video, 
  Clock, 
  Calendar, 
  User, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing,
  MoreHorizontal,
  Trash2,
  Download
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Avatar from './ui/Avatar';
import { getInitials } from '../utils/avatars';

interface CallRecord {
  id: string;
  participantName: string;
  participantEmail: string;
  participantAvatar?: string;
  type: 'video' | 'audio';
  direction: 'incoming' | 'outgoing';
  status: 'completed' | 'missed' | 'declined';
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  quality: 'excellent' | 'good' | 'poor';
  recordingAvailable: boolean;
}

const CallHistory: React.FC = () => {
  const { isDark } = useTheme();
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'video' | 'audio' | 'missed'>('all');
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  // Load call history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('call-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setCallHistory(parsed.map((call: any) => ({
          ...call,
          startTime: new Date(call.startTime),
          endTime: call.endTime ? new Date(call.endTime) : undefined
        })));
      } catch (error) {
        console.error('Error loading call history:', error);
      }
    } else {
      // Initialize with demo data
      const demoHistory: CallRecord[] = [
        {
          id: '1',
          participantName: 'Jane Doe',
          participantEmail: 'jane.doe@microsoft.com',
          participantAvatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          type: 'video',
          direction: 'outgoing',
          status: 'completed',
          startTime: new Date(Date.now() - 3600000), // 1 hour ago
          endTime: new Date(Date.now() - 3240000), // 54 minutes ago
          duration: 360, // 6 minutes
          quality: 'excellent',
          recordingAvailable: true
        },
        {
          id: '2',
          participantName: 'Darlene Robertson',
          participantEmail: 'darlene.r@ford.com',
          participantAvatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          type: 'audio',
          direction: 'incoming',
          status: 'completed',
          startTime: new Date(Date.now() - 86400000), // Yesterday
          endTime: new Date(Date.now() - 86100000),
          duration: 300, // 5 minutes
          quality: 'good',
          recordingAvailable: false
        },
        {
          id: '3',
          participantName: 'Wade Warren',
          participantEmail: 'wade.warren@zenith.com',
          type: 'video',
          direction: 'incoming',
          status: 'missed',
          startTime: new Date(Date.now() - 172800000), // 2 days ago
          duration: 0,
          quality: 'poor',
          recordingAvailable: false
        }
      ];
      setCallHistory(demoHistory);
    }
  }, []);

  // Save call history to localStorage
  const saveCallHistory = (history: CallRecord[]) => {
    localStorage.setItem('call-history', JSON.stringify(history));
  };

  // Add new call to history (this would be called from the video call context)
  const addCallToHistory = (callData: Omit<CallRecord, 'id'>) => {
    const newCall: CallRecord = {
      ...callData,
      id: Date.now().toString()
    };
    
    const updatedHistory = [newCall, ...callHistory];
    setCallHistory(updatedHistory);
    saveCallHistory(updatedHistory);
  };

  // Delete call from history
  const deleteCall = (callId: string) => {
    const updatedHistory = callHistory.filter(call => call.id !== callId);
    setCallHistory(updatedHistory);
    saveCallHistory(updatedHistory);
  };

  // Filter calls based on selected filter
  const filteredCalls = callHistory.filter(call => {
    switch (filter) {
      case 'video': return call.type === 'video';
      case 'audio': return call.type === 'audio';
      case 'missed': return call.status === 'missed';
      default: return true;
    }
  });

  // Format duration
  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '—';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const getStatusIcon = (call: CallRecord) => {
    if (call.status === 'missed') {
      return <PhoneCall size={14} className="text-red-400" />;
    }
    
    return call.direction === 'incoming' ? (
      <PhoneIncoming size={14} className="text-green-400" />
    ) : (
      <PhoneOutgoing size={14} className="text-blue-400" />
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return isDark ? 'text-green-400' : 'text-green-600';
      case 'missed': return isDark ? 'text-red-400' : 'text-red-600';
      case 'declined': return isDark ? 'text-orange-400' : 'text-orange-600';
      default: return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return isDark ? 'text-green-400' : 'text-green-600';
      case 'good': return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'poor': return isDark ? 'text-red-400' : 'text-red-600';
      default: return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Call History
        </h2>
        <div className="flex space-x-2">
          {(['all', 'video', 'audio', 'missed'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors capitalize ${
                filter === filterType 
                  ? (isDark ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white')
                  : (isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Call History List */}
      <div className={`rounded-xl border ${isDark ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200'} overflow-hidden`}>
        {filteredCalls.length === 0 ? (
          <div className="p-8 text-center">
            <PhoneCall size={32} className={`mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {filter === 'all' ? 'No calls yet' : `No ${filter} calls found`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-white/10">
            {filteredCalls.map((call) => (
              <div
                key={call.id}
                className={`p-4 hover:${isDark ? 'bg-white/5' : 'bg-gray-50'} transition-colors cursor-pointer`}
                onClick={() => setSelectedCall(call)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar
                      src={call.participantAvatar}
                      alt={call.participantName}
                      size="md"
                      fallback={getInitials(call.participantName)}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {call.participantName}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {call.type === 'video' ? (
                            <Video size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                          ) : (
                            <Phone size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                          )}
                          {getStatusIcon(call)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1">
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formatDate(call.startTime)}
                        </p>
                        <span className={`text-sm ${getStatusColor(call.status)} capitalize`}>
                          {call.status}
                        </span>
                        {call.duration > 0 && (
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {formatDuration(call.duration)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Quality Indicator */}
                    <div className={`text-xs px-2 py-1 rounded ${
                      call.quality === 'excellent' ? (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800') :
                      call.quality === 'good' ? (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800') :
                      (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-800')
                    }`}>
                      {call.quality}
                    </div>

                    {/* Recording indicator */}
                    {call.recordingAvailable && (
                      <div className="p-1 rounded bg-blue-500/20">
                        <Download size={12} className="text-blue-400" />
                      </div>
                    )}

                    {/* More options */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCall(call.id);
                      }}
                      className={`p-1 rounded transition-colors ${
                        isDark ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-100 text-gray-500 hover:text-red-600'
                      }`}
                      title="Delete call"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call Details Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className={`${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/20' : 'border-gray-200'} rounded-2xl overflow-hidden shadow-2xl max-w-md w-full mx-4`}>
            
            {/* Header */}
            <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-4">
                <Avatar
                  src={selectedCall.participantAvatar}
                  alt={selectedCall.participantName}
                  size="lg"
                  fallback={getInitials(selectedCall.participantName)}
                />
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedCall.participantName}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedCall.participantEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Call Type</p>
                  <div className="flex items-center space-x-2">
                    {selectedCall.type === 'video' ? (
                      <Video size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                    ) : (
                      <Phone size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                    )}
                    <span className={`text-sm font-medium capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {selectedCall.type}
                    </span>
                  </div>
                </div>

                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Duration</p>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatDuration(selectedCall.duration)}
                  </p>
                </div>

                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Status</p>
                  <span className={`text-sm font-medium capitalize ${getStatusColor(selectedCall.status)}`}>
                    {selectedCall.status}
                  </span>
                </div>

                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Quality</p>
                  <span className={`text-sm font-medium capitalize ${getQualityColor(selectedCall.quality)}`}>
                    {selectedCall.quality}
                  </span>
                </div>
              </div>

              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Date & Time</p>
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatDate(selectedCall.startTime)}
                </p>
              </div>

              {selectedCall.recordingAvailable && (
                <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'} border`}>
                  <div className="flex items-center space-x-2">
                    <Download size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                    <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                      Recording Available
                    </span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'} mt-1`}>
                    Download call recording from the recordings section
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`p-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} flex justify-end`}>
              <button
                onClick={() => setSelectedCall(null)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallHistory;