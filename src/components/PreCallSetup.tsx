import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Settings, 
  Phone,
  Monitor,
  Camera,
  Speaker,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Avatar from './ui/Avatar';
import { getInitials } from '../utils/avatars';

interface PreCallSetupProps {
  isVisible: boolean;
  onStartCall: (settings: CallSettings) => void;
  onCancel: () => void;
  participant: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  callType: 'video' | 'audio';
}

interface CallSettings {
  videoEnabled: boolean;
  audioEnabled: boolean;
  selectedCamera?: string;
  selectedMicrophone?: string;
  selectedSpeaker?: string;
}

const PreCallSetup: React.FC<PreCallSetupProps> = ({
  isVisible,
  onStartCall,
  onCancel,
  participant,
  callType
}) => {
  const { isDark } = useTheme();
  const [videoEnabled, setVideoEnabled] = useState(callType === 'video');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [devices, setDevices] = useState<{
    cameras: MediaDeviceInfo[];
    microphones: MediaDeviceInfo[];
    speakers: MediaDeviceInfo[];
  }>({
    cameras: [],
    microphones: [],
    speakers: []
  });
  const [selectedDevices, setSelectedDevices] = useState<{
    camera?: string;
    microphone?: string;
    speaker?: string;
  }>({});
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [isTestingDevices, setIsTestingDevices] = useState(false);
  const [deviceTests, setDeviceTests] = useState<{
    camera: 'idle' | 'testing' | 'success' | 'error';
    microphone: 'idle' | 'testing' | 'success' | 'error';
    speaker: 'idle' | 'testing' | 'success' | 'error';
  }>({
    camera: 'idle',
    microphone: 'idle',
    speaker: 'idle'
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  // Get available devices
  useEffect(() => {
    if (!isVisible) return;

    const getDevices = async () => {
      try {
        // Request permissions first
        await navigator.mediaDevices.getUserMedia({ 
          video: callType === 'video', 
          audio: true 
        });

        const deviceList = await navigator.mediaDevices.enumerateDevices();
        
        const cameras = deviceList.filter(device => device.kind === 'videoinput');
        const microphones = deviceList.filter(device => device.kind === 'audioinput');
        const speakers = deviceList.filter(device => device.kind === 'audiooutput');

        setDevices({ cameras, microphones, speakers });

        // Set default selections
        if (cameras.length > 0) {
          setSelectedDevices(prev => ({ ...prev, camera: cameras[0].deviceId }));
        }
        if (microphones.length > 0) {
          setSelectedDevices(prev => ({ ...prev, microphone: microphones[0].deviceId }));
        }
        if (speakers.length > 0) {
          setSelectedDevices(prev => ({ ...prev, speaker: speakers[0].deviceId }));
        }

      } catch (error) {
        console.error('Error getting devices:', error);
      }
    };

    getDevices();
  }, [isVisible, callType]);

  // Setup preview stream
  useEffect(() => {
    if (!isVisible || !videoEnabled) {
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
        setPreviewStream(null);
      }
      return;
    }

    const setupPreview = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoEnabled ? {
            deviceId: selectedDevices.camera ? { exact: selectedDevices.camera } : undefined,
            width: { ideal: 640 },
            height: { ideal: 480 }
          } : false,
          audio: audioEnabled ? {
            deviceId: selectedDevices.microphone ? { exact: selectedDevices.microphone } : undefined
          } : false
        });

        setPreviewStream(stream);

        if (videoRef.current && videoEnabled) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error setting up preview:', error);
      }
    };

    setupPreview();

    return () => {
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVisible, videoEnabled, audioEnabled, selectedDevices]);

  const testDevice = async (deviceType: 'camera' | 'microphone' | 'speaker') => {
    setDeviceTests(prev => ({ ...prev, [deviceType]: 'testing' }));

    try {
      switch (deviceType) {
        case 'camera':
          if (selectedDevices.camera) {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: { exact: selectedDevices.camera } }
            });
            stream.getTracks().forEach(track => track.stop());
            setDeviceTests(prev => ({ ...prev, camera: 'success' }));
          }
          break;

        case 'microphone':
          if (selectedDevices.microphone) {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: { deviceId: { exact: selectedDevices.microphone } }
            });
            stream.getTracks().forEach(track => track.stop());
            setDeviceTests(prev => ({ ...prev, microphone: 'success' }));
          }
          break;

        case 'speaker':
          // Test speaker by playing a short audio tone
          const audioContext = new AudioContext();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 440;
          gainNode.gain.value = 0.1;
          
          oscillator.start();
          setTimeout(() => {
            oscillator.stop();
            audioContext.close();
          }, 500);
          
          setDeviceTests(prev => ({ ...prev, speaker: 'success' }));
          break;
      }
    } catch (error) {
      console.error(`Error testing ${deviceType}:`, error);
      setDeviceTests(prev => ({ ...prev, [deviceType]: 'error' }));
    }

    // Reset test status after 3 seconds
    setTimeout(() => {
      setDeviceTests(prev => ({ ...prev, [deviceType]: 'idle' }));
    }, 3000);
  };

  const handleStartCall = () => {
    const settings: CallSettings = {
      videoEnabled,
      audioEnabled,
      selectedCamera: selectedDevices.camera,
      selectedMicrophone: selectedDevices.microphone,
      selectedSpeaker: selectedDevices.speaker
    };

    onStartCall(settings);
  };

  const getTestIcon = (status: string) => {
    switch (status) {
      case 'testing': return <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />;
      case 'success': return <CheckCircle size={16} className="text-green-400" />;
      case 'error': return <AlertCircle size={16} className="text-red-400" />;
      default: return null;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className={`${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/20' : 'border-gray-200'} rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full mx-4`}>
        
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-4">
            <Avatar
              src={participant.avatar}
              alt={participant.name}
              size="lg"
              fallback={getInitials(participant.name)}
            />
            <div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Call Setup
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Calling {participant.name} • {callType} call
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Video Preview */}
          <div className="space-y-4">
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Preview
            </h3>
            
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
              {videoEnabled && previewStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Avatar
                      src=""
                      alt="You"
                      size="xl"
                      fallback="JD"
                      className="mx-auto mb-3"
                    />
                    <p className="text-white/70 text-sm">
                      {videoEnabled ? 'Setting up camera...' : 'Camera is off'}
                    </p>
                  </div>
                </div>
              )}

              {/* Controls Overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    videoEnabled 
                      ? `${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white/20 hover:bg-white/30'} text-white` 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                </button>
                
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    audioEnabled 
                      ? `${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white/20 hover:bg-white/30'} text-white` 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Device Settings */}
          <div className="space-y-6">
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Device Settings
            </h3>

            {/* Camera Selection */}
            {callType === 'video' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Camera
                  </label>
                  <button
                    onClick={() => testDevice('camera')}
                    disabled={deviceTests.camera === 'testing'}
                    className={`flex items-center space-x-1 text-xs px-2 py-1 rounded ${
                      isDark 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    } transition-colors disabled:opacity-50`}
                  >
                    {getTestIcon(deviceTests.camera) || <Camera size={12} />}
                    <span>Test</span>
                  </button>
                </div>
                <select
                  value={selectedDevices.camera || ''}
                  onChange={(e) => setSelectedDevices(prev => ({ ...prev, camera: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark 
                      ? 'bg-gray-800 border-white/10 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {devices.cameras.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Microphone Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Microphone
                </label>
                <button
                  onClick={() => testDevice('microphone')}
                  disabled={deviceTests.microphone === 'testing'}
                  className={`flex items-center space-x-1 text-xs px-2 py-1 rounded ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } transition-colors disabled:opacity-50`}
                >
                  {getTestIcon(deviceTests.microphone) || <Mic size={12} />}
                  <span>Test</span>
                </button>
              </div>
              <select
                value={selectedDevices.microphone || ''}
                onChange={(e) => setSelectedDevices(prev => ({ ...prev, microphone: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDark 
                    ? 'bg-gray-800 border-white/10 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {devices.microphones.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Speaker Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Speaker
                </label>
                <button
                  onClick={() => testDevice('speaker')}
                  disabled={deviceTests.speaker === 'testing'}
                  className={`flex items-center space-x-1 text-xs px-2 py-1 rounded ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } transition-colors disabled:opacity-50`}
                >
                  {getTestIcon(deviceTests.speaker) || <Speaker size={12} />}
                  <span>Test</span>
                </button>
              </div>
              <select
                value={selectedDevices.speaker || ''}
                onChange={(e) => setSelectedDevices(prev => ({ ...prev, speaker: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDark 
                    ? 'bg-gray-800 border-white/10 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {devices.speakers.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Speaker ${device.deviceId.slice(0, 8)}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Settings Summary */}
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Call Settings
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Video:</span>
                  <span className={videoEnabled ? 'text-green-400' : 'text-red-400'}>
                    {videoEnabled ? 'On' : 'Off'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Audio:</span>
                  <span className={audioEnabled ? 'text-green-400' : 'text-red-400'}>
                    {audioEnabled ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} flex justify-end space-x-3`}>
          <button
            onClick={onCancel}
            className={`px-6 py-2 rounded-lg transition-colors ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleStartCall}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Phone size={16} />
            <span>Start Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreCallSetup;