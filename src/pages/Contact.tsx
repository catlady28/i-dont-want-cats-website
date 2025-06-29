import React from 'react';
import { Mail, Phone, MapPin, Clock, Heart, Users, MessageCircle } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import CommentSystem from '../components/CommentSystem';
import SecureDonationButton from '../components/SecureDonationButton';
import EditableText from '../components/EditableText';
import EditableImage from '../components/EditableImage';
import { useContent } from '../hooks/useContent';

const Contact = () => {
  const { content, updateContent } = useContent();

  const quickActions = [
    {
      icon: Heart,
      title: 'Adopt a Cat',
      description: 'Ready to give a cat their forever home?',
      action: 'Browse Available Cats',
      color: 'bg-red-50 text-red-600 border-red-200'
    },
    {
      icon: Users,
      title: 'General Inquiry',
      description: 'Questions about our cats or services?',
      action: 'Contact Us',
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      icon: MessageCircle,
      title: 'Share Your Story',
      description: 'Tell us about your adoption experience.',
      action: 'Leave a Comment',
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EditableText
            value="Contact Us"
            onSave={(value) => {
              const newContent = { ...content };
              newContent.contactTitle = value;
              updateContent(newContent);
            }}
            className="text-4xl md:text-5xl font-semibold mb-4"
            as="h1"
            maxLength={50}
          />
          <EditableText
            value="We're here to help! Whether you want to adopt, donate, or just learn more about our mission, we'd love to hear from you."
            onSave={(value) => {
              const newContent = { ...content };
              newContent.contactSubtitle = value;
              updateContent(newContent);
            }}
            className="text-xl text-orange-100 max-w-2xl mx-auto mb-8"
            multiline
            maxLength={200}
          />
          <SecureDonationButton size="lg" variant="secondary" />
        </div>
      </section>

      {/* Contact Hero Image */}
      <section className="py-12 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditableImage
            src="https://images.pexels.com/photos/1276553/pexels-photo-1276553.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Contact us about cat adoption"
            onSave={(src) => {
              const newContent = { ...content };
              newContent.contactImage = src;
              updateContent(newContent);
            }}
            aspectRatio="landscape"
            className="rounded-xl shadow-lg w-full"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <EditableText
              value="How Can We Help You?"
              onSave={(value) => {
                const newContent = { ...content };
                newContent.helpTitle = value;
                updateContent(newContent);
              }}
              className="text-2xl md:text-3xl font-semibold text-amber-900 mb-4"
              as="h2"
              maxLength={100}
            />
            <EditableText
              value="Choose the option that best describes what you're looking for"
              onSave={(value) => {
                const newContent = { ...content };
                newContent.helpSubtitle = value;
                updateContent(newContent);
              }}
              className="text-lg text-amber-700"
              maxLength={150}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <div key={index} className={`border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${action.color}`}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4">
                    <action.icon className="h-8 w-8" />
                  </div>
                  <EditableText
                    value={action.title}
                    onSave={(value) => {
                      const newContent = { ...content };
                      if (!newContent.quickActions) newContent.quickActions = [...quickActions];
                      newContent.quickActions[index] = { ...action, title: value };
                      updateContent(newContent);
                    }}
                    className="text-xl font-semibold mb-2 block"
                    maxLength={50}
                  />
                  <EditableText
                    value={action.description}
                    onSave={(value) => {
                      const newContent = { ...content };
                      if (!newContent.quickActions) newContent.quickActions = [...quickActions];
                      newContent.quickActions[index] = { ...action, description: value };
                      updateContent(newContent);
                    }}
                    className="text-gray-600 mb-4 block"
                    multiline
                    maxLength={100}
                  />
                  <EditableText
                    value={action.action}
                    onSave={(value) => {
                      const newContent = { ...content };
                      if (!newContent.quickActions) newContent.quickActions = [...quickActions];
                      newContent.quickActions[index] = { ...action, action: value };
                      updateContent(newContent);
                    }}
                    className="font-medium hover:underline"
                    maxLength={50}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CommentSystem 
            pageId="contact" 
            title="Share Your Story or Ask Questions"
          />
        </div>
      </section>
    </div>
  );
};

export default Contact;