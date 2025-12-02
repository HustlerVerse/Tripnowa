import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiStar } from 'react-icons/fi';

interface PlaceCardProps {
  place: {
    _id: string;
    name: string;
    country: string;
    description: string;
    shortDescription?: string;
    images: string[];
    bestTime: string;
    category: string;
    rating?: number;
    isWorldWonder?: boolean;
    isTrending?: boolean;
    budget?: string;
  };
  showNumber?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function PlaceCard({ place, showNumber, className = '', style }: PlaceCardProps) {
  const image = place.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800';
  const rating = place.rating || 0;
  const budget = place.budget || '';
  const description = place.shortDescription || place.description || '';

  return (
    <Link
      href={`/places/${place._id}`}
      className={`group glass-card overflow-hidden hover-lift ${className}`}
      style={style}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={place.name}
          fill
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/80 via-transparent to-transparent" />

        {/* Rating Badge */}
        {rating > 0 && !showNumber && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-[#0f0f0f]/80 backdrop-blur-sm">
            <FiStar className="h-3 w-3 fill-orange-500 text-orange-500" />
            <span className="text-xs font-medium">{rating}</span>
          </div>
        )}

        {/* Number Badge for Wonders */}
        {showNumber && (
          <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
            <span className="font-display font-bold text-white">
              {showNumber}
            </span>
          </div>
        )}

        {/* World Wonder Badge */}
        {place.isWorldWonder && !showNumber && (
          <div className="absolute top-4 left-4 px-2 py-1 rounded-full bg-orange-500/90 text-white text-xs font-medium">
            World Wonder
          </div>
        )}

        {/* Trending Badge */}
        {place.isTrending && !place.isWorldWonder && !showNumber && (
          <div className="absolute top-4 left-4 px-2 py-1 rounded-full bg-teal-500/90 text-white text-xs font-medium">
            Trending
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
          <FiMapPin className="h-3 w-3" />
          <span>{place.country}</span>
        </div>
        <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-teal-400 transition-colors duration-300">
          {place.name}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {description}
        </p>
        <div className="flex items-center justify-between">
          {budget && (
            <span className="text-sm text-gray-400">
              {budget}
            </span>
          )}
          <span className="text-teal-400 text-sm font-medium group-hover:underline">
            Learn more →
          </span>
        </div>
      </div>
    </Link>
  );
}
