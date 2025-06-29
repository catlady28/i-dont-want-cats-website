export interface Cat {
  id: number;
  name: string;
  age: string;
  gender: string;
  color: string;
  personality: string;
  description: string;
  image: string;
  category: 'kitten' | 'young' | 'adult' | 'senior';
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface ContentData {
  siteTitle: string;
  siteDescription: string;
  organizationName: string;
  
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  
  // Home Page Messages
  homeMessages?: string[];
  blogPrompt?: string;
  blogLinkText?: string;
  subscriptionTitle?: string;
  subscriptionSubtitle?: string;
  
  // Contact Info
  phone: string;
  email: string;
  address: string;
  hours: string;
  
  // About Content
  aboutStory: string[];
  missionStatement: string;
  
  // Stats
  stats: Stat[];
  
  // Cats
  cats: Cat[];
  
  // Team
  teamMembers: TeamMember[];
  
  // Featured content
  featuredCats: number[]; // IDs of cats to feature on homepage
  
  // Payment
  paypalMeUrl: string;
  
  // Footer
  footerDescription?: string;
  donationMessage?: string;
  copyrightText?: string;
  
  // Contact Page
  contactTitle?: string;
  contactSubtitle?: string;
  contactImage?: string;
  helpTitle?: string;
  helpSubtitle?: string;
  quickActions?: any[];
}

// Default content - this would typically come from a database or CMS
export const defaultContent: ContentData = {
  siteTitle: "I Don't Want Cats - Find Homes for Stray Cats",
  siteDescription: "Help us find loving homes for stray cats. Browse available cats for adoption and support our rescue mission through donations.",
  organizationName: "I Don't Want Cats",
  
  heroTitle: "Hi and welcome - no I don't want cats. Please help!",
  heroSubtitle: "You can go to my blog - idontwantcats.blogspot.com to read more cat stories and any updates. This site is to make contact easy and Donations easy. If you can take and give a cat a forever home we would be eternally grateful. If you can Donate to feed this menagerie I would at this time be even more grateful. The extra burden of growing kittens is too much to bare. With blessing and love thank you.",
  
  phone: "(555) 123-4567",
  email: "richardmorris34@proton.me",
  address: "123 Rescue Lane, Pet City, PC 12345",
  hours: "Open Mon-Sat 10am-6pm, Sun 12pm-4pm",
  
  aboutStory: [
    "I Don't Want Cats was founded in 2017 when our founder, Sarah Johnson, rescued a severely malnourished stray cat from her neighborhood. That single act of compassion sparked a movement that has since rescued over 500 cats and found homes for 450 of them.",
    "What started as one person's mission has grown into a network of dedicated volunteers, foster families, and supporters who share our vision of a world where every cat has a loving home.",
    "Today, we operate a full-service rescue organization with partnerships with local veterinarians, pet stores, and community organizations to maximize our impact and reach."
  ],
  
  missionStatement: "We rescue stray and abandoned cats, provide them with medical care, love, and attention, then find them the perfect forever homes. Every cat deserves a chance at happiness.",
  
  stats: [
    { label: "Cats Rescued", value: "500+" },
    { label: "Homes Found", value: "450+" },
    { label: "Volunteers", value: "75+" },
    { label: "Years of Service", value: "8" }
  ],
  
  cats: [
    {
      id: 1,
      name: 'Luna',
      age: '2 years',
      gender: 'Female',
      color: 'Gray & White',
      personality: 'Gentle, Cuddly',
      description: 'Luna is a sweet and gentle cat who loves to cuddle. She gets along well with other cats and would make a perfect companion.',
      image: 'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'adult'
    },
    {
      id: 2,
      name: 'Oliver',
      age: '1 year',
      gender: 'Male',
      color: 'Orange Tabby',
      personality: 'Playful, Energetic',
      description: 'Oliver is a playful young cat who loves toys and games. He\'s great with children and very social.',
      image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'young'
    },
    {
      id: 3,
      name: 'Bella',
      age: '3 years',
      gender: 'Female',
      color: 'Black',
      personality: 'Calm, Affectionate',
      description: 'Bella is a calm and affectionate cat who enjoys quiet moments and gentle pets. Perfect for a peaceful home.',
      image: 'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'adult'
    },
    {
      id: 4,
      name: 'Max',
      age: '4 months',
      gender: 'Male',
      color: 'Gray Tabby',
      personality: 'Curious, Playful',
      description: 'Max is a curious kitten who loves to explore. He\'s very social and would do well with other pets.',
      image: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'kitten'
    },
    {
      id: 5,
      name: 'Sophie',
      age: '5 years',
      gender: 'Female',
      color: 'Calico',
      personality: 'Independent, Loving',
      description: 'Sophie is an independent cat who shows her love in quiet ways. She enjoys her space but loves gentle attention.',
      image: 'https://images.pexels.com/photos/1276553/pexels-photo-1276553.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'senior'
    },
    {
      id: 6,
      name: 'Charlie',
      age: '6 months',
      gender: 'Male',
      color: 'Black & White',
      personality: 'Adventurous, Social',
      description: 'Charlie is an adventurous kitten who loves to climb and explore. He\'s very social and loves meeting new people.',
      image: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'kitten'
    }
  ],
  
  teamMembers: [
    {
      name: 'Sarah Johnson',
      role: 'Founder & Director',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Sarah started I Don\'t Want Cats after rescuing her first stray cat in 2017. Her passion for animal welfare drives our mission.'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Veterinary Consultant',
      image: 'https://images.pexels.com/photos/612608/pexels-photo-612608.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Dr. Chen provides medical care for all our rescue cats and ensures they receive the best treatment possible.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Adoption Coordinator',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Emily matches cats with their perfect families and manages our adoption process with care and attention.'
    }
  ],
  
  featuredCats: [1, 2, 3], // IDs of cats to show on homepage
  
  paypalMeUrl: "https://paypal.me/idontwantcats"
};