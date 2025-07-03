import React, { useState, useCallback } from 'react';
import { Upload, File, FileText, Image, Download, Trash2, Eye, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  url: string;
  category: 'contract' | 'proposal' | 'invoice' | 'presentation' | 'other';
  associatedContact?: string;
  associatedDeal?: string;
}

const DocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    
    try {
      for (const file of acceptedFiles) {
        // In a real app, this would upload to your storage service
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', selectedCategory);
        
        // Simulate upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newDocument: Document = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadDate: new Date(),
          url: URL.createObjectURL(file), // Temporary URL for demo
          category: selectedCategory as Document['category'] || 'other'
        };
        
        setDocuments(prev => [...prev, newDocument]);
        
        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded successfully`
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload one or more files",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [selectedCategory, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/plain': ['.txt'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
    if (type.includes('image')) return <Image className="w-6 h-6 text-blue-500" />;
    if (type.includes('word') || type.includes('document')) return <FileText className="w-6 h-6 text-blue-600" />;
    if (type.includes('excel') || type.includes('spreadsheet')) return <FileText className="w-6 h-6 text-green-600" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'proposal': return 'bg-blue-100 text-blue-800';
      case 'invoice': return 'bg-green-100 text-green-800';
      case 'presentation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      // In a real app, this would call your deletion API
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      toast({
        title: "Document deleted",
        description: "Document has been permanently deleted"
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete document",
        variant: "destructive"
      });
    }
  };

  const downloadDocument = (document: Document) => {
    // In a real app, this would download from your storage service
    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    link.click();
    
    toast({
      title: "Download started",
      description: `Downloading ${document.name}`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Document Manager</h2>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Categories</option>
            <option value="contract">Contracts</option>
            <option value="proposal">Proposals</option>
            <option value="invoice">Invoices</option>
            <option value="presentation">Presentations</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Drag & drop files here, or click to select files
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOC, DOCX, XLS, XLSX, Images (max 10MB)
                </p>
              </div>
            )}
          </div>
          
          {isUploading && (
            <Alert className="mt-4">
              <AlertDescription>
                Uploading files... Please wait.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getFileIcon(document.type)}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm truncate" title={document.name}>
                      {document.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(document.size)}
                    </p>
                  </div>
                </div>
                <Badge className={`text-xs ${getCategoryColor(document.category)}`}>
                  {document.category}
                </Badge>
              </div>
              
              <p className="text-xs text-gray-500 mb-3">
                Uploaded {document.uploadDate.toLocaleDateString()}
              </p>
              
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPreviewDocument(document)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{document.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 min-h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
                      {document.type.includes('image') ? (
                        <img 
                          src={document.url} 
                          alt={document.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="text-center">
                          {getFileIcon(document.type)}
                          <p className="mt-4 text-gray-600">
                            Preview not available for this file type
                          </p>
                          <Button 
                            className="mt-4"
                            onClick={() => downloadDocument(document)}
                          >
                            Download to View
                          </Button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadDocument(document)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deleteDocument(document.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <File className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No documents match your filters' 
                : 'No documents uploaded yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentManager;