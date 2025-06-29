import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import SecureDonationButton from './SecureDonationButton';
import EditableText from './EditableText';
import { useContent } from '../hooks/useContent';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { content, updateContent } = useContent();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Available Cats', href: '/cats' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            {/* Cartoon Cat SVG */}
            <svg 
              className="h-8 w-8 text-amber-600 group-hover:text-amber-700 transition-colors" 
              viewBox="0 0 64 64" 
              fill="currentColor"
            >
              {/* Cat head */}
              <ellipse cx="32" cy="35" rx="18" ry="16" fill="currentColor" opacity="0.9"/>
              
              {/* Cat ears */}
              <path d="M18 25 L14 15 L24 20 Z" fill="currentColor"/>
              <path d="M46 25 L50 15 L40 20 Z" fill="currentColor"/>
              
              {/* Inner ears */}
              <path d="M18 22 L16 17 L22 19 Z" fill="white" opacity="0.7"/>
              <path d="M46 22 L48 17 L42 19 Z" fill="white" opacity="0.7"/>
              
              {/* Eyes */}
              <ellipse cx="26" cy="32" rx="3" ry="4" fill="white"/>
              <ellipse cx="38" cy="32" rx="3" ry="4" fill="white"/>
              <ellipse cx="26" cy="33" rx="1.5" ry="2" fill="black"/>
              <ellipse cx="38" cy="33" rx="1.5" ry="2" fill="black"/>
              
              {/* Nose */}
              <path d="M32 38 L30 40 L34 40 Z" fill="#ff6b9d"/>
              
              {/* Mouth */}
              <path d="M32 40 Q28 42 26 44" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <path d="M32 40 Q36 42 38 44" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              
              {/* Whiskers */}
              <line x1="15" y1="35" x2="22" y2="36" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <line x1="15" y1="38" x2="22" y2="38" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <line x1="42" y1="36" x2="49" y2="35" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <line x1="42" y1="38" x2="49" y2="38" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <EditableText
              value={content.organizationName}
              onSave={(value) => updateContent({ organizationName: value })}
              className="text-xl font-semibold text-gray-900"
              maxLength={50}
              required
            />
          </Link>

          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-amber-600 ${
                  isActive(item.href)
                    ? 'text-amber-600 border-b-2 border-amber-600 pb-1'
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <SecureDonationButton size="sm" />
            
            <button
              className="md:hidden p-2 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pb-4">
            <div className="pt-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:text-amber-600 ${
                    isActive(item.href) ? 'text-amber-600' : 'text-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;