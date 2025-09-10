import React, { useState } from 'react';
import { Calendar, Share2, Eye } from 'lucide-react';
import { Button } from '@/components/atoms/Button/Button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl?: string;
  category: string;
  publishedAt: string;
  onShare?: (id: string) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  excerpt,
  content,
  imageUrl,
  category,
  publishedAt,
  onShare
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  const handleShare = () => {
    if (onShare) {
      onShare(id);
    } else {
      // Default share functionality
      if (navigator.share) {
        navigator.share({
          title,
          text: excerpt,
          url: window.location.href
        });
      }
    }
  };

  const handleReadMore = () => {
    router.push(`/news/${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-sky-100">
      {imageUrl && (
        <div className="relative overflow-hidden h-48">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-sky-100 to-blue-100 animate-pulse" />
          )}
          <img
            src={imageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <Badge 
            className="absolute top-3 left-3 bg-white/90 text-sky-700 hover:bg-white"
          >
            {category}
          </Badge>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(publishedAt).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-sky-700 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {excerpt}
        </p>
        
        {isExpanded && content && (
          <div className="text-gray-700 mb-4 animate-in slide-in-from-top-2 duration-300">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {content && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReadMore}
                className="hover:bg-sky-50 hover:border-sky-300"
              >
                <Eye className="w-4 h-4 mr-1" />
                Read More
              </Button>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="hover:bg-sky-50 hover:text-sky-700"
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};