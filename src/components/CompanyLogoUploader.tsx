import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  Image, 
  X, 
  Check, 
  AlertCircle, 
  Loader2,
  Eye,
  Trash2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase, STORAGE_BUCKETS } from '../lib/supabase';

interface CompanyLogoUploaderProps {
  customerId: string;
  currentLogoUrl?: string;
  onUploadSuccess?: (logoUrl: string) => void;
  onUploadError?: (error: string) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
  className?: string;
}

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

const CompanyLogoUploader: React.FC<CompanyLogoUploaderProps> = ({
  customerId,
  currentLogoUrl,
  onUploadSuccess,
  onUploadError,
  maxSizeMB = 5,
  allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'],
  className = ''
}) => {
  const { isDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentLogoUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    success: false
  });

  // Validate file before upload
  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return `File type not supported. Allowed types: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`;
    }

    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return `File size too large. Maximum size: ${maxSizeMB}MB`;
    }

    return null;
  }, [allowedTypes, maxSizeMB]);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadState(prev => ({ ...prev, error: validationError }));
      return;
    }

    setSelectedFile(file);
    setUploadState(prev => ({ ...prev, error: null, success: false }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [validateFile]);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Handle file input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Generate unique file path
  const generateFilePath = useCallback((file: File): string => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    return `${customerId}/${timestamp}-${randomId}.${extension}`;
  }, [customerId]);

  // Upload file to Supabase Storage
  const uploadToStorage = useCallback(async (file: File, filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const uploadTask = supabase.storage
        .from(STORAGE_BUCKETS.COMPANY_LOGOS)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      uploadTask
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }
          
          // Get public URL
          const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKETS.COMPANY_LOGOS)
            .getPublicUrl(filePath);
          
          resolve(urlData.publicUrl);
        })
        .catch(reject);
    });
  }, []);

  // Update customer record with logo URL
  const updateCustomerLogo = useCallback(async (logoUrl: string): Promise<void> => {
    const { error } = await supabase
      .from('customers')
      .update({
        customization: {
          logo: logoUrl
        }
      })
      .eq('id', customerId);

    if (error) {
      throw new Error(`Failed to update customer record: ${error.message}`);
    }
  }, [customerId]);

  // Main upload function
  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setUploadState(prev => ({ 
      ...prev, 
      uploading: true, 
      progress: 0, 
      error: null, 
      success: false 
    }));

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 200);

      // Generate file path
      const filePath = generateFilePath(selectedFile);

      // Upload to storage
      const logoUrl = await uploadToStorage(selectedFile, filePath);

      // Update customer record
      await updateCustomerLogo(logoUrl);

      // Clear progress interval
      clearInterval(progressInterval);

      // Complete upload
      setUploadState(prev => ({ 
        ...prev, 
        uploading: false, 
        progress: 100, 
        success: true 
      }));

      // Call success callback
      onUploadSuccess?.(logoUrl);

      // Clear selected file after successful upload
      setTimeout(() => {
        setSelectedFile(null);
        setUploadState(prev => ({ ...prev, success: false, progress: 0 }));
      }, 2000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadState(prev => ({ 
        ...prev, 
        uploading: false, 
        error: errorMessage 
      }));
      onUploadError?.(errorMessage);
    }
  }, [selectedFile, generateFilePath, uploadToStorage, updateCustomerLogo, onUploadSuccess, onUploadError]);

  // Remove current logo
  const handleRemoveLogo = useCallback(async () => {
    try {
      await updateCustomerLogo('');
      setPreview(null);
      setSelectedFile(null);
      onUploadSuccess?.('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove logo';
      setUploadState(prev => ({ ...prev, error: errorMessage }));
    }
  }, [updateCustomerLogo, onUploadSuccess]);

  // Clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedFile(null);
    setPreview(currentLogoUrl || null);
    setUploadState(prev => ({ ...prev, error: null, success: false }));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [currentLogoUrl]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl transition-all duration-300
          ${isDark 
            ? 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
          ${uploadState.uploading ? 'pointer-events-none opacity-75' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !uploadState.uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleInputChange}
          className="hidden"
          disabled={uploadState.uploading}
        />

        <div className="p-8">
          {preview ? (
            // Preview Area
            <div className="space-y-4">
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={preview}
                  alt="Logo preview"
                  className="w-full h-full object-contain rounded-lg border border-white/20"
                />
                {!uploadState.uploading && (
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(preview, '_blank');
                      }}
                      className={`p-1 rounded-full ${
                        isDark 
                          ? 'bg-gray-900/80 hover:bg-gray-800 text-white' 
                          : 'bg-white/80 hover:bg-white text-gray-700'
                      } transition-colors`}
                      title="View full size"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedFile) {
                          handleClearSelection();
                        } else {
                          handleRemoveLogo();
                        }
                      }}
                      className="p-1 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                      title={selectedFile ? 'Clear selection' : 'Remove logo'}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>

              {selectedFile && (
                <div className="text-center">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedFile.name}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Upload Prompt
            <div className="text-center space-y-3">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                isDark ? 'bg-white/10' : 'bg-gray-200'
              }`}>
                {uploadState.uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                ) : (
                  <Upload className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
              </div>
              
              <div>
                <p className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {uploadState.uploading ? 'Uploading...' : 'Upload Company Logo'}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Drag and drop your logo here, or click to browse
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                  Supports: {allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} • Max {maxSizeMB}MB
                </p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {uploadState.uploading && (
            <div className="mt-4">
              <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 overflow-hidden`}>
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
              <p className={`text-center text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {uploadState.progress}% uploaded
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {selectedFile && !uploadState.uploading && (
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClearSelection}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Upload size={16} />
            <span>Upload Logo</span>
          </button>
        </div>
      )}

      {/* Status Messages */}
      {uploadState.error && (
        <div className={`p-3 rounded-lg border ${
          isDark 
            ? 'bg-red-500/10 border-red-500/20 text-red-300' 
            : 'bg-red-50 border-red-200 text-red-800'
        } flex items-start space-x-2`}>
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Upload Error</p>
            <p className="text-xs mt-1">{uploadState.error}</p>
          </div>
        </div>
      )}

      {uploadState.success && (
        <div className={`p-3 rounded-lg border ${
          isDark 
            ? 'bg-green-500/10 border-green-500/20 text-green-300' 
            : 'bg-green-50 border-green-200 text-green-800'
        } flex items-start space-x-2`}>
          <Check size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Upload Successful</p>
            <p className="text-xs mt-1">Company logo has been updated successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyLogoUploader;