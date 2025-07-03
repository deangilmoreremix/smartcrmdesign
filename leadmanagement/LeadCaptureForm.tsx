import React, { useState } from 'react';
import { Send, User, Mail, Phone, Building, Briefcase, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface LeadFormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  industry: string;
  message: string;
  source: string;
}

interface LeadCaptureFormProps {
  onLeadSubmitted?: (lead: LeadFormData) => void;
  source?: string;
  embedded?: boolean;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ 
  onLeadSubmitted, 
  source = 'website',
  embedded = false 
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    industry: '',
    message: '',
    source
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof LeadFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Full name is required",
        variant: "destructive"
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error", 
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const submitLead = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          position: formData.position,
          industry: formData.industry,
          notes: formData.message,
          status: 'lead',
          score: 50 // Default lead score
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        onLeadSubmitted?.(formData);
        
        toast({
          title: "Lead Submitted",
          description: "Thank you! We'll be in touch soon."
        });

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            company: '',
            position: '',
            industry: '',
            message: '',
            source
          });
          setIsSubmitted(false);
        }, 3000);
      } else {
        throw new Error('Failed to submit lead');
      }
    } catch (error) {
      console.error('Lead submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateEmbedCode = () => {
    const embedUrl = `${window.location.origin}/embed/lead-form?source=${encodeURIComponent(source)}`;
    return `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0"></iframe>`;
  };

  if (isSubmitted) {
    return (
      <Card className={embedded ? 'border-0 shadow-none' : ''}>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-4">
            Your information has been submitted successfully. We'll get back to you within 24 hours.
          </p>
          <Button 
            onClick={() => setIsSubmitted(false)}
            variant="outline"
          >
            Submit Another Lead
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={embedded ? 'border-0 shadow-none' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Get Started Today
        </CardTitle>
        <p className="text-gray-600">
          Fill out the form below and we'll be in touch to discuss how we can help your business grow.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Name and Email Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name *
            </Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('fullName', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@company.com"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Phone and Company Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Company
            </Label>
            <Input
              id="company"
              placeholder="Acme Corp"
              value={formData.company}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('company', e.target.value)}
            />
          </div>
        </div>

        {/* Position and Industry Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="position" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Job Title
            </Label>
            <Input
              id="position"
              placeholder="Sales Manager"
              value={formData.position}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('position', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <select
              id="industry"
              value={formData.industry}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Industry</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="retail">Retail</option>
              <option value="education">Education</option>
              <option value="real-estate">Real Estate</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            How can we help you?
          </Label>
          <Textarea
            id="message"
            placeholder="Tell us about your business needs and goals..."
            value={formData.message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('message', e.target.value)}
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <Button 
          onClick={submitLead}
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Get Started
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By submitting this form, you agree to our Terms of Service and Privacy Policy.
        </p>

        {/* Embed Code for Admins */}
        {!embedded && (
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              Embed This Form
            </summary>
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-600 mb-2">
                Copy and paste this code to embed the form on your website:
              </p>
              <textarea
                readOnly
                value={generateEmbedCode()}
                className="w-full text-xs font-mono bg-white border rounded px-2 py-1"
                rows={2}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadCaptureForm;