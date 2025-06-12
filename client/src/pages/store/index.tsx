import React, { useState } from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'KC' | 'gems';
  category: 'merch' | 'cards' | 'membership' | 'avatar' | 'skins' | 'effects' | 'songs';
  rarity?: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  image: string;
  screenshots?: string[];
  discount?: number;
  limited?: boolean;
  timeLeft?: string;
  owned?: boolean;
  featured?: boolean;
  new?: boolean;
  popularTags?: string[];
  rating?: number;
  reviews?: number;
}

interface StoreProps {
  onBack: () => void;
}

const Store: React.FC<StoreProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'featured' | 'new' | 'merch' | 'cards' | 'membership' | 'avatar' | 'skins' | 'effects' | 'songs'>('featured');
  const [cart, setCart] = useState<string[]>([]);
  const [userCurrency] = useState({ keycoins: 15420, gems: 847, usd: 50.00 });
  const [searchQuery, setSearchQuery] = useState('');

  const storeItems: StoreItem[] = [
    // Featured Banner Items
    {
      id: 'championship_pass',
      name: 'Season 2 Championship Pass',
      description: 'Unlock 100+ exclusive rewards including legendary skins, effects, and rare card packs. Complete challenges to earn XP and climb the reward tiers.',
      price: 19.99,
      currency: 'USD',
      category: 'membership',
      image: 'https://picsum.photos/800/400?random=1',
      screenshots: ['https://picsum.photos/600/400?random=101', 'https://picsum.photos/600/400?random=102'],
      featured: true,
      new: true,
      popularTags: ['Battle Pass', 'Rewards', 'Exclusive'],
      rating: 4.8,
      reviews: 2847
    },
    {
      id: 'neon_dreams_pack',
      name: 'Neon Dreams Ultimate Pack',
      description: 'Complete collection featuring cyberpunk-themed skins, effects, and music. Transform your game into a neon-soaked digital paradise.',
      price: 24.99,
      currency: 'USD',
      category: 'skins',
      image: 'https://picsum.photos/800/400?random=2',
      screenshots: ['https://picsum.photos/600/400?random=103', 'https://picsum.photos/600/400?random=104'],
      featured: true,
      discount: 30,
      popularTags: ['Cyberpunk', 'Complete Pack', 'Popular'],
      rating: 4.9,
      reviews: 1923
    },

    // Merchandise
    {
      id: 'hoodie_championship',
      name: 'KeyJam Championship Hoodie 2024',
      description: 'Official tournament hoodie worn by pro players. Premium cotton blend with embroidered team logos.',
      price: 59.99,
      currency: 'USD',
      category: 'merch',
      image: 'https://picsum.photos/800/400?random=3',
      screenshots: ['https://picsum.photos/600/400?random=105'],
      popularTags: ['Official', 'Tournament', 'Clothing'],
      rating: 4.7,
      reviews: 456
    },
    {
      id: 'mechanical_keyboard',
      name: 'KeyJam Pro Mechanical Keyboard',
      description: 'Custom mechanical keyboard designed for rhythm games. Cherry MX switches with RGB backlighting.',
      price: 149.99,
      currency: 'USD',
      category: 'merch',
      image: 'https://picsum.photos/800/400?random=4',
      screenshots: ['https://picsum.photos/600/400?random=106', 'https://picsum.photos/600/400?random=107'],
      popularTags: ['Hardware', 'Pro Gear', 'RGB'],
      rating: 4.9,
      reviews: 789,
      new: true
    },
    {
      id: 'gaming_chair',
      name: 'KeyJam Pro Gaming Chair',
      description: 'Ergonomic gaming chair with lumbar support and RGB lighting. Perfect for long gaming sessions.',
      price: 299.99,
      currency: 'USD',
      category: 'merch',
      image: 'https://picsum.photos/800/400?random=25',
      popularTags: ['Chair', 'Ergonomic', 'Pro'],
      rating: 4.6,
      reviews: 234
    },
    {
      id: 'mousepad_xl',
      name: 'KeyJam XL Gaming Mousepad',
      description: 'Extra large mousepad with smooth surface and anti-slip base. Features official KeyJam artwork.',
      price: 29.99,
      currency: 'USD',
      category: 'merch',
      image: 'https://picsum.photos/800/400?random=26',
      popularTags: ['Mousepad', 'XL', 'Official'],
      rating: 4.5,
      reviews: 567
    },

    // Digital Content
    {
      id: 'legendary_card_box',
      name: 'Legendary Card Collection Box',
      description: '50 card pack with guaranteed legendary drops. Includes exclusive holographic cards and rare variants.',
      price: 199,
      currency: 'gems',
      category: 'cards',
      image: 'https://picsum.photos/800/400?random=5',
      rarity: 'legendary',
      popularTags: ['Cards', 'Legendary', 'Collection'],
      rating: 4.6,
      reviews: 1234
    },
    {
      id: 'pro_membership_yearly',
      name: 'KeyJam Pro - Annual Subscription',
      description: 'Full year of premium features: exclusive tournaments, early access, unlimited cloud saves, and monthly bonus content.',
      price: 79.99,
      currency: 'USD',
      category: 'membership',
      image: 'https://picsum.photos/800/400?random=6',
      discount: 33,
      popularTags: ['Subscription', 'Premium', 'Best Value'],
      rating: 4.8,
      reviews: 3456
    },
    {
      id: 'epic_card_pack',
      name: 'Epic Tournament Card Pack',
      description: '25 cards with guaranteed epic rarity. Features tournament exclusive designs and foil variants.',
      price: 89,
      currency: 'gems',
      category: 'cards',
      image: 'https://picsum.photos/800/400?random=27',
      rarity: 'epic',
      popularTags: ['Cards', 'Epic', 'Tournament'],
      rating: 4.4,
      reviews: 892
    },
    {
      id: 'rare_card_starter',
      name: 'Rare Card Starter Pack',
      description: '15 cards perfect for beginners. Guaranteed rare drops with balanced gameplay mechanics.',
      price: 1200,
      currency: 'KC',
      category: 'cards',
      image: 'https://picsum.photos/800/400?random=28',
      rarity: 'rare',
      popularTags: ['Cards', 'Starter', 'Beginner'],
      rating: 4.3,
      reviews: 445
    },

    // Cosmetics
    {
      id: 'dragon_fire_skin',
      name: 'Dragon Fire Interface Theme',
      description: 'Epic dragon-themed interface with animated fire effects, custom sounds, and particle systems.',
      price: 15.99,
      currency: 'USD',
      category: 'skins',
      image: 'https://picsum.photos/800/400?random=7',
      rarity: 'epic',
      popularTags: ['Theme', 'Animated', 'Fantasy'],
      rating: 4.5,
      reviews: 567
    },
    {
      id: 'lightning_effects',
      name: 'Lightning Strike Effect Pack',
      description: 'Electrifying hit effects with screen-shaking lightning bolts and electric particle trails.',
      price: 899,
      currency: 'KC',
      category: 'effects',
      image: 'https://picsum.photos/800/400?random=8',
      rarity: 'rare',
      popularTags: ['Effects', 'Lightning', 'Impact'],
      rating: 4.4,
      reviews: 892
    },
    {
      id: 'space_theme',
      name: 'Galactic Explorer Theme',
      description: 'Journey through space with this cosmic interface theme featuring planets, stars, and nebulas.',
      price: 18.99,
      currency: 'USD',
      category: 'skins',
      image: 'https://picsum.photos/800/400?random=29',
      rarity: 'epic',
      popularTags: ['Space', 'Cosmic', 'Animated'],
      rating: 4.7,
      reviews: 723
    },
    {
      id: 'rainbow_effects',
      name: 'Rainbow Cascade Effects',
      description: 'Colorful rainbow effects that cascade across the screen with every perfect hit.',
      price: 1299,
      currency: 'KC',
      category: 'effects',
      image: 'https://picsum.photos/800/400?random=30',
      rarity: 'rare',
      popularTags: ['Rainbow', 'Colorful', 'Cascade'],
      rating: 4.6,
      reviews: 634
    },

    // Music Packs
    {
      id: 'edm_festival_pack',
      name: 'EDM Festival Collection Vol. 3',
      description: '12 high-energy electronic tracks from top DJs. Includes expert-level charts and remix variations.',
      price: 12.99,
      currency: 'USD',
      category: 'songs',
      image: 'https://picsum.photos/800/400?random=9',
      new: true,
      popularTags: ['Music', 'EDM', 'Festival'],
      rating: 4.7,
      reviews: 2341
    },
    {
      id: 'classical_remix_pack',
      name: 'Classical Remixed',
      description: 'Modern electronic remixes of classical masterpieces. 8 tracks spanning different difficulty levels.',
      price: 9.99,
      currency: 'USD',
      category: 'songs',
      image: 'https://picsum.photos/800/400?random=31',
      popularTags: ['Classical', 'Remix', 'Culture'],
      rating: 4.5,
      reviews: 1567
    }
  ];

  const categories = [
    { id: 'featured', name: 'Featured', icon: '🌟' },
    { id: 'new', name: 'New Releases', icon: '🆕' },
    { id: 'all', name: 'Browse All', icon: '🎮' },
    { id: 'membership', name: 'Memberships', icon: '👑' },
    { id: 'skins', name: 'Themes & Skins', icon: '🎨' },
    { id: 'effects', name: 'Visual Effects', icon: '✨' },
    { id: 'songs', name: 'Music Packs', icon: '🎵' },
    { id: 'cards', name: 'Card Packs', icon: '🎴' },
    { id: 'merch', name: 'Merchandise', icon: '🛍️' },
    { id: 'avatar', name: 'Profile Items', icon: '👤' }
  ];

  const featuredItems = storeItems.filter(item => item.featured);
  const newItems = storeItems.filter(item => item.new);

  const getFilteredItems = () => {
    let filtered = storeItems;
    
    if (activeCategory === 'featured') {
      filtered = featuredItems;
    } else if (activeCategory === 'new') {
      filtered = newItems;
    } else if (activeCategory !== 'all') {
      filtered = storeItems.filter(item => item.category === activeCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.popularTags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'KC': return '🪙';
      case 'gems': return '💎';
      default: return '$';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    const remaining = 5 - Math.ceil(rating);
    for (let i = 0; i < remaining; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-600">☆</span>);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CenteredContainer maxWidth="xl" accountForLeftNav={true}>
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
            {/* Store Header */}
            <div className="p-4 border-b border-slate-700">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 text-sm"
              >
                ← Back to Game
              </button>
              <h1 className="text-xl font-bold text-white">KEYJAM STORE</h1>
              <div className="text-sm text-gray-400">Discover new content</div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-slate-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search store..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>

            {/* Currency */}
            <div className="p-4 border-b border-slate-700">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Wallet</span>
                  <button className="text-blue-400 text-sm hover:text-blue-300">+ Add Funds</button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">$</span>
                  <span className="text-white font-mono">${userCurrency.usd.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">🪙</span>
                  <span className="text-white font-mono">{userCurrency.keycoins.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">💎</span>
                  <span className="text-white font-mono">{userCurrency.gems.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="text-gray-400 text-xs font-bold uppercase mb-3">Categories</div>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-colors ${
                        activeCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-700">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium transition-colors">
                  🛒 Cart ({cart.length}) - Checkout
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Featured Banner */}
            {activeCategory === 'featured' && featuredItems.length > 0 && (
              <div className="relative h-80 bg-gradient-to-r from-blue-900 to-purple-900 overflow-hidden flex-shrink-0">
                <img
                  src={featuredItems[0].image}
                  alt={featuredItems[0].name}
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
                <div className="relative h-full flex items-center">
                  <div className="max-w-2xl p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">FEATURED</span>
                      {featuredItems[0].new && (
                        <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">NEW</span>
                      )}
                      {featuredItems[0].discount && (
                        <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
                          -{featuredItems[0].discount}% OFF
                        </span>
                      )}
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">{featuredItems[0].name}</h2>
                    <p className="text-gray-200 text-lg mb-6 leading-relaxed">{featuredItems[0].description}</p>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-green-400">
                        {getCurrencyIcon(featuredItems[0].currency)}{featuredItems[0].price}
                      </div>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded font-bold text-lg transition-colors">
                        Purchase Now
                      </button>
                      <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded font-medium transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Header */}
            <div className="p-6 border-b border-slate-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {activeCategory === 'featured' && 'Featured Items'}
                    {activeCategory === 'new' && 'New Releases'}
                    {activeCategory === 'all' && 'Browse All Items'}
                    {activeCategory !== 'featured' && activeCategory !== 'new' && activeCategory !== 'all' && 
                      categories.find(cat => cat.id === activeCategory)?.name
                    }
                  </h2>
                  <p className="text-gray-400">
                    {getFilteredItems().length} item{getFilteredItems().length !== 1 ? 's' : ''} available
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Sort by:</span>
                  <select className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm">
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Most Popular</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Items Grid - This is now properly scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="grid grid-cols-4 gap-6">
                  {getFilteredItems().map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-750 transition-all duration-200 group cursor-pointer"
                    >
                      {/* Item Image */}
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        
                        {/* Overlay Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {item.discount && (
                            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                              -{item.discount}%
                            </span>
                          )}
                          {item.new && (
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold">
                              NEW
                            </span>
                          )}
                          {item.owned && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">
                              OWNED
                            </span>
                          )}
                        </div>

                        {/* Quick Action Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="flex gap-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                              View Details
                            </button>
                            {!item.owned && (
                              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="p-4">
                        <h3 className="text-white font-bold text-base mb-2 group-hover:text-blue-400 transition-colors truncate">
                          {item.name}
                        </h3>
                        
                        {/* Tags */}
                        {item.popularTags && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.popularTags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="bg-slate-700 text-gray-300 text-xs px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Rating */}
                        {item.rating && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex text-sm">
                              {renderStars(item.rating)}
                            </div>
                            <span className="text-gray-400 text-xs">
                              ({item.reviews?.toLocaleString()})
                            </span>
                          </div>
                        )}

                        {/* Price and Action */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-green-400 font-bold text-lg">
                              {getCurrencyIcon(item.currency)}{item.price}
                            </span>
                            {item.discount && (
                              <span className="text-gray-500 text-sm line-through">
                                {getCurrencyIcon(item.currency)}{Math.round(item.price / (1 - item.discount / 100))}
                              </span>
                            )}
                          </div>
                          
                          {item.owned ? (
                            <span className="text-blue-400 text-xs font-medium">✓ Owned</span>
                          ) : (
                            <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-xs font-medium transition-colors">
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {getFilteredItems().length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
                    <p className="text-gray-400">
                      {searchQuery ? 'Try adjusting your search terms' : 'No items in this category yet'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CenteredContainer>
    </div>
  );
};

export default Store;