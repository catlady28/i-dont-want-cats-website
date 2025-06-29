import React, { useState } from 'react';
import { DollarSign, Shield, ExternalLink, Heart } from 'lucide-react';
import { useContent } from '../hooks/useContent';

interface SecureDonationButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SecureDonationButton: React.FC<SecureDonationButtonProps> = ({ 
  variant = 'primary', 
  size = 'md',
  className = ''
}) => {
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const { content } = useContent();

  const baseClasses = "font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center space-x-2 relative";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-amber-600 to-orange-700 text-white hover:from-amber-700 hover:to-orange-800",
    secondary: "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const handleDonationClick = () => {
    // Open PayPal.me link in new tab for security
    window.open(content.paypalMeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative">
      <button 
        onClick={handleDonationClick}
        onMouseEnter={() => setShowSecurityInfo(true)}
        onMouseLeave={() => setShowSecurityInfo(false)}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        aria-label="Make a secure donation via PayPal"
      >
        <Heart className="h-4 w-4" />
        <span>Donate Now</span>
        <Shield className="h-3 w-3 opacity-75" />
      </button>

      {showSecurityInfo && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-sm rounded-lg p-3 z-50 shadow-xl">
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Secure PayPal Donation</p>
              <p className="text-gray-300 text-xs">
                Redirects to PayPal's secure payment system. Your financial information is protected by PayPal's industry-leading security.
              </p>
            </div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default SecureDonationButton;