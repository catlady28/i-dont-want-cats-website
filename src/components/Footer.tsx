import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import SecureDonationButton from './SecureDonationButton';
import EditableText from './EditableText';
import { useContent } from '../hooks/useContent';

const Footer = () => {
  const { content, updateContent } = useContent();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {/* Same cartoon cat SVG */}
              <svg 
                className="h-6 w-6 text-amber-500" 
                viewBox="0 0 64 64" 
                fill="currentColor"
              >
                <ellipse cx="32" cy="35" rx="18" ry="16" fill="currentColor" opacity="0.9"/>
                <path d="M18 25 L14 15 L24 20 Z" fill="currentColor"/>
                <path d="M46 25 L50 15 L40 20 Z" fill="currentColor"/>
                <path d="M18 22 L16 17 L22 19 Z" fill="white" opacity="0.7"/>
                <path d="M46 22 L48 17 L42 19 Z" fill="white" opacity="0.7"/>
                <ellipse cx="26" cy="32" rx="3" ry="4" fill="white"/>
                <ellipse cx="38" cy="32" rx="3" ry="4" fill="white"/>
                <ellipse cx="26" cy="33" rx="1.5" ry="2" fill="black"/>
                <ellipse cx="38" cy="33" rx="1.5" ry="2" fill="black"/>
                <path d="M32 38 L30 40 L34 40 Z" fill="#ff6b9d"/>
                <path d="M32 40 Q28 42 26 44" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M32 40 Q36 42 38 44" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <line x1="15" y1="35" x2="22" y2="36" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                <line x1="15" y1="38" x2="22" y2="38" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                <line x1="42" y1="36" x2="49" y2="35" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                <line x1="42" y1="38" x2="49" y2="38" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              <EditableText
                value={content.organizationName}
                onSave={(value) => updateContent({ organizationName: value })}
                className="text-xl font-semibold"
                maxLength={50}
                required
              />
            </div>
            <EditableText
              value="Dedicated to finding loving homes for stray cats and providing them with the care they deserve."
              onSave={(value) => {
                const newContent = { ...content };
                newContent.footerDescription = value;
                updateContent(newContent);
              }}
              className="text-gray-300 mb-4"
              multiline
              maxLength={200}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-amber-400" />
                <EditableText
                  value={content.phone}
                  onSave={(value) => updateContent({ phone: value })}
                  className="text-gray-300"
                  maxLength={20}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-amber-400" />
                <EditableText
                  value={content.email}
                  onSave={(value) => updateContent({ email: value })}
                  className="text-gray-300"
                  maxLength={100}
                />
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-amber-400" />
                <EditableText
                  value={content.address}
                  onSave={(value) => updateContent({ address: value })}
                  className="text-gray-300"
                  maxLength={100}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support Our Mission</h3>
            <EditableText
              value="Every donation helps us rescue, care for, and find homes for stray cats."
              onSave={(value) => {
                const newContent = { ...content };
                newContent.donationMessage = value;
                updateContent(newContent);
              }}
              className="text-gray-300 mb-4"
              multiline
              maxLength={150}
            />
            <SecureDonationButton variant="secondary" />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <EditableText
            value={`© 2025 ${content.organizationName}. Made with ❤️ for our feline friends.`}
            onSave={(value) => {
              const newContent = { ...content };
              newContent.copyrightText = value;
              updateContent(newContent);
            }}
            className=""
            maxLength={100}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;