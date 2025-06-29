import React from 'react';
import { Heart, Users, Award, MapPin, Clock, Phone } from 'lucide-react';
import SecureDonationButton from '../components/SecureDonationButton';
import EditableText from '../components/EditableText';
import EditableImage from '../components/EditableImage';
import { useContent } from '../hooks/useContent';

const About = () => {
  const { content, updateContent } = useContent();

  const values = [
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'We provide loving care to every cat that comes through our doors, ensuring they feel safe and loved.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'We work closely with our community to educate about responsible pet ownership and reduce stray populations.'
    },
    {
      icon: Award,
      title: 'Quality Matches',
      description: 'We take time to match each cat with the perfect family, ensuring long-term happiness for both.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-100 to-orange-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <EditableText
              value={`About ${content.organizationName}`}
              onSave={(value) => {
                // Extract organization name from the title
                const name = value.replace('About ', '');
                updateContent({ organizationName: name });
              }}
              className="text-4xl md:text-5xl font-bold mb-6 text-amber-900"
              as="h1"
              maxLength={100}
            />
            <p className="text-xl text-amber-800 max-w-3xl mx-auto mb-8">
              We're a dedicated team of volunteers committed to rescuing stray cats and finding them loving homes. 
              Our story began with one rescued cat and has grown into a community-wide mission.
            </p>
            <SecureDonationButton size="lg" />
          </div>
        </div>
      </section>

      {/* Personal Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-6">About Us</h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p className="mb-6">
                  Well, if you haven't guessed already I'm stuck with a lot of cats and - I don't want cats. 
                  All the stories are on my blog - <a href="https://idontwantcats.blogspot.com" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-900 underline">idontwantcats.blogspot.com</a> in case you missed it.
                </p>
                <p className="mb-6">
                  What can I add here? I fell into this situation I suppose because I do love animals. 
                  There is a difference between loving them and wanting them as what feels like a full time job.
                </p>
                <p className="mb-6">
                  Each cat deserves a forever home and I have asked for Donations until that happens and does not happen again! 
                  If you can't tell the love that has been put into these cats by the stories then you must not be very receptive or have a heart of stone.
                </p>
                <p className="mb-6 font-medium text-amber-800">
                  Enjoy the stories you are most welcome and if you can help in one way or another. Peace be the journey.
                </p>
              </div>
            </div>
            <div className="relative">
              <EditableImage
                src="https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Cats being cared for"
                onSave={(src) => {
                  // Could store this in content if needed
                  console.log('About story image updated:', src);
                }}
                aspectRatio="landscape"
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Our Values</h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">
              These core values guide everything we do and shape how we approach cat rescue and adoption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow border border-amber-200">
                <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">{value.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;