import React from 'react';
import SecureDonationButton from '../components/SecureDonationButton';
import EmailSubscription from '../components/EmailSubscription';
import EditableText from '../components/EditableText';
import EditableImage from '../components/EditableImage';
import { useContent } from '../hooks/useContent';

const Home = () => {
  const { content, updateContent } = useContent();

  return (
    <div>
      {/* Welcome Message Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EditableText
            value="Hi and welcome - no I don't want cats. Please help!"
            onSave={(value) => updateContent({ heroTitle: value })}
            className="text-3xl md:text-4xl font-bold text-amber-900 mb-6 leading-tight"
            as="h1"
            maxLength={100}
            required
          />
          <div className="text-lg md:text-xl text-amber-800 max-w-4xl mx-auto leading-relaxed mb-8 space-y-4">
            <EditableText
              value="You can go to my blog - idontwantcats.blogspot.com to read more cat stories and any updates."
              onSave={(value) => updateContent({ heroSubtitle: value })}
              className="block"
              multiline
              maxLength={200}
            />
            <EditableText
              value="This site is to make contact easy and Donations easy. If you can take and give a cat a forever home we would be eternally grateful."
              onSave={(value) => {
                // Store as additional content
                const newContent = { ...content };
                if (!newContent.homeMessages) newContent.homeMessages = [];
                newContent.homeMessages[0] = value;
                updateContent(newContent);
              }}
              className="block"
              multiline
              maxLength={200}
            />
            <EditableText
              value="If you can Donate to feed this menagerie I would at this time be even more grateful. The extra burden of growing kittens is too much to bare."
              onSave={(value) => {
                const newContent = { ...content };
                if (!newContent.homeMessages) newContent.homeMessages = [];
                newContent.homeMessages[1] = value;
                updateContent(newContent);
              }}
              className="block"
              multiline
              maxLength={200}
            />
            <EditableText
              value="With blessing and love thank you."
              onSave={(value) => {
                const newContent = { ...content };
                if (!newContent.homeMessages) newContent.homeMessages = [];
                newContent.homeMessages[2] = value;
                updateContent(newContent);
              }}
              className="block font-medium text-amber-900"
              maxLength={100}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors text-lg shadow-lg">
              View Available Cats
            </button>
            <SecureDonationButton size="lg" variant="secondary" />
          </div>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditableImage
            src="https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Cats needing homes"
            onSave={(src) => {
              const newContent = { ...content };
              newContent.heroImage = src;
              updateContent(newContent);
            }}
            aspectRatio="landscape"
            className="rounded-xl shadow-lg w-full"
          />
        </div>
      </section>

      {/* Blog Link Section */}
      <section className="py-8 bg-amber-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EditableText
            value="📖 Read more cat stories and updates on our blog:"
            onSave={(value) => {
              const newContent = { ...content };
              newContent.blogPrompt = value;
              updateContent(newContent);
            }}
            className="text-lg mb-4 block"
            maxLength={100}
          />
          <a 
            href="https://idontwantcats.blogspot.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-white text-amber-700 px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors shadow-md"
          >
            <EditableText
              value="Visit idontwantcats.blogspot.com →"
              onSave={(value) => {
                const newContent = { ...content };
                newContent.blogLinkText = value;
                updateContent(newContent);
              }}
              className=""
              maxLength={50}
            />
          </a>
        </div>
      </section>

      {/* Email Subscription Section */}
      <section className="py-12 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <EditableText
              value="Stay Connected with Our Mission"
              onSave={(value) => {
                const newContent = { ...content };
                newContent.subscriptionTitle = value;
                updateContent(newContent);
              }}
              className="text-2xl md:text-3xl font-bold text-amber-900 mb-4"
              as="h2"
              maxLength={100}
            />
            <EditableText
              value="Be the first to know about new rescue cats, adoption success stories, and urgent needs."
              onSave={(value) => {
                const newContent = { ...content };
                newContent.subscriptionSubtitle = value;
                updateContent(newContent);
              }}
              className="text-lg text-amber-700 max-w-2xl mx-auto"
              multiline
              maxLength={200}
            />
          </div>
          <div className="max-w-md mx-auto">
            <EmailSubscription />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;