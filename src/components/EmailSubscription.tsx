import React, { useState } from 'react';
import { Mail, Check, AlertCircle, Loader } from 'lucide-react';
import { sanitizeInput, validate, formRateLimiter } from '../utils/security';

interface EmailSubscriptionProps {
  className?: string;
}

const EmailSubscription: React.FC<EmailSubscriptionProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!validate.required(email)) {
      newErrors.push('Email address is required');
    } else if (!validate.email(email)) {
      newErrors.push('Please enter a valid email address');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Rate limiting check
    const clientId = 'email_subscription';
    if (!formRateLimiter.isAllowed(clientId)) {
      const remainingTime = formRateLimiter.getRemainingTime(clientId);
      setStatus('error');
      setMessage(`Too many attempts. Please try again in ${Math.ceil(remainingTime / 60)} minutes.`);
      return;
    }

    setStatus('loading');
    setMessage('');
    setErrors([]);

    try {
      // Sanitize email input
      const sanitizedEmail = sanitizeInput.email(email);
      
      if (!sanitizedEmail) {
        throw new Error('Invalid email format');
      }

      // Simulate API call - replace with your actual email service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, you would send this to your email service:
      // const response = await fetch('/api/subscribe', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-Requested-With': 'XMLHttpRequest'
      //   },
      //   body: JSON.stringify({ email: sanitizedEmail })
      // });

      setStatus('success');
      setMessage('Thank you for subscribing! You\'ll receive updates about our cats and rescue efforts.');
      setEmail('');
      
      // Store subscription locally (in production, this would be handled server-side)
      const subscriptions = JSON.parse(localStorage.getItem('email_subscriptions') || '[]');
      subscriptions.push({
        email: sanitizedEmail,
        timestamp: new Date().toISOString(),
        source: 'website'
      });
      localStorage.setItem('email_subscriptions', JSON.stringify(subscriptions));

    } catch (error) {
      setStatus('error');
      setMessage('Sorry, there was an error subscribing. Please try again later.');
      console.error('Subscription error:', error);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-orange-200 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-orange-50 rounded-full p-2">
          <Mail className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-amber-900">Stay Updated</h3>
          <p className="text-sm text-amber-700">Get news about our rescue cats and adoption events</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                errors.length > 0 ? 'border-red-300' : 'border-orange-300'
              }`}
              disabled={status === 'loading'}
              maxLength={254} // RFC 5321 email length limit
              autoComplete="email"
            />
            {status === 'loading' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader className="h-5 w-5 text-amber-600 animate-spin" />
              </div>
            )}
          </div>
          
          {errors.length > 0 && (
            <div className="mt-2 space-y-1">
              {errors.map((error, index) => (
                <div key={index} className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
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
              <span>Subscribing...</span>
            </>
          ) : status === 'success' ? (
            <>
              <Check className="h-4 w-4" />
              <span>Subscribed!</span>
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              <span>Subscribe to Updates</span>
            </>
          )}
        </button>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            status === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </form>

      <p className="text-xs text-amber-600 mt-4">
        We respect your privacy. Unsubscribe at any time. We'll never share your email address.
      </p>
    </div>
  );
};

export default EmailSubscription;