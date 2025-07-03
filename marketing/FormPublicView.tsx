import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormStore, FormTemplate } from '../../store/formStore';
import { 
  CheckIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  LockIcon,
  AlertCircleIcon,
  LoaderIcon
} from 'lucide-react';

const FormPublicView: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { forms, submitFormResponse } = useFormStore();
  
  const [currentForm, setCurrentForm] = useState<FormTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    if (formId && forms[formId]) {
      setCurrentForm(forms[formId]);
    }
  }, [formId, forms]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    if (currentForm) {
      currentForm.fields.forEach(field => {
        if (field.required && (!formData[field.label] || 
            (Array.isArray(formData[field.label]) && formData[field.label].length === 0))) {
          newErrors[field.label] = 'This field is required';
          isValid = false;
        }
        
        if (field.type === 'email' && formData[field.label] && 
            !/^\S+@\S+\.\S+$/.test(formData[field.label])) {
          newErrors[field.label] = 'Please enter a valid email address';
          isValid = false;
        }
        
        if (field.type === 'phone' && formData[field.label] && 
            !/^[+\s0-9()-]{7,20}$/.test(formData[field.label])) {
          newErrors[field.label] = 'Please enter a valid phone number';
          isValid = false;
        }
      });
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentForm || !validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitFormResponse(currentForm.id, formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ 
        form: 'There was a problem submitting the form. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (
    field: string, 
    value: string | string[] | boolean
  ) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error for this field if it exists
    if (errors[field]) {
      const { [field]: removedError, ...restErrors } = errors;
      setErrors(restErrors);
    }
  };
  
  if (!currentForm) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <AlertCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold mb-2 text-gray-700">Form Not Found</h2>
          <p className="text-gray-500 mb-4">The form you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }
  
  if (!currentForm.isActive) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <LockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold mb-2 text-gray-700">This form is currently inactive</h2>
          <p className="text-gray-500 mb-4">The form owner has temporarily disabled this form.</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }
  
  if (submitted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckIcon className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-700">Thank You!</h2>
          <p className="text-gray-500 mb-4">Your form has been submitted successfully.</p>
          <button 
            onClick={() => {
              setFormData({});
              setSubmitted(false);
            }} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }
  
  const renderField = (field: any) => {
    const { id, type, label, required, options, placeholder } = field;
    
    switch (type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <div key={id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={type === 'phone' ? 'tel' : type}
              value={formData[label] || ''}
              onChange={(e) => handleInputChange(label, e.target.value)}
              placeholder={placeholder || ''}
              className={`w-full p-2 border rounded-md ${
                errors[label] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {errors[label] && (
              <p className="mt-1 text-sm text-red-500">{errors[label]}</p>
            )}
          </div>
        );
      
      case 'textarea':
        return (
          <div key={id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={formData[label] || ''}
              onChange={(e) => handleInputChange(label, e.target.value)}
              placeholder={placeholder || ''}
              rows={4}
              className={`w-full p-2 border rounded-md ${
                errors[label] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {errors[label] && (
              <p className="mt-1 text-sm text-red-500">{errors[label]}</p>
            )}
          </div>
        );
      
      case 'select':
        return (
          <div key={id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={formData[label] || ''}
              onChange={(e) => handleInputChange(label, e.target.value)}
              className={`w-full p-2 border rounded-md ${
                errors[label] ? 'border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="" disabled>Select an option</option>
              {options?.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            {errors[label] && (
              <p className="mt-1 text-sm text-red-500">{errors[label]}</p>
            )}
          </div>
        );
      
      case 'checkbox':
        return (
          <div key={id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {options?.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${id}-${index}`}
                    checked={Array.isArray(formData[label]) && formData[label].includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(formData[label]) ? [...formData[label]] : [];
                      if (e.target.checked) {
                        handleInputChange(label, [...currentValues, option]);
                      } else {
                        handleInputChange(label, currentValues.filter(value => value !== option));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`${id}-${index}`} className="ml-2 block text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {errors[label] && (
              <p className="mt-1 text-sm text-red-500">{errors[label]}</p>
            )}
          </div>
        );
      
      case 'radio':
        return (
          <div key={id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {options?.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`${id}-${index}`}
                    name={label}
                    value={option}
                    checked={formData[label] === option}
                    onChange={(e) => handleInputChange(label, e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor={`${id}-${index}`} className="ml-2 block text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {errors[label] && (
              <p className="mt-1 text-sm text-red-500">{errors[label]}</p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">{currentForm.name}</h2>
          
          {currentForm.description && (
            <p className="mb-6 text-gray-600 text-center">{currentForm.description}</p>
          )}
          
          <form onSubmit={handleSubmit}>
            {currentForm.fields.map(field => renderField(field))}
            
            {errors.form && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                <p>{errors.form}</p>
              </div>
            )}
            
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <LoaderIcon size={16} className="animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="px-6 py-3 bg-gray-50 text-xs text-center text-gray-500 border-t">
          Powered by Smart CRM Forms
        </div>
      </div>
    </div>
  );
};

export default FormPublicView;