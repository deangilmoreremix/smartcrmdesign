import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  Phone,
  UserPlus,
  Users,
  MoreVertical,
  Volume2,
  VolumeX,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useVideoCall } from '../contexts/VideoCallContext';
import { useTheme } from '../contexts/ThemeContext';
import Avatar from './ui/Avatar';
import { getInitials } from '../utils/avatars';
import ConnectionQuality from './ConnectionQuality';

interface ParticipantTileProps {
  participant: {
    id: string;
    name: string;
    avatar?: string;
    stream?: MediaStream;
    isConnected: boolean;
    isVideoEnabled: boolean;
    isAudioEnabled: boolean;
    isSpeaking: boolean;
  };
  isFocused: boolean;
  onFocus: () => void;
  isDark: boolean;
}

const ParticipantTile: React.FC<ParticipantTileProps> = ({ 
  participant, 
  isFocused, 
  onFocus,
  isDark 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current && participant.stream && participant.isVideoEnabled) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream, participant.isVideoEnabled]);
  
  return (
    <div 
      className={`relative rounded-lg overflow-hidden ${
        isFocused ? 'border-2 border-blue-500' : 'border border-white/10'
      } ${participant.isSpeaking ? 'ring-2 ring-green-500' : ''}`}
      onClick={onFocus}
    >
      {participant.stream && participant.isVideoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={participant.id === 'local'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={`w-full h-full bg-gray-800 flex items-center justify-center ${
          participant.isSpeaking ? 'bg-green-900/20' : ''
        }`}>
          <Avatar
            src={participant.avatar}
            alt={participant.name}
            size="lg"
            fallback={getInitials(participant.name)}
          />
        </div>
      )}
      
      {/* Participant Info & Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-white truncate">{participant.name}</span>
          {!participant.isAudioEnabled && (
            <MicOff size={12} className="text-red-400" />
          )}
        </div>
        
        {participant.id === 'local' && (
          <div className="flex space-x-1">
            <button className="p-1 rounded bg-white/10 hover:bg-white/20 text-white">
              <Video size={12} />
            </button>
            <button className="p-1 rounded bg-white/10 hover:bg-white/20 text-white">
              <Mic size={12} />
            </button>
          </div>
        )}
      </div>
      
      {/* Connection Status */}
      {!participant.isConnected && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse text-yellow-400 mb-2">
              <div className="w-8 h-8 mx-auto border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-xs text-white">Connecting...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const GroupCallView: React.FC = () => {
  const { 
    participants, 
    localStream,
    isVideoEnabled, 
    isAudioEnabled,
    isScreenSharing,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    addParticipantToCall,
    endCall,
    isRecording,
    startRecording,
    stopRecording
  } = useVideoCall();
  const { isDark } = useTheme();
  
  const [focusedParticipant, setFocusedParticipant] = useState<string | null>(null);
  const [layout, setLayout] = useState<'grid' | 'focus'>('grid');
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Add local participant to list
  const allParticipants = [
    {
      id: 'local',
      name: 'You',
      avatar: '',
      stream: localStream,
      isConnected: true,
      isVideoEnabled,
      isAudioEnabled,
      isSpeaking: false
    },
    ...participants
  ];
  
  // Get the participant to focus on
  const getFocusedParticipant = () => {
    if (focusedParticipant) {
      return allParticipants.find(p => p.id === focusedParticipant) || allParticipants[0];
    }
    
    // If no focused participant, try to find a speaking one
    const speakingParticipant = allParticipants.find(p => p.isSpeaking);
    if (speakingParticipant) {
      return speakingParticipant;
    }
    
    return allParticipants[0];
  };
  
  // Layout calculations
  const calculateLayout = () => {
    const count = allParticipants.length;
    
    if (count <= 1) return [1, 1];
    if (count === 2) return [1, 2];
    if (count <= 4) return [2, 2];
    if (count <= 6) return [2, 3];
    if (count <= 9) return [3, 3];
    if (count <= 12) return [3, 4];
    return [4, 4];
  };
  
  const [rows, cols] = calculateLayout();
  
  // Record the entire group call
  const handleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording().catch(err => 
        console.error('Failed to start group call recording:', err)
      );
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black/90">
      {/* Main Content Area */}
      <div className="h-full w-full p-4 flex flex-col">
        {/* Participants Grid or Focus View */}
        <div className="flex-1 overflow-hidden">
          {layout === 'focus' ? (
            <div className="h-full flex flex-col">
              {/* Large focused view */}
              <div className="flex-1 mb-2 relative">
                <ParticipantTile
                  participant={getFocusedParticipant()}
                  isFocused={true}
                  onFocus={() => {}}
                  isDark={isDark}
                />
              </div>
              
              {/* Thumbnails at bottom */}
              <div className="h-24 flex space-x-2 overflow-x-auto pb-2">
                {allParticipants.map(participant => (
                  <div
                    key={participant.id}
                    className={`h-full aspect-video flex-shrink-0 ${
                      focusedParticipant === participant.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setFocusedParticipant(participant.id)}
                  >
                    <ParticipantTile
                      participant={participant}
                      isFocused={false}
                      onFocus={() => setFocusedParticipant(participant.id)}
                      isDark={isDark}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div 
              className="h-full grid gap-2" 
              style={{
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
              }}
            >
              {allParticipants.map(participant => (
                <ParticipantTile
                  key={participant.id}
                  participant={participant}
                  isFocused={focusedParticipant === participant.id}
                  onFocus={() => setFocusedParticipant(participant.id)}
                  isDark={isDark}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Call Controls */}
        <div className="h-16 mt-2 flex items-center justify-center">
          <div className="bg-black/50 rounded-full p-2 flex items-center space-x-4">
            <button
              onClick={toggleAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isAudioEnabled 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            
            <button
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isVideoEnabled
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            
            <button
              onClick={() => toggleScreenShare()}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isScreenSharing
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
            </button>
            
            <button
              onClick={() => setShowChat(!showChat)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                showChat
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <MessageSquare size={20} />
            </button>
            
            <button
              onClick={handleRecording}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${isRecording ? 'bg-white' : 'bg-red-500'}`}></span>
            </button>
            
            <button
              onClick={() => setLayout(layout === 'grid' ? 'focus' : 'grid')}
              className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors text-white"
            >
              {layout === 'grid' ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
            </button>
            
            <button
              onClick={endCall}
              className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors text-white"
            >
              <Phone size={20} className="rotate-135" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Participant Count and Call Info */}
      <div className="absolute top-4 left-4 bg-black/50 rounded-full px-3 py-1.5 flex items-center space-x-2">
        <Users size={16} className="text-white" />
        <span className="text-white text-sm">{allParticipants.length} participants</span>
      </div>
      
      {/* Connection Quality */}
      <div className="absolute top-4 right-4">
        <ConnectionQuality />
      </div>
      
      {/* Add Participant Button */}
      <button 
        className="absolute top-16 right-4 bg-green-500 hover:bg-green-600 text-white rounded-full p-2"
        title="Add participant"
      >
        <UserPlus size={20} />
      </button>
      
      {/* Chat Panel */}
      {showChat && (
        <div className="absolute right-4 top-28 bottom-24 w-80 bg-gray-900/90 border border-white/20 rounded-xl backdrop-blur-md overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-medium">Group Chat</h3>
              <button 
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white"
              >
                <MessageSquare size={18} />
              </button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto">
              {/* Chat messages would go here */}
              <div className="text-center text-gray-500 py-6">
                Group chat messages will appear here
              </div>
            </div>
            <div className="p-3 border-t border-white/10">
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex-1 bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupCallView;