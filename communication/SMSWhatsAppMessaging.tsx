import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, MessageCircle, Clock, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  content: string;
  type: 'sms' | 'whatsapp';
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  mediaUrl?: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  lastMessage?: string;
  unreadCount: number;
  isOnline?: boolean;
}

const SMSWhatsAppMessaging: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sms' | 'whatsapp'>('sms');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch contacts and messages on mount
  useEffect(() => {
    fetchContacts();
    fetchMessages();
  }, [activeTab]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      const contactsData = await response.json();
      
      const formattedContacts: Contact[] = contactsData.map((contact: any) => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phone || '+1234567890',
        avatar: contact.avatar,
        lastMessage: 'Click to start conversation',
        unreadCount: 0,
        isOnline: Math.random() > 0.5 // Simulate online status
      }));
      
      setContacts(formattedContacts);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive"
      });
    }
  };

  const fetchMessages = async () => {
    if (!selectedContact) return;
    
    try {
      // In a real app, this would fetch from your message API
      const mockMessages: Message[] = [
        {
          id: '1',
          contactId: selectedContact.id,
          contactName: selectedContact.name,
          contactPhone: selectedContact.phone,
          content: 'Hello! Thanks for reaching out.',
          type: activeTab,
          direction: 'inbound',
          status: 'read',
          timestamp: new Date(Date.now() - 3600000)
        },
        {
          id: '2',
          contactId: selectedContact.id,
          contactName: selectedContact.name,
          contactPhone: selectedContact.phone,
          content: 'Hi! How can I help you today?',
          type: activeTab,
          direction: 'outbound',
          status: 'delivered',
          timestamp: new Date(Date.now() - 1800000)
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    setIsLoading(true);
    
    try {
      const messageData = {
        contactId: selectedContact.id,
        content: newMessage,
        type: activeTab,
        phone: selectedContact.phone
      };

      const endpoint = activeTab === 'sms' 
        ? '/api/communication/send-sms'
        : '/api/composio/whatsapp/message';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        const newMsg: Message = {
          id: Date.now().toString(),
          contactId: selectedContact.id,
          contactName: selectedContact.name,
          contactPhone: selectedContact.phone,
          content: newMessage,
          type: activeTab,
          direction: 'outbound',
          status: 'sent',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        
        toast({
          title: "Message sent",
          description: `${activeTab.toUpperCase()} message sent successfully`
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-500" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-500" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      case 'failed':
        return <Clock className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'sms' | 'whatsapp')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sms" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                SMS
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm truncate">{contact.name}</p>
                    {contact.unreadCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{contact.phone}</p>
                  <p className="text-xs text-gray-400 truncate">{contact.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  <p className="text-sm text-gray-500">{selectedContact.phone}</p>
                </div>
                <div className="ml-auto">
                  <Badge variant={activeTab === 'sms' ? 'default' : 'secondary'}>
                    {activeTab.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.direction === 'outbound'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center gap-1 mt-1 ${
                        message.direction === 'outbound' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.direction === 'outbound' && getStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  placeholder={`Type a ${activeTab} message...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  className="px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SMSWhatsAppMessaging;