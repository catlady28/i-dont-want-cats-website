import React, { useState } from 'react';
import { Filter, Heart, Gavel, Clock, DollarSign, TrendingUp, User, Calendar, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import SecureDonationButton from '../components/SecureDonationButton';
import EditableText from '../components/EditableText';
import EditableImage from '../components/EditableImage';
import { useContent } from '../hooks/useContent';
import { sanitizeInput, validate, formRateLimiter } from '../utils/security';

interface AuctionItem {
  id: number;
  lotNumber: string;
  title: string;
  description: string;
  image: string;
  startingBid: number;
  currentBid: number;
  bidCount: number;
  endTime: string;
  category: 'art' | 'services' | 'experiences' | 'items';
}

interface BidFormData {
  name: string;
  email: string;
  phone: string;
  bidAmount: string;
}

const Cats = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedAuctionCategory, setSelectedAuctionCategory] = useState('all');
  const [bidAmounts, setBidAmounts] = useState<Record<number, string>>({});
  const [showBidForm, setShowBidForm] = useState<number | null>(null);
  const [bidFormData, setBidFormData] = useState<BidFormData>({
    name: '',
    email: '',
    phone: '',
    bidAmount: ''
  });
  const [bidStatus, setBidStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bidMessage, setBidMessage] = useState('');
  const [bidErrors, setBidErrors] = useState<Record<string, string>>({});
  const { content, updateContent } = useContent();

  // Sample auction items - in production, these would come from your content management
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>([
    {
      id: 1,
      lotNumber: 'LOT001',
      title: 'Custom Pet Portrait',
      description: 'Beautiful hand-painted portrait of your beloved pet by local artist Sarah Mitchell. 16x20 canvas, ready to frame.',
      image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400',
      startingBid: 50,
      currentBid: 125,
      bidCount: 8,
      endTime: '2025-02-15T18:00:00',
      category: 'art'
    },
    {
      id: 2,
      lotNumber: 'LOT002',
      title: 'Professional Pet Photography Session',
      description: '2-hour professional photo session for your pets with 20 edited digital photos. Perfect for capturing precious memories.',
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      startingBid: 100,
      currentBid: 180,
      bidCount: 12,
      endTime: '2025-02-20T20:00:00',
      category: 'services'
    },
    {
      id: 3,
      lotNumber: 'LOT003',
      title: 'Handmade Cat Bed Set',
      description: 'Luxury handmade cat bed with matching blanket and toy. Made from organic cotton and filled with eco-friendly stuffing.',
      image: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400',
      startingBid: 30,
      currentBid: 75,
      bidCount: 6,
      endTime: '2025-02-18T16:00:00',
      category: 'items'
    }
  ]);

  const filters = [
    { id: 'all', label: 'All Cats' },
    { id: 'kitten', label: 'Kittens' },
    { id: 'young', label: 'Young (1-2 years)' },
    { id: 'adult', label: 'Adult (2-5 years)' },
    { id: 'senior', label: 'Senior (5+ years)' }
  ];

  const auctionCategories = [
    { id: 'all', label: 'All Items' },
    { id: 'art', label: 'Art & Portraits' },
    { id: 'services', label: 'Services' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'items', label: 'Physical Items' }
  ];

  const filteredCats = selectedFilter === 'all' 
    ? content.cats 
    : content.cats.filter(cat => cat.category === selectedFilter);

  const filteredAuctionItems = selectedAuctionCategory === 'all'
    ? auctionItems
    : auctionItems.filter(item => item.category === selectedAuctionCategory);

  const updateCat = (id: number, updates: any) => {
    const updatedCats = content.cats.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    );
    updateContent({ cats: updatedCats });
  };

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Auction Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const validateBidForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validate.required(bidFormData.name)) {
      newErrors.name = 'Name is required';
    } else if (!validate.maxLength(bidFormData.name, 50)) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    if (!validate.required(bidFormData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validate.email(bidFormData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (bidFormData.phone && !validate.phone(bidFormData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    const bidAmount = parseFloat(bidFormData.bidAmount);
    const item = auctionItems.find(i => i.id === showBidForm);
    
    if (!bidFormData.bidAmount || isNaN(bidAmount)) {
      newErrors.bidAmount = 'Bid amount is required';
    } else if (item && bidAmount <= item.currentBid) {
      newErrors.bidAmount = `Bid must be higher than current bid of $${item.currentBid}`;
    }

    setBidErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBidFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateBidForm()) {
      return;
    }

    const item = auctionItems.find(i => i.id === showBidForm);
    if (!item) return;

    // Rate limiting check
    const clientId = `auction_bid_${bidFormData.email}`;
    if (!formRateLimiter.isAllowed(clientId)) {
      const remainingTime = formRateLimiter.getRemainingTime(clientId);
      setBidStatus('error');
      setBidMessage(`Too many bid attempts. Please try again in ${Math.ceil(remainingTime / 60)} minutes.`);
      return;
    }

    setBidStatus('loading');
    setBidMessage('');
    setBidErrors({});

    try {
      // Sanitize all form data
      const sanitizedData = {
        bidderName: sanitizeInput.text(bidFormData.name),
        bidderEmail: sanitizeInput.email(bidFormData.email),
        bidderPhone: sanitizeInput.phone(bidFormData.phone),
        bidAmount: parseFloat(bidFormData.bidAmount),
        lotNumber: item.lotNumber,
        itemTitle: item.title,
        previousBid: item.currentBid,
        timestamp: new Date().toISOString(),
        recipient: 'richardmorris34@proton.me'
      };

      // Simulate API call - replace with your actual email service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, you would send this to your email service:
      // const response = await fetch('/api/auction-bid', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-Requested-With': 'XMLHttpRequest'
      //   },
      //   body: JSON.stringify(sanitizedData)
      // });

      // Update auction item with new bid
      setAuctionItems(prev => prev.map(auctionItem => 
        auctionItem.id === item.id 
          ? { ...auctionItem, currentBid: sanitizedData.bidAmount, bidCount: auctionItem.bidCount + 1 }
          : auctionItem
      ));

      // Store bid locally (in production, this would be handled server-side)
      const bids = JSON.parse(localStorage.getItem('auction_bids') || '[]');
      bids.push(sanitizedData);
      localStorage.setItem('auction_bids', JSON.stringify(bids));

      setBidStatus('success');
      setBidMessage(`Bid submitted successfully! Richard will receive your bid details at richardmorris34@proton.me. You are now the highest bidder at $${sanitizedData.bidAmount}!`);
      
      // Reset form
      setBidFormData({ name: '', email: '', phone: '', bidAmount: '' });
      
      // Close form after 3 seconds
      setTimeout(() => {
        setShowBidForm(null);
        setBidStatus('idle');
        setBidMessage('');
      }, 3000);

    } catch (error) {
      setBidStatus('error');
      setBidMessage('Sorry, there was an error submitting your bid. Please try again later or contact us directly at richardmorris34@proton.me');
      console.error('Bid submission error:', error);
    }
  };

  const handleQuickBid = (itemId: number) => {
    const item = auctionItems.find(i => i.id === itemId);
    if (!item) return;

    setBidFormData(prev => ({
      ...prev,
      bidAmount: (item.currentBid + 5).toString() // Suggest $5 increment
    }));
    setShowBidForm(itemId);
    setBidStatus('idle');
    setBidMessage('');
    setBidErrors({});
  };

  const handleInputChange = (field: keyof BidFormData, value: string) => {
    setBidFormData(prev => ({ ...prev, [field]: value }));
    if (bidErrors[field]) {
      setBidErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="py-8">
      {/* Header */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Available Cats & Fundraising Auction</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-8">
            Browse our wonderful cats looking for homes and bid on special items to support our rescue mission.
          </p>
          <SecureDonationButton size="lg" variant="secondary" />
        </div>
      </section>

      {/* Auction Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Gavel className="h-8 w-8 text-amber-700" />
              <h2 className="text-3xl md:text-4xl font-bold text-amber-900">Fundraising Auction</h2>
            </div>
            <p className="text-xl text-amber-800 max-w-3xl mx-auto mb-8">
              Bid on unique items and experiences to support our cat rescue mission. All proceeds go directly to caring for our cats.
            </p>
            
            {/* Auction Filters */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Filter className="h-5 w-5 text-amber-700" />
              <span className="font-medium text-amber-800">Filter auction items:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {auctionCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedAuctionCategory(category.id)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedAuctionCategory === category.id
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-amber-800 hover:bg-amber-100 border border-amber-300'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auction Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredAuctionItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-200">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {item.lotNumber}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-1 text-amber-700">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{formatTimeRemaining(item.endTime)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-amber-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-amber-700">Starting Bid:</span>
                      <span className="font-medium text-amber-900">${item.startingBid}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-amber-700">Current Bid:</span>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-bold text-green-700 text-lg">${item.currentBid}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-amber-700">Total Bids:</span>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4 text-amber-600" />
                        <span className="font-medium text-amber-900">{item.bidCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-amber-100 pt-4">
                    <button
                      onClick={() => handleQuickBid(item.id)}
                      className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span>Place Bid</span>
                    </button>
                    <p className="text-xs text-amber-600 mt-2 text-center">
                      Minimum bid: ${item.currentBid + 1}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAuctionItems.length === 0 && (
            <div className="text-center py-8">
              <Gavel className="h-12 w-12 text-amber-300 mx-auto mb-4" />
              <p className="text-amber-700 text-lg">No auction items found in this category.</p>
            </div>
          )}

          {/* Auction Info */}
          <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="h-6 w-6 text-amber-600" />
              <h3 className="text-xl font-bold text-amber-900">Auction Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">How to Bid:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Click "Place Bid" on any item you're interested in</li>
                  <li>• Fill out the bid form with your contact details</li>
                  <li>• Enter your bid amount (must be higher than current bid)</li>
                  <li>• Your bid details will be sent to richardmorris34@proton.me</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Important Notes:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• All proceeds support our cat rescue mission</li>
                  <li>• Winners will be contacted via email when auction ends</li>
                  <li>• Payment due within 48 hours of auction end</li>
                  <li>• Items can be picked up or shipped</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bid Form Modal */}
      {showBidForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Gavel className="h-6 w-6 text-amber-600" />
                  <h3 className="text-xl font-bold text-amber-900">Place Your Bid</h3>
                </div>
                <button
                  onClick={() => setShowBidForm(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              {(() => {
                const item = auctionItems.find(i => i.id === showBidForm);
                return item ? (
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                      <div>
                        <h4 className="font-semibold text-amber-900">{item.lotNumber}</h4>
                        <p className="text-sm text-gray-600">{item.title}</p>
                        <p className="text-sm font-medium text-green-700">Current bid: ${item.currentBid}</p>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              <form onSubmit={handleBidFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="bidderName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="bidderName"
                    value={bidFormData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                      bidErrors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={bidStatus === 'loading'}
                    maxLength={50}
                    autoComplete="name"
                  />
                  {bidErrors.name && <p className="text-red-600 text-xs mt-1">{bidErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="bidderEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="bidderEmail"
                    value={bidFormData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                      bidErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={bidStatus === 'loading'}
                    maxLength={254}
                    autoComplete="email"
                  />
                  {bidErrors.email && <p className="text-red-600 text-xs mt-1">{bidErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="bidderPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="bidderPhone"
                    value={bidFormData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                      bidErrors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={bidStatus === 'loading'}
                    maxLength={20}
                    autoComplete="tel"
                  />
                  {bidErrors.phone && <p className="text-red-600 text-xs mt-1">{bidErrors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Bid Amount ($) *
                  </label>
                  <input
                    type="number"
                    id="bidAmount"
                    value={bidFormData.bidAmount}
                    onChange={(e) => handleInputChange('bidAmount', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                      bidErrors.bidAmount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={bidStatus === 'loading'}
                    min={(() => {
                      const item = auctionItems.find(i => i.id === showBidForm);
                      return item ? item.currentBid + 1 : 1;
                    })()}
                    step="1"
                  />
                  {bidErrors.bidAmount && <p className="text-red-600 text-xs mt-1">{bidErrors.bidAmount}</p>}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-amber-800 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>Your bid details will be sent to richardmorris34@proton.me</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bidStatus === 'loading' || bidStatus === 'success'}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    bidStatus === 'success'
                      ? 'bg-green-600 text-white cursor-default'
                      : bidStatus === 'loading'
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
                >
                  {bidStatus === 'loading' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting Bid...</span>
                    </>
                  ) : bidStatus === 'success' ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Bid Submitted!</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4" />
                      <span>Submit Bid</span>
                    </>
                  )}
                </button>

                {bidMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    bidStatus === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {bidStatus === 'success' ? (
                        <CheckCircle className="h-4 w-4 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mt-0.5" />
                      )}
                      <span>{bidMessage}</span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Cats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Available Cats for Adoption</h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">
              Meet our wonderful cats who are ready to find their forever homes.
            </p>
          </div>

          {/* Cat Filters */}
          <div className="flex items-center space-x-4 mb-8">
            <Filter className="h-5 w-5 text-amber-700" />
            <span className="font-medium text-amber-800">Filter by age:</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-orange-100 text-amber-800 hover:bg-orange-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Cats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCats.map((cat) => (
              <div key={cat.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-orange-200">
                <div className="relative">
                  <EditableImage
                    src={cat.image}
                    alt={cat.name}
                    onSave={(image) => updateCat(cat.id, { image })}
                    aspectRatio="square"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <EditableText
                      value={cat.name}
                      onSave={(name) => updateCat(cat.id, { name })}
                      className="text-xl font-bold text-amber-900"
                      as="h3"
                      maxLength={50}
                      required
                    />
                    <EditableText
                      value={cat.age}
                      onSave={(age) => updateCat(cat.id, { age })}
                      className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full"
                      maxLength={20}
                    />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Gender:</span>
                      <EditableText
                        value={cat.gender}
                        onSave={(gender) => updateCat(cat.id, { gender })}
                        className="font-medium text-amber-900"
                        maxLength={10}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Color:</span>
                      <EditableText
                        value={cat.color}
                        onSave={(color) => updateCat(cat.id, { color })}
                        className="font-medium text-amber-900"
                        maxLength={30}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Personality:</span>
                      <EditableText
                        value={cat.personality}
                        onSave={(personality) => updateCat(cat.id, { personality })}
                        className="font-medium text-amber-900"
                        maxLength={50}
                      />
                    </div>
                  </div>
                  
                  <EditableText
                    value={cat.description}
                    onSave={(description) => updateCat(cat.id, { description })}
                    className="text-gray-600 text-sm mb-6 leading-relaxed"
                    multiline
                    maxLength={300}
                  />
                  
                  <div className="space-y-2">
                    <button className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium">
                      Schedule Meet & Greet
                    </button>
                    <button className="w-full bg-orange-100 text-amber-800 py-2 rounded-lg hover:bg-orange-200 transition-colors font-medium">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCats.length === 0 && (
            <div className="text-center py-12">
              <p className="text-amber-700 text-lg">No cats found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Adopt or Support Our Mission?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Contact us to learn more about adoption or continue bidding to support our rescue efforts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
              Contact Us
            </button>
            <SecureDonationButton size="lg" variant="secondary" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cats;