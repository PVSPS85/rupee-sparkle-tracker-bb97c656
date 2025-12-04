import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Search, ExternalLink, GraduationCap, TrendingUp, PiggyBank, Landmark, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Video {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  category: 'basics' | 'banking' | 'trading' | 'savings';
}

const categories = [
  { id: 'all', label: 'All', icon: GraduationCap },
  { id: 'basics', label: 'Basics', icon: GraduationCap },
  { id: 'banking', label: 'Banking', icon: Landmark },
  { id: 'trading', label: 'Trading', icon: TrendingUp },
  { id: 'savings', label: 'Savings', icon: PiggyBank },
];

const curatedVideos: Video[] = [
  {
    id: 'HQzoZfc3GwQ',
    title: 'Beginners Guide to Personal Finance',
    channel: 'Graham Stephan',
    thumbnail: 'https://img.youtube.com/vi/HQzoZfc3GwQ/maxresdefault.jpg',
    category: 'basics',
  },
  {
    id: 'p7HKvqRI_Bo',
    title: 'How The Stock Market Works',
    channel: 'ClearValue Tax',
    thumbnail: 'https://img.youtube.com/vi/p7HKvqRI_Bo/maxresdefault.jpg',
    category: 'trading',
  },
  {
    id: 'PHe0bXAIuk0',
    title: 'How The Economic Machine Works',
    channel: 'Ray Dalio',
    thumbnail: 'https://img.youtube.com/vi/PHe0bXAIuk0/maxresdefault.jpg',
    category: 'banking',
  },
  {
    id: '8YFSdgY5O_0',
    title: '50/30/20 Budget Rule Explained',
    channel: 'Two Cents',
    thumbnail: 'https://img.youtube.com/vi/8YFSdgY5O_0/maxresdefault.jpg',
    category: 'basics',
  },
  {
    id: 'jj1s6Yx-3M0',
    title: 'How to Save Money (7 Money Saving Tips)',
    channel: 'Practical Wisdom',
    thumbnail: 'https://img.youtube.com/vi/jj1s6Yx-3M0/maxresdefault.jpg',
    category: 'savings',
  },
  {
    id: 'Xn7KWR9EOGQ',
    title: 'Trading for Beginners - Full Course',
    channel: 'Rayner Teo',
    thumbnail: 'https://img.youtube.com/vi/Xn7KWR9EOGQ/maxresdefault.jpg',
    category: 'trading',
  },
  {
    id: 'qIw-yFC-HNU',
    title: 'How Banks Create Money',
    channel: 'Economics Explained',
    thumbnail: 'https://img.youtube.com/vi/qIw-yFC-HNU/maxresdefault.jpg',
    category: 'banking',
  },
  {
    id: 'eikbQPldhPY',
    title: 'Money Management Tips for Students',
    channel: 'Thomas Frank',
    thumbnail: 'https://img.youtube.com/vi/eikbQPldhPY/maxresdefault.jpg',
    category: 'savings',
  },
];

export const LearningHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const filteredVideos = curatedVideos.filter(video => {
    if (selectedCategory !== 'all' && video.category !== selectedCategory) return false;
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleYouTubeSearch = () => {
    if (searchQuery.trim()) {
      const query = encodeURIComponent(`${searchQuery} finance budget money`);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleYouTubeSearch();
    }
  };

  const handlePlayVideo = useCallback((videoId: string) => {
    setIsVideoLoading(true);
    setPlayingVideo(videoId);
  }, []);

  const handleCloseVideo = useCallback(() => {
    setPlayingVideo(null);
    setIsVideoLoading(false);
  }, []);

  const handleIframeLoad = useCallback(() => {
    setIsVideoLoading(false);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('video-scroll-container');
    if (container) {
      const scrollAmount = 320;
      const newPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  // Open video directly on YouTube as fallback
  const openOnYouTube = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    handleCloseVideo();
  };

  return (
    <Card className="glass-card border-border/50 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-display">Learning Hub</CardTitle>
              <p className="text-sm text-muted-foreground">Master your finances with expert videos</p>
            </div>
          </motion.div>
          
          {/* Search */}
          <motion.div 
            className="flex gap-2 w-full sm:w-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search videos..."
                className="pl-9 bg-muted/50 border-border/50"
              />
            </div>
            <Button 
              variant="neonOutline" 
              size="icon"
              onClick={handleYouTubeSearch}
              title="Search on YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* Category Filters */}
        <motion.div 
          className="flex gap-2 mt-4 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-lg shadow-neon-cyan/10'
                    : 'bg-muted/50 text-muted-foreground border border-transparent hover:border-border/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {category.label}
              </motion.button>
            );
          })}
        </motion.div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Video Modal */}
        <AnimatePresence>
          {playingVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
              onClick={handleCloseVideo}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Loading State */}
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-12 h-12 text-neon-cyan animate-spin" />
                      <p className="text-muted-foreground">Loading video...</p>
                    </div>
                  </div>
                )}
                
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube-nocookie.com/embed/${playingVideo}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="w-full h-full"
                  onLoad={handleIframeLoad}
                />
              </motion.div>
              
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.2 }}
                onClick={handleCloseVideo}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Open on YouTube Link */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
                onClick={() => openOnYouTube(playingVideo)}
                className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium flex items-center gap-2 hover:bg-red-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                Open on YouTube
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Grid with Scroll */}
        <div className="relative group">
          <motion.button
            onClick={() => scroll('left')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/95 border border-border/50 flex items-center justify-center hover:bg-muted transition-all opacity-0 group-hover:opacity-100 shadow-lg -translate-x-2 group-hover:translate-x-0 hidden sm:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <div
            id="video-scroll-container"
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.08,
                  type: "spring",
                  damping: 20,
                  stiffness: 200
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="flex-shrink-0 w-[280px] group/card cursor-pointer"
                onClick={() => handlePlayVideo(video.id)}
              >
                <div className="relative rounded-xl overflow-hidden mb-3 shadow-lg">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full aspect-video object-cover group-hover/card:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to mqdefault if maxresdefault fails
                      const target = e.target as HTMLImageElement;
                      if (target.src.includes('maxresdefault')) {
                        target.src = target.src.replace('maxresdefault', 'mqdefault');
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-300" />
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.div 
                      className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl shadow-red-600/40"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Play className="w-7 h-7 text-white ml-1" fill="white" />
                    </motion.div>
                  </motion.div>
                  <Badge 
                    className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] capitalize border-0"
                  >
                    {video.category}
                  </Badge>
                </div>
                <h4 className="font-medium text-sm line-clamp-2 group-hover/card:text-neon-cyan transition-colors duration-300">
                  {video.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-500" />
                  {video.channel}
                </p>
              </motion.div>
            ))}

            {/* Search More Card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: filteredVideos.length * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="flex-shrink-0 w-[280px] cursor-pointer"
              onClick={handleYouTubeSearch}
            >
              <div className="w-full aspect-video rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-3 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all duration-300 group/search">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Search className="w-10 h-10 text-muted-foreground group-hover/search:text-neon-cyan transition-colors" />
                </motion.div>
                <span className="text-sm text-muted-foreground group-hover/search:text-neon-cyan transition-colors">Search more on YouTube</span>
              </div>
            </motion.div>
          </div>

          <motion.button
            onClick={() => scroll('right')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/95 border border-border/50 flex items-center justify-center hover:bg-muted transition-all opacity-0 group-hover:opacity-100 shadow-lg translate-x-2 group-hover:translate-x-0 hidden sm:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Quick Links */}
        <motion.div 
          className="mt-6 pt-4 border-t border-border/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xs text-muted-foreground mb-3">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {['Stock Market Basics', 'Mutual Funds India', 'SIP Investment', 'Tax Saving Tips', 'Credit Score'].map((term, index) => (
              <motion.button
                key={term}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const query = encodeURIComponent(term);
                  window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
                }}
                className="px-4 py-1.5 text-xs rounded-full bg-muted/50 hover:bg-neon-cyan/10 hover:text-neon-cyan border border-border/50 hover:border-neon-cyan/30 transition-all duration-300"
              >
                {term}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
