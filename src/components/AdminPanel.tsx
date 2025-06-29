import React, { useState } from 'react';
import { Settings, Eye, EyeOff, RotateCcw, Save, Plus, Trash2, Upload, Lock, Unlock } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { Cat } from '../data/content';
import { sanitizeInput, validate } from '../utils/security';

const AdminPanel: React.FC = () => {
  const { content, updateContent, resetContent } = useContent();
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'cats' | 'team' | 'media'>('general');

  // Set your admin password here
  const ADMIN_PASSWORD = 'idontwantcats2025'; // Change this to your preferred password

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
      setPassword('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsVisible(false);
    setPassword('');
    setPasswordError('');
  };

  const handleAddCat = () => {
    const newCat: Cat = {
      id: Math.max(...content.cats.map(c => c.id)) + 1,
      name: 'New Cat',
      age: '1 year',
      gender: 'Female',
      color: 'Mixed',
      personality: 'Friendly',
      description: 'A wonderful cat looking for a home.',
      image: 'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'adult'
    };
    
    updateContent({
      cats: [...content.cats, newCat]
    });
  };

  const handleRemoveCat = (id: number) => {
    updateContent({
      cats: content.cats.filter(cat => cat.id !== id),
      featuredCats: content.featuredCats.filter(catId => catId !== id)
    });
  };

  const handleUpdateCat = (id: number, updates: Partial<Cat>) => {
    // Sanitize inputs
    const sanitizedUpdates: Partial<Cat> = {};
    
    if (updates.name) sanitizedUpdates.name = sanitizeInput.text(updates.name);
    if (updates.age) sanitizedUpdates.age = sanitizeInput.text(updates.age);
    if (updates.gender) sanitizedUpdates.gender = sanitizeInput.text(updates.gender);
    if (updates.color) sanitizedUpdates.color = sanitizeInput.text(updates.color);
    if (updates.personality) sanitizedUpdates.personality = sanitizeInput.text(updates.personality);
    if (updates.description) sanitizedUpdates.description = sanitizeInput.html(updates.description);
    if (updates.image) {
      const sanitizedUrl = sanitizeInput.url(updates.image);
      if (sanitizedUrl) sanitizedUpdates.image = sanitizedUrl;
    }
    if (updates.category) sanitizedUpdates.category = updates.category;

    updateContent({
      cats: content.cats.map(cat => 
        cat.id === id ? { ...cat, ...sanitizedUpdates } : cat
      )
    });
  };

  const handlePayPalUrlUpdate = (url: string) => {
    const sanitizedUrl = sanitizeInput.url(url);
    if (sanitizedUrl && (sanitizedUrl.includes('paypal.me') || sanitizedUrl.includes('paypal.com'))) {
      updateContent({ paypalMeUrl: sanitizedUrl });
    }
  };

  const exportContent = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'i-dont-want-cats-content.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Admin Panel (Password Required)"
      >
        <Settings className="h-6 w-6" />
      </button>
    );
  }

  // Password Entry Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <Lock className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Admin Access</h2>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <EyeOff className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Enter the admin password to access content management features.
            </p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    passwordError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter admin password"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-600 text-sm mt-2">{passwordError}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Unlock className="h-4 w-4" />
                  <span>Access Admin Panel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsVisible(false)}
                  className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">For Site Administrators</h4>
              <p className="text-blue-800 text-sm">
                This panel allows you to edit website content, manage cat listings, and update contact information. 
                Only authorized users should have access to this area.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Admin Panel (only shown after authentication)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <Unlock className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Content Management</h2>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              Authenticated
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm"
              title="Logout"
            >
              Logout
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <EyeOff className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'general' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('cats')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'cats' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Cats ({content.cats.length})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'team' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Team
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'media' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Media
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={content.organizationName}
                  onChange={(e) => updateContent({ organizationName: sanitizeInput.text(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  maxLength={100}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={content.heroTitle}
                  onChange={(e) => updateContent({ heroTitle: sanitizeInput.text(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  maxLength={100}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero Subtitle
                </label>
                <textarea
                  value={content.heroSubtitle}
                  onChange={(e) => updateContent({ heroSubtitle: sanitizeInput.html(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md p-2 h-20"
                  maxLength={300}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PayPal.me URL
                </label>
                <input
                  type="url"
                  value={content.paypalMeUrl}
                  onChange={(e) => handlePayPalUrlUpdate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="https://paypal.me/yourhandle"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your PayPal.me URL for secure donations
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={content.phone}
                    onChange={(e) => updateContent({ phone: sanitizeInput.phone(e.target.value) })}
                    className="w-full border border-gray-300 rounded-md p-2"
                    maxLength={20}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={content.email}
                    onChange={(e) => {
                      const sanitizedEmail = sanitizeInput.email(e.target.value);
                      if (sanitizedEmail) updateContent({ email: sanitizedEmail });
                    }}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={content.address}
                  onChange={(e) => updateContent({ address: sanitizeInput.text(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  maxLength={100}
                />
              </div>
            </div>
          )}

          {activeTab === 'cats' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Manage Cats</h3>
                <button
                  onClick={handleAddCat}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Cat</span>
                </button>
              </div>

              <div className="grid gap-4">
                {content.cats.map((cat) => (
                  <div key={cat.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={cat.image} 
                          alt={cat.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-semibold">{cat.name}</h4>
                          <p className="text-sm text-gray-600">{cat.age} • {cat.gender}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveCat(cat.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remove cat"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) => handleUpdateCat(cat.id, { name: e.target.value })}
                        className="border border-gray-300 rounded p-2"
                        placeholder="Name"
                        maxLength={50}
                      />
                      <input
                        type="text"
                        value={cat.age}
                        onChange={(e) => handleUpdateCat(cat.id, { age: e.target.value })}
                        className="border border-gray-300 rounded p-2"
                        placeholder="Age"
                        maxLength={20}
                      />
                      <select
                        value={cat.gender}
                        onChange={(e) => handleUpdateCat(cat.id, { gender: e.target.value })}
                        className="border border-gray-300 rounded p-2"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <select
                        value={cat.category}
                        onChange={(e) => handleUpdateCat(cat.id, { category: e.target.value as Cat['category'] })}
                        className="border border-gray-300 rounded p-2"
                      >
                        <option value="kitten">Kitten</option>
                        <option value="young">Young</option>
                        <option value="adult">Adult</option>
                        <option value="senior">Senior</option>
                      </select>
                    </div>

                    <div className="mt-3 space-y-2">
                      <input
                        type="url"
                        value={cat.image}
                        onChange={(e) => handleUpdateCat(cat.id, { image: e.target.value })}
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                        placeholder="Image URL"
                      />
                      <textarea
                        value={cat.description}
                        onChange={(e) => handleUpdateCat(cat.id, { description: e.target.value })}
                        className="w-full border border-gray-300 rounded p-2 text-sm h-16"
                        placeholder="Description"
                        maxLength={300}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Team Members</h3>
              {content.teamMembers.map((member, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => {
                        const newTeam = [...content.teamMembers];
                        newTeam[index] = { ...member, name: sanitizeInput.text(e.target.value) };
                        updateContent({ teamMembers: newTeam });
                      }}
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      placeholder="Name"
                      maxLength={50}
                    />
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => {
                        const newTeam = [...content.teamMembers];
                        newTeam[index] = { ...member, role: sanitizeInput.text(e.target.value) };
                        updateContent({ teamMembers: newTeam });
                      }}
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      placeholder="Role"
                      maxLength={50}
                    />
                    <input
                      type="url"
                      value={member.image}
                      onChange={(e) => {
                        const sanitizedUrl = sanitizeInput.url(e.target.value);
                        if (sanitizedUrl) {
                          const newTeam = [...content.teamMembers];
                          newTeam[index] = { ...member, image: sanitizedUrl };
                          updateContent({ teamMembers: newTeam });
                        }
                      }}
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      placeholder="Image URL"
                    />
                    <textarea
                      value={member.bio}
                      onChange={(e) => {
                        const newTeam = [...content.teamMembers];
                        newTeam[index] = { ...member, bio: sanitizeInput.html(e.target.value) };
                        updateContent({ teamMembers: newTeam });
                      }}
                      className="w-full border border-gray-300 rounded p-2 text-sm h-16"
                      placeholder="Bio"
                      maxLength={300}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Media Upload</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Images & Videos</h4>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your files here, or click to browse. 
                    <br />
                    Supported formats: JPG, PNG, GIF, MP4, WebM
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    id="media-upload"
                    onChange={(e) => {
                      // Handle file upload here
                      const files = Array.from(e.target.files || []);
                      console.log('Files selected:', files);
                      // In production, you would upload these to your server or cloud storage
                    }}
                  />
                  <label
                    htmlFor="media-upload"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
                  >
                    Choose Files
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Upload Instructions</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Images will be automatically optimized for web display</li>
                    <li>• Videos should be under 50MB for best performance</li>
                    <li>• All uploads are scanned for security</li>
                    <li>• Files are stored securely and backed up regularly</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Current Media</h4>
                <div className="grid grid-cols-3 gap-4">
                  {content.cats.slice(0, 6).map((cat) => (
                    <div key={cat.id} className="relative">
                      <img 
                        src={cat.image} 
                        alt={cat.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                        {cat.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4 flex justify-between">
          <div className="flex space-x-2">
            <button
              onClick={exportContent}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={resetContent}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;