import React, { useState } from 'react';
import { Send, Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { sanitizeInput, validate, formRateLimiter } from '../utils/security';
import { useContent } from '../hooks/useContent';

interface ContactFormProps {
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className = '' }) => {
  const { content } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'adoption'
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const inquiryTypes = [
    { value: 'adoption', label: 'Cat Adoption' },
    { value: 'donation', label: 'Donations' },
    { value: 'general', label: 'General Inquiry' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validate.required(formData.name)) {
      newErrors.name = 'Name is required';
    } else if (!validate.maxLength(formData.name, 50)) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    if (!validate.required(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validate.email(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !validate.phone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!validate.required(formData.subject)) {
      newErrors.subject = 'Subject is required';
    } else if (!validate.maxLength(formData.subject, 100)) {
      newErrors.subject = 'Subject must be less than 100 characters';
    }

    if (!validate.required(formData.message)) {
      newErrors.message = 'Message is required';
    } else if (!validate.minLength(formData.message, 10)) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (!validate.maxLength(formData.message, 1000)) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Rate limiting check
    const clientId = `contact_${formData.email}`;
    if (!formRateLimiter.isAllowed(clientId)) {
      const remainingTime = formRateLimiter.getRemainingTime(clientId);
      setStatus('error');
      setMessage(`Too many messages sent. Please try again in ${Math.ceil(remainingTime / 60)} minutes.`);
      return;
    }

    setStatus('loading');
    setMessage('');
    setErrors({});

    try {
      // Sanitize all form data
      const sanitizedData = {
        name: sanitizeInput.text(formData.name),
        email: sanitizeInput.email(formData.email),
        phone: sanitizeInput.phone(formData.phone),
        subject: sanitizeInput.text(formData.subject),
        message: sanitizeInput.html(formData.message),
        inquiryType: formData.inquiryType,
        timestamp: new Date().toISOString(),
        recipient: 'richardmorris34@proton.me'
      };

      // Simulate API call - replace with your actual email service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, you would send this to your email service:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-Requested-With': 'XMLHttpRequest'
      //   },
      //   body: JSON.stringify(sanitizedData)
      // });

      setStatus('success');
      setMessage('Thank you for your message! We\'ll get back to you at richardmorris34@proton.me within 24 hours.');
      
      // Store message locally (in production, this would be handled server-side)
      const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      messages.push(sanitizedData);
      localStorage.setItem('contact_messages', JSON.stringify(messages));

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'adoption'
      });

    } catch (error) {
      setStatus('error');
      setMessage('Sorry, there was an error sending your message. Please try again later or email us directly at richardmorris34@proton.me');
      console.error('Contact form error:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Contact Information */}
        <div className="bg-gradient-to-br from-amber-600 to-orange-700 text-white p-8">
          <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
          <p className="text-orange-100 mb-8 leading-relaxed">
            We'd love to hear from you! Whether you're interested in adopting, donating, 
            or just want to learn more about our mission, don't hesitate to reach out.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-orange-500 rounded-full p-2 mt-1">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Visit Us</h4>
                <p className="text-orange-100">{content.address}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-orange-500 rounded-full p-2 mt-1">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Call Us</h4>
                <p className="text-orange-100">{content.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-orange-500 rounded-full p-2 mt-1">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Email Us</h4>
                <p className="text-orange-100">{content.email}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-orange-500 rounded-full p-2 mt-1">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Hours</h4>
                <p className="text-orange-100">{content.hours}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-orange-600 rounded-lg">
            <h4 className="font-semibold mb-2">Blog Updates</h4>
            <p className="text-orange-100 text-sm mb-3">
              Read more cat stories and updates on our blog:
            </p>
            <a 
              href="https://idontwantcats.blogspot.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white underline hover:text-orange-200 transition-colors"
            >
              idontwantcats.blogspot.com →
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={status === 'loading'}
                  maxLength={50}
                  autoComplete="name"
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={status === 'loading'}
                  maxLength={254}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={status === 'loading'}
                  maxLength={20}
                  autoComplete="tel"
                />
                {errors.phone && (
                  <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                  Inquiry Type
                </label>
                <select
                  id="inquiryType"
                  value={formData.inquiryType}
                  onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  disabled={status === 'loading'}
                >
                  {inquiryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                  errors.subject ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={status === 'loading'}
                maxLength={100}
                placeholder="What's this about?"
              />
              {errors.subject && (
                <p className="text-red-600 text-xs mt-1">{errors.subject}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none ${
                  errors.message ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={status === 'loading'}
                maxLength={1000}
                placeholder="Tell us more about your inquiry..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.message ? (
                  <p className="text-red-600 text-xs">{errors.message}</p>
                ) : (
                  <span></span>
                )}
                <span className="text-xs text-gray-500">
                  {formData.message.length}/1000
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                status === 'success'
                  ? 'bg-green-600 text-white cursor-default'
                  : status === 'loading'
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-amber-600 text-white hover:bg-amber-700 transform hover:scale-105'
              }`}
            >
              {status === 'loading' ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Message Sent!</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>

            {message && (
              <div className={`p-4 rounded-lg text-sm ${
                status === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <div className="flex items-start space-x-2">
                  {status === 'success' ? (
                    <CheckCircle className="h-4 w-4 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mt-0.5" />
                  )}
                  <span>{message}</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;