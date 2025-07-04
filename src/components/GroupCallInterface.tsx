import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  MessageSquare, 
  Users, 
  Monitor, 
  MonitorOff,
  UserPlus,
  MoreVertical,
  Settings,
  Volume2,
  Shield,
  Share2,
  X
} from 'lucide-react';
import { useVideoCall } from '../contexts/VideoCallContext';
import { useTheme } from '../contexts/ThemeContext';
import { useContactStore } from '../store/contactStore';
import Avatar from './ui/Avatar';
import { getInitials } from '../utils/avatars';

interface GroupCallInterfaceProps {
  onClose: () => void;
}

const GroupCallInterface: React.FC<GroupCallInterfaceProps> = ({ onClose }) => {
  const { 
    participants, 
    localStream, 
    isVideoEnabled, 
    isAudioEnabled,
    isScreenSharing,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    endCall,
    isRecording,
    startRecording,
    stopRecording,
    sendMessage
  } = useVideoCall();
  
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  
  const [focusedParticipantId, setFocusedParticipantId] = useState<string | null>(null);
  const [layout, setLayout] = useState<'grid' | 'spotlight'>('grid');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [showParticipantsList, setShowParticipantsList] = useState(false);
  const [activeTab, setActiveTab] = useState<'participants' | 'chat'>('participants');
  
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  
  // Combined participants (local + remote)
  const allParticipants = [
    {
      id: 'local',
      name: 'You (Local)',
      stream: localStream,
      isVideoEnabled,
      isAudioEnabled,
      isSpeaking: false,
      isConnected: true
    },
    ...participants
  ];
  
  // Set up video refs for each participant
  useEffect(() => {
    allParticipants.forEach(participant => {
      const videoElement = videoRefs.current[participant.id];
      if (videoElement && participant.stream) {
        videoElement.srcObject = participant.stream;
      }
    });
  }, [allParticipants]);
  
  // Determine the best layout grid based on number of participants
  const getGridLayout = () => {
    const count = allParticipants.length;
    
    if (count <= 1) return { cols: 1, rows: 1 };
    if (count === 2) return { cols: 2, rows: 1 };
    if (count <= 4) return { cols: 2, rows: 2 };
    if (count <= 6) return { cols: 3, rows: 2 };
    if (count <= 9) return { cols: 3, rows: 3 };
    return { cols: 4, rows: Math.ceil(count / 4) };
  };
  
  const { cols, rows } = getGridLayout();
  
  // Get focused participant
  const focusedParticipant = focusedParticipantId 
    ? allParticipants.find(p => p.id === focusedParticipantId) 
    : allParticipants[0];
  
  // Send chat message
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    try {
      sendMessage(chatMessage);
      setChatMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };
  
  // Toggle recording
  const handleToggleRecording = async () => {
    try {
      if (isRecording) {
        stopRecording();
      } else {
        await startRecording();
      }
    } catch (error) {
      console.error('Recording error:', error);
      alert('Failed to start recording. Please check permissions and try again.');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Main Video Grid */}
      <div className="flex-1 overflow-hidden relative">
        {layout === 'spotlight' && focusedParticipant ? (
          <div className="h-full flex flex-col">
            {/* Main spotlight view */}
            <div className="flex-1 relative">
              {focusedParticipant.stream && focusedParticipant.isVideoEnabled ? (
                <video
                  ref={el => videoRefs.current[focusedParticipant.id] = el}
                  autoPlay
                  playsInline
                  muted={focusedParticipant.id === 'local'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <Avatar
                      size="2xl"
                      fallback={getInitials(focusedParticipant.name)}
                      className="mx-auto mb-3"
                    />
                    <p className="text-white text-lg font-medium">{focusedParticipant.name}</p>
                    {!focusedParticipant.isVideoEnabled && (
                      <p className="text-gray-400 text-sm">Camera turned off</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Spotlight overlay with name and controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="bg-black/60 rounded-lg px-4 py-2">
                  <p className="text-white font-medium">{focusedParticipant.name}</p>
                </div>
              </div>
            </div>
            
            {/* Thumbnails row */}
            <div className="h-24 flex space-x-2 p-2 overflow-x-auto bg-black/60">
              {allParticipants.map(participant => (
                <div 
                  key={participant.id}
                  className={`relative h-full aspect-video flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                    participant.id === focusedParticipantId 
                      ? 'border-blue-500' 
                      : 'border-transparent'
                  } hover:border-gray-300 cursor-pointer`}
                  onClick={() => setFocusedParticipantId(participant.id)}
                >
                  {participant.stream && participant.isVideoEnabled ? (
                    <video
                      ref={el => videoRefs.current[`thumb-${participant.id}`] = el}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Avatar
                        size="md"
                        fallback={getInitials(participant.name)}
                      />
                    </div>
                  )}
                  
                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                    <p className="text-white text-xs truncate">{participant.name}</p>
                  </div>
                  
                  {/* Mute indicator */}
                  {!participant.isAudioEnabled && (
                    <div className="absolute top-1 right-1">
                      <MicOff size={12} className="text-red-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Grid view */
          <div 
            className="h-full grid gap-2 p-2"
            style={{ 
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
            }}
          >
            {allParticipants.map(participant => (
              <div 
                key={participant.id}
                className={`relative rounded-lg overflow-hidden border ${
                  participant.isSpeaking ? 'border-green-500' : 'border-gray-800'
                } ${participant.id === focusedParticipantId ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => {
                  setFocusedParticipantId(participant.id);
                  setLayout('spotlight');
                }}
              >
                {participant.stream && participant.isVideoEnabled ? (
                  <video
                    ref={el => videoRefs.current[participant.id] = el}
                    autoPlay
                    playsInline
                    muted={participant.id === 'local'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <Avatar
                        size="lg"
                        fallback={getInitials(participant.name)}
                        className="mx-auto mb-2"
                      />
                      <p className="text-white text-sm">{participant.name}</p>
                    </div>
                  </div>
                )}
                
                {/* Participant info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 flex justify-between items-center">
                  <span className="text-white text-xs">{participant.name}</span>
                  <div className="flex space-x-1">
                    {!participant.isAudioEnabled && (
                      <MicOff size={12} className="text-red-500" />
                    )}
                    {participant.isSpeaking && (
                      <Mic size={12} className="text-green-500 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Call duration and info */}
        <div className="absolute top-4 left-4 bg-black/50 rounded-full px-3 py-1 flex items-center space-x-2">
          <span className="text-white text-sm">Group Call • {allParticipants.length} participants</span>
        </div>
        
        {/* Layout toggle */}
        <div className="absolute top-4 right-4 bg-black/50 rounded-full flex overflow-hidden">
          <button
            onClick={() => setLayout('grid')}
            className={`px-3 py-1 text-xs ${
              layout === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-300'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setLayout('spotlight')}
            className={`px-3 py-1 text-xs ${
              layout === 'spotlight' ? 'bg-blue-500 text-white' : 'text-gray-300'
            }`}
          >
            Spotlight
          </button>
        </div>
      </div>
      
      {/* Control Bar */}
      <div className="h-20 bg-gray-900 border-t border-white/10 flex items-center justify-center px-4">
        <div className="flex items-center justify-between w-full max-w-3xl">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isAudioEnabled 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            
            <button
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isVideoEnabled 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            
            <button
              onClick={() => toggleScreenShare()}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isScreenSharing 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowParticipantsList(!showParticipantsList)}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                showParticipantsList 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <Users size={20} />
            </button>
            
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                activeTab === 'chat'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <MessageSquare size={20} />
            </button>
            
            <button
              onClick={handleToggleRecording}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <span className={`w-4 h-4 rounded-full ${isRecording ? 'bg-white' : 'bg-red-500'}`}></span>
            </button>
            
            <button
              onClick={endCall}
              className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white"
            >
              <Phone className="rotate-135" size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Side Panel (Participants or Chat) */}
      {showParticipantsList && (
        <div className="absolute right-0 top-0 bottom-20 w-80 bg-gray-900 border-l border-white/10 flex flex-col">
          {/* Header with tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-4 text-center ${
                activeTab === 'participants' 
                  ? 'border-b-2 border-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Participants ({allParticipants.length})
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-4 text-center ${
                activeTab === 'chat' 
                  ? 'border-b-2 border-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setShowParticipantsList(false)}
              className="p-4 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          
          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'participants' ? (
              <div className="divide-y divide-white/10">
                {allParticipants.map(participant => (
                  <div key={participant.id} className="p-4 hover:bg-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          size="md"
                          fallback={getInitials(participant.name)}
                        />
                        <div>
                          <p className="text-white font-medium">{participant.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`flex items-center text-xs ${
                              participant.isConnected ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                participant.isConnected ? 'bg-green-400' : 'bg-yellow-400'
                              }`}></span>
                              {participant.isConnected ? 'Connected' : 'Connecting...'}
                            </span>
                            {participant.isSpeaking && (
                              <span className="text-xs text-green-400 flex items-center">
                                <Mic size={10} className="mr-1" />
                                Speaking
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        {!participant.isAudioEnabled && (
                          <div className="p-1 rounded-full bg-red-500/20">
                            <MicOff size={14} className="text-red-400" />
                          </div>
                        )}
                        {!participant.isVideoEnabled && (
                          <div className="p-1 rounded-full bg-red-500/20">
                            <VideoOff size={14} className="text-red-400" />
                          </div>
                        )}
                        <button className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1 p-4 space-y-4">
                  <div className="text-center text-gray-500 text-sm py-8">
                    Group chat messages will appear here
                  </div>
                </div>
                <div className="p-4 border-t border-white/10">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type message here..."
                      className="flex-1 bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupCallInterface;